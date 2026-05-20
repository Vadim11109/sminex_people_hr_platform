# REST API — Sminex People

Все эндпоинты — Next.js Route Handlers в `src/app/api/`.  
Формат: JSON. Авторизация: сессия NextAuth (cookie).

---

## Пользователи

### `GET /api/users`
Возвращает список всех пользователей с ролями, руководителем и счётчиком подчинённых.

**Ответ `200`:**
```json
[
  {
    "id": "clx...",
    "name": "Анна Сидорова",
    "email": "a.sidorova@sminex.ru",
    "roles": ["EMPLOYEE"],
    "team": "IT-продукты",
    "position": "Product Owner",
    "createdAt": "2024-09-01T10:00:00.000Z",
    "manager": {
      "id": "clx...",
      "name": "Алексей Воронов",
      "email": "a.voronov@sminex.ru"
    },
    "_count": { "reports": 0 }
  }
]
```

**Ответ `503`** — БД недоступна:
```json
{ "error": "DB unavailable" }
```

---

### `PATCH /api/users/[id]`
Обновляет роли, руководителя, команду или должность пользователя.

**Тело запроса** (все поля опциональны):
```json
{
  "roles": ["EMPLOYEE", "MANAGER"],
  "managerId": "clx...",
  "team": "IT-продукты",
  "position": "Senior Product Owner"
}
```

**Ответ `200`:**
```json
{
  "id": "clx...",
  "name": "Анна Сидорова",
  "email": "a.sidorova@sminex.ru",
  "roles": ["EMPLOYEE", "MANAGER"],
  "team": "IT-продукты",
  "position": "Senior Product Owner",
  "manager": { "id": "clx...", "name": "Алексей Воронов" }
}
```

**Ответ `500`:**
```json
{ "error": "Update failed" }
```

---

## Циклы оценки

### `GET /api/cycles`
Возвращает список всех циклов с шаблоном, создателем и количеством назначений.

**Ответ `200`:**
```json
[
  {
    "id": "clx...",
    "name": "Q1 2025",
    "status": "ACTIVE",
    "startsAt": "2025-01-01T00:00:00.000Z",
    "endsAt": "2025-03-31T00:00:00.000Z",
    "template": { "id": "clx...", "name": "Product Owner v2" },
    "createdBy": { "id": "clx...", "name": "Dev HR" },
    "_count": { "assignments": 12 },
    "createdAt": "2024-12-15T10:00:00.000Z"
  }
]
```

---

### `POST /api/cycles`
Создаёт новый цикл оценки со статусом `DRAFT`.

**Тело запроса:**
```json
{
  "name": "Q2 2025",
  "templateId": "clx...",
  "startsAt": "2025-04-01",
  "endsAt": "2025-06-30",
  "createdById": "clx..."
}
```

**Ответ `201`:**
```json
{
  "id": "clx...",
  "name": "Q2 2025",
  "status": "DRAFT",
  "startsAt": "2025-04-01T00:00:00.000Z",
  "endsAt": "2025-06-30T00:00:00.000Z",
  "template": { "id": "clx...", "name": "Product Owner v2" },
  "_count": { "assignments": 0 }
}
```

---

### `GET /api/cycles/[id]/launch`
Возвращает список сотрудников, доступных для добавления в цикл, сгруппированных по руководителям.  
Исключает уже добавленных участников.

**Ответ `200`:**
```json
{
  "groups": [
    {
      "manager": {
        "id": "clx...",
        "name": "Алексей Воронов",
        "email": "a.voronov@sminex.ru"
      },
      "employees": [
        {
          "id": "clx...",
          "name": "Анна Сидорова",
          "email": "a.sidorova@sminex.ru",
          "team": "IT-продукты",
          "manager": { "id": "clx...", "name": "Алексей Воронов", "email": "..." }
        }
      ]
    }
  ],
  "alreadyAssigned": ["clx...", "clx..."]
}
```

---

### `POST /api/cycles/[id]/launch`
Создаёт назначения для выбранных сотрудников и переводит цикл в статус `ACTIVE`.  
Если цикл уже `ACTIVE` — просто добавляет новых участников (upsert).

**Тело запроса:**
```json
{
  "employeeIds": ["clx...", "clx...", "clx..."]
}
```

**Ответ `200`:**
```json
{ "ok": true, "created": 3 }
```

**Ответ `400`** — нет участников:
```json
{ "error": "No participants selected" }
```

**Ответ `400`** — цикл закрыт:
```json
{ "error": "Cycle is closed" }
```

**Ответ `500`:**
```json
{ "error": "Launch failed" }
```

---

## Аутентификация

### `GET|POST /api/auth/[...nextauth]`
Стандартный NextAuth handler.  
Обрабатывает OAuth callback от Microsoft Azure AD, создаёт сессию, создаёт/обновляет User в БД.

---

## Планируемые эндпоинты (не реализованы)

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/assignments` | Список назначений для текущего пользователя |
| `GET` | `/api/assignments/[id]` | Конкретное назначение с оценками |
| `POST` | `/api/assessments/self` | Сохранить/обновить само-оценку |
| `POST` | `/api/assessments/manager` | Сохранить/обновить оценку руководителя |
| `GET` | `/api/analytics/cycles/[id]` | Аналитика по циклу |
| `PATCH` | `/api/cycles/[id]` | Закрыть цикл (`status: CLOSED`) |
| `GET` | `/api/templates` | Список шаблонов |
| `POST` | `/api/templates` | Создать шаблон |
