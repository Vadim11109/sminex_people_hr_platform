# Настройка и деплой — Sminex People

## Локальная разработка

### 1. Установка зависимостей

```bash
cd sminex-people
npm install
```

### 2. Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# ─── База данных ───────────────────────────────────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

# ─── NextAuth ──────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="сгенерируйте: openssl rand -base64 32"

# ─── Microsoft Azure AD ────────────────────────────────────────
AUTH_MICROSOFT_ENTRA_ID_ID="ваш CLIENT_ID"
AUTH_MICROSOFT_ENTRA_ID_SECRET="ваш CLIENT_SECRET"
AUTH_MICROSOFT_ENTRA_ID_ISSUER="https://login.microsoftonline.com/TENANT_ID/v2.0"
```

### 3. Генерация Prisma Client

```bash
npx prisma generate
```

### 4. Миграция базы данных

```bash
npx prisma migrate dev --name init
```

### 5. Запуск

```bash
npm run dev
# → http://localhost:3000
```

---

## Подключение базы данных

### Вариант A — Supabase (рекомендуется)

1. Создайте проект на [supabase.com](https://supabase.com)
2. Перейдите: Settings → Database → Connection string → **URI**
3. Скопируйте строку подключения, замените `[YOUR-PASSWORD]` на пароль проекта
4. Вставьте в `DATABASE_URL` в `.env.local`

```env
DATABASE_URL="postgresql://postgres.xxxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Вариант B — Neon

1. Создайте проект на [neon.tech](https://neon.tech)
2. Скопируйте connection string
3. Вставьте в `DATABASE_URL`

### Вариант C — Локальный PostgreSQL

```bash
# macOS с Homebrew
brew install postgresql@16
brew services start postgresql@16

createdb sminex_people
```

```env
DATABASE_URL="postgresql://localhost:5432/sminex_people"
```

---

## Настройка Azure AD (Microsoft Entra ID)

### 1. Регистрация приложения

1. Откройте [portal.azure.com](https://portal.azure.com)
2. Azure Active Directory → App registrations → **New registration**
3. Имя: `Sminex People`
4. Supported account types: **Accounts in this organizational directory only**
5. Redirect URI: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
6. Нажмите Register

### 2. Получение Client ID

На странице приложения скопируйте **Application (client) ID** → это `AUTH_MICROSOFT_ENTRA_ID_ID`

### 3. Создание Client Secret

Certificates & secrets → New client secret → скопируйте **Value** → это `AUTH_MICROSOFT_ENTRA_ID_SECRET`

### 4. Tenant ID

На странице Overview скопируйте **Directory (tenant) ID** → используется в `AUTH_MICROSOFT_ENTRA_ID_ISSUER`

### 5. Добавление Redirect URI для production

Authentication → Add URI:
```
https://your-domain.vercel.app/api/auth/callback/microsoft-entra-id
```

### 6. Разрешения API (если нужна синхронизация из AD)

API permissions → Add permission → Microsoft Graph:
- `User.Read` — базовый вход
- `User.ReadBasic.All` — чтение всех пользователей (для будущей синхронизации)

---

## Деплой на Vercel

### 1. Подготовка

```bash
# Убедитесь что build проходит
npm run build
```

### 2. Деплой

```bash
# Установите Vercel CLI
npm i -g vercel

vercel
```

Или подключите GitHub репозиторий в [vercel.com](https://vercel.com).

### 3. Переменные окружения в Vercel

В настройках проекта → Environment Variables добавьте все переменные из `.env.local`:

```
DATABASE_URL
NEXTAUTH_URL        → https://your-domain.vercel.app
NEXTAUTH_SECRET
AUTH_MICROSOFT_ENTRA_ID_ID
AUTH_MICROSOFT_ENTRA_ID_SECRET
AUTH_MICROSOFT_ENTRA_ID_ISSUER
```

### 4. Миграция БД (один раз)

```bash
# Запустить против production БД
DATABASE_URL="..." npx prisma migrate deploy
```

---

## Первоначальная настройка после деплоя

### 1. Создание первого HR-администратора

После подключения БД и настройки Azure AD:

1. Войдите на платформу через Microsoft — будет создан User с ролью `EMPLOYEE`
2. Откройте Prisma Studio или выполните SQL:

```sql
UPDATE "User"
SET roles = '{HR}'
WHERE email = 'your-email@sminex.ru';
```

3. Теперь вы можете управлять ролями через `/hr/users`

### 2. Создание тестовых данных (опционально)

```bash
# Если создан файл prisma/seed.ts
npx prisma db seed
```

---

## Отключение dev-режима (переход в production)

В `src/proxy.ts` включите реальную авторизацию:

```ts
// Раскомментировать:
export { auth as middleware } from '@/lib/auth'

// Закомментировать мок:
// export function middleware() { return NextResponse.next() }
```

В каждом `layout.tsx` замените мок-сессию на реальную:

```ts
// Было:
const mockSession = { user: { ... } }

// Стало:
import { auth } from '@/lib/auth'
const session = await auth()
if (!session) redirect('/auth/signin')
```

---

## Команды

```bash
npm run dev          # Запуск dev-сервера (http://localhost:3000)
npm run build        # Production build
npm run start        # Запуск production-сервера
npm run lint         # Линтер

npx prisma generate  # Генерация Prisma Client
npx prisma migrate dev --name NAME  # Создание и применение миграции
npx prisma migrate deploy           # Применение миграций (production)
npx prisma studio    # GUI для БД (http://localhost:5555)
npx prisma db push   # Синхронизация схемы без миграций (не для prod)
```
