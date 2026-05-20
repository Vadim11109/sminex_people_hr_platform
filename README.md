# Sminex People — HR Platform

Платформа оценки и развития сотрудников компании Sminex.  
Построена на Next.js 16 + Prisma 7 + PostgreSQL + Azure AD SSO.

---

## Быстрый старт

```bash
npm install
npm run dev        # → http://localhost:3000
```

> Без подключённой БД платформа работает в демо-режиме с мок-данными.  
> Инструкция по подключению — [docs/SETUP.md](docs/SETUP.md)

---

## Документация

| Файл | Описание |
|------|----------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Стек, структура проекта, маршруты, компоненты |
| [docs/DATABASE.md](docs/DATABASE.md) | Схема БД, модели Prisma, связи между таблицами |
| [docs/API.md](docs/API.md) | REST API — все эндпоинты, параметры, ответы |
| [docs/ASSESSMENT.md](docs/ASSESSMENT.md) | Логика ассесмента, компетенции, система грейдов |
| [docs/ROLES.md](docs/ROLES.md) | Роли пользователей, права доступа, сценарии работы |
| [docs/SETUP.md](docs/SETUP.md) | Подключение PostgreSQL, Azure AD, деплой на Vercel |

---

## Статус готовности

| Компонент | Статус |
|-----------|--------|
| UI / Frontend | Готово |
| Система грейдов | Готово |
| Логика ассесмента (мок) | Готово |
| API эндпоинты | Реализованы |
| Prisma-схема | Готова |
| База данных | Не подключена — нужен `DATABASE_URL` |
| Azure AD SSO | Настроен — нужен `CLIENT_ID` / `CLIENT_SECRET` |
| Деплой | Не настроен |
