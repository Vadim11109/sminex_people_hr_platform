# Развёртывание в корпоративном контуре (self-host)

Руководство для DevOps по подъёму **Sminex People** в собственной инфраструктуре
(Docker / Kubernetes / VM). Для деплоя на Vercel см. [SETUP.md](SETUP.md).

Приложение — Next.js 16 (standalone) + PostgreSQL (Prisma 7) + NextAuth
(Microsoft Entra ID). Стейтлес: всё состояние в БД, файлы на диск не пишутся —
можно масштабировать горизонтально.

---

## 1. Что нужно подготовить на вашей стороне

| Компонент | Требование |
|---|---|
| **PostgreSQL** | 14+. Пустая база + пользователь с правами на DDL (миграции создают таблицы). Строка подключения → `DATABASE_URL` |
| **Регистрация в Entra ID** | Приложение в вашем тенанте. Redirect URI: `{NEXTAUTH_URL}/api/auth/callback/microsoft-entra-id`. Выдать Client ID / Client Secret / Tenant ID |
| **Домен + TLS** | Внутренний домен и сертификат. Приложение слушает HTTP :3000 — TLS терминируется на reverse-proxy / ingress |
| **Секреты** | Прокинуть переменные окружения из вашего секрет-хранилища (Vault / k8s Secret). Файлы `.env` в проде не используются |
| **Сетевой доступ** | Из контейнера: до PostgreSQL и до `login.microsoftonline.com` (или вашего внутреннего Entra/ADFS) |
| **Container runtime** | Любой (Docker, containerd, k8s). Образ собирается из `Dockerfile` в корне |

---

## 2. Переменные окружения

Полный список — в [`.env.example`](../.env.example). Обязательные:

```
DATABASE_URL            postgresql://user:pass@host:5432/sminex_people?sslmode=require
NEXTAUTH_URL            https://people.sminex.corp
NEXTAUTH_SECRET         <openssl rand -base64 32>
AZURE_AD_CLIENT_ID      <из регистрации приложения>
AZURE_AD_CLIENT_SECRET  <из регистрации приложения>
AZURE_AD_TENANT_ID      <ваш тенант>
NODE_ENV                production
```

Опционально: `RUN_MIGRATIONS=false` — если миграции применяются отдельным
init-контейнером/Job (рекомендуется при нескольких репликах, см. §5).

---

## 3. Сборка образа

```bash
docker build -t sminex-people:1.0 .
```

- Многостадийная сборка, финальный образ на `node:22-slim`, запуск под non-root.
- Внутри: `prisma generate && next build` (standalone). `DATABASE_URL` на этапе
  сборки не требуется (подставляется пустышка) — реальная база нужна только в рантайме.
- В образ кладётся Prisma CLI + схема + миграции, чтобы применять их на старте
  **без обращения в интернет** (актуально для закрытого контура).

---

## 4. Миграции базы

Схема применяется командой `prisma migrate deploy` (только применяет уже
существующие файлы миграций из `prisma/migrations`, ничего не генерирует и данные
не трогает). Есть два режима:

**A. Автоматически на старте (по умолчанию).** `docker-entrypoint.sh` выполняет
`prisma migrate deploy` перед запуском сервера. Подходит для одной реплики / пилота.

**B. Отдельным шагом (рекомендуется для нескольких реплик).** Чтобы реплики не
мигрировали одновременно — запускать миграцию как init-container / Job тем же
образом, а приложению выставить `RUN_MIGRATIONS=false`:

```bash
docker run --rm -e DATABASE_URL="$DATABASE_URL" \
  --entrypoint ./node_modules/.bin/prisma \
  sminex-people:1.0 migrate deploy
```

---

## 5. Запуск

### Docker (одиночный хост / пилот)

```bash
docker run -d --name sminex-people -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@db-host:5432/sminex_people?sslmode=require" \
  -e NEXTAUTH_URL="https://people.sminex.corp" \
  -e NEXTAUTH_SECRET="<secret>" \
  -e AZURE_AD_CLIENT_ID="<id>" \
  -e AZURE_AD_CLIENT_SECRET="<secret>" \
  -e AZURE_AD_TENANT_ID="<tenant>" \
  sminex-people:1.0
```

### Kubernetes (эскиз)

- **Deployment** из образа, `containerPort: 3000`, env из `Secret`.
- **Migration** — `initContainer` (или отдельный `Job`) с тем же образом и
  `command: ["./node_modules/.bin/prisma","migrate","deploy"]`; в основном
  контейнере `RUN_MIGRATIONS=false`.
- **Пробы:**
  - `readinessProbe` / `livenessProbe` → `GET /api/health` (200 = приложение + БД живы, 503 = БД недоступна).
- **Service** + **Ingress** с TLS, host = `NEXTAUTH_URL`.

---

## 6. Reverse-proxy / TLS

Приложение отдаёт HTTP на :3000; TLS — на прокси/ingress. Требования:
- Пробрасывать `X-Forwarded-Proto: https` и `Host` — NextAuth формирует
  callback-URL по ним; иначе OAuth-редирект сломается.
- `NEXTAUTH_URL` = внешний https-адрес (тот же, что зарегистрирован в Entra).

---

## 7. Регистрация приложения в Entra ID

1. Entra admin center → **App registrations** → **New registration**.
2. **Redirect URI** (тип Web): `https://people.sminex.corp/api/auth/callback/microsoft-entra-id`.
3. Скопировать **Application (client) ID** → `AZURE_AD_CLIENT_ID`.
4. **Certificates & secrets** → new client secret → значение в `AZURE_AD_CLIENT_SECRET`.
5. **Directory (tenant) ID** → `AZURE_AD_TENANT_ID`.
6. Разрешения: базового `openid profile email` (User.Read) достаточно для входа.

Подробнее — в [SETUP.md](SETUP.md), раздел «Настройка Azure AD».

---

## 8. Первичная настройка после первого запуска

- Роли (`EMPLOYEE` / `MANAGER` / `HR`) назначаются в БД, не выбираются
  пользователем. Первый HR-администратор проставляется вручную:
  ```sql
  UPDATE "User" SET roles = ARRAY['HR','MANAGER','EMPLOYEE']::"UserRole"[]
  WHERE email = 'hr-admin@sminex.corp';
  ```
  (пользователь появляется в таблице после первого входа через Entra).
- Наполнение пилотными данными (шаблон PO, связи руководитель→сотрудник, цикл) —
  через seed-скрипт; на момент передачи он готовится отдельно.

> ⚠️ **Важно:** в текущей сборке в layout'ах включены dev-мок-сессии (авторизация
> обойдена) и часть страниц на демо-данных. Перед реальным использованием их нужно
> отключить — это отдельный шаг перед пилотом, не блокирующий подъём инфраструктуры.

---

## 9. Наблюдаемость и эксплуатация

- **Health:** `GET /api/health` → `{status:"ok",db:"up"}` (200) либо 503, если БД недоступна.
- **Логи:** пишутся в stdout/stderr (json-логи Next). Prisma в проде логирует только ошибки.
- **Стейт:** приложение стейтлес — рестарт/масштабирование безопасны, состояние в БД.
- **Бэкапы:** отвечает штатный бэкап PostgreSQL; в приложении отдельного стораджа нет.

---

## 10. Быстрый чек-лист передачи

- [ ] Поднят PostgreSQL, есть `DATABASE_URL`
- [ ] Зарегистрировано приложение в Entra, есть client/secret/tenant
- [ ] Сгенерирован `NEXTAUTH_SECRET`, задан `NEXTAUTH_URL`
- [ ] Секреты заведены в хранилище
- [ ] Собран образ `docker build`
- [ ] Применены миграции (`prisma migrate deploy`) — авто или init-container
- [ ] Настроен ingress/TLS, проброшены `X-Forwarded-Proto` и `Host`
- [ ] `GET /api/health` отвечает 200
- [ ] Вход через Entra работает, назначен первый HR
