# База данных — Sminex People

## Технологии

- **СУБД:** PostgreSQL (рекомендуется Supabase или Neon для облака)
- **ORM:** Prisma 7 с адаптером `@prisma/adapter-pg`
- **Конфиг:** `prisma/schema.prisma`
- **Клиент:** `src/lib/prisma.ts` — singleton с поддержкой hot-reload

---

## Схема

### Enums

```prisma
enum UserRole {
  EMPLOYEE   // Сотрудник — проходит само-оценку
  MANAGER    // Руководитель — оценивает свою команду
  HR         // HR — управляет платформой
}

enum CycleStatus {
  DRAFT      // Создан, участники не выбраны
  ACTIVE     // Запущен, ассесменты идут
  CLOSED     // Завершён
}

enum AssessmentStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}
```

---

### Модели

#### `User`
Основная сущность. Создаётся автоматически при первом входе через Azure AD.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | String (cuid) | Первичный ключ |
| `email` | String (unique) | Email из Azure AD |
| `name` | String? | Имя из Azure AD |
| `image` | String? | Фото из Azure AD |
| `azureId` | String? (unique) | Object ID из Azure AD |
| `roles` | UserRole[] | Роли — назначаются HR, default `[EMPLOYEE]` |
| `managerId` | String? | FK → User (руководитель) |
| `team` | String? | Название команды |
| `position` | String? | Должность |
| `createdAt` | DateTime | Дата первого входа |

**Связи:**
- `manager` → `User` (самоссылка, руководитель)
- `reports` → `User[]` (подчинённые)
- `accounts`, `sessions` → NextAuth-модели
- `selfAssessments` → все само-оценки пользователя
- `managerAssessments` → оценки, которые он делал (как менеджер)
- `subjectOf` → оценки, которые делали на него
- `cyclesCreated` → циклы, созданные этим HR

---

#### `AssessmentTemplate`
Шаблон оценки — структура компетенций для конкретной роли.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | String (cuid) | Первичный ключ |
| `name` | String | Название (напр. "Product Owner v2") |
| `description` | String? | Описание |
| `version` | String | Версия, default "1.0" |
| `isActive` | Boolean | Активный шаблон цикла |
| `content` | Json | Полная структура компетенций в JSON |

`content` — это массив объектов `Competency[]` из `src/lib/assessment-data.ts`.

---

#### `AssessmentCycle`
Цикл оценки — привязан к шаблону и содержит набор назначений.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | String (cuid) | Первичный ключ |
| `name` | String | Название (напр. "Q1 2025") |
| `status` | CycleStatus | `DRAFT` → `ACTIVE` → `CLOSED` |
| `startsAt` | DateTime | Дата начала |
| `endsAt` | DateTime? | Дата окончания |
| `templateId` | String | FK → AssessmentTemplate |
| `createdById` | String | FK → User (кто создал, HR) |

---

#### `Assignment`
Назначение — связь конкретного сотрудника с циклом оценки.  
Создаётся HR при запуске цикла через `/hr/cycles` → «Запустить».

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | String (cuid) | Первичный ключ |
| `cycleId` | String | FK → AssessmentCycle |
| `employeeId` | String | FK → User (сотрудник) |
| `managerId` | String | FK → User (руководитель на момент создания) |

**Уникальный индекс:** `(cycleId, employeeId)` — один сотрудник = одно назначение в цикле.

---

#### `SelfAssessment`
Само-оценка сотрудника. Один к одному с `Assignment`.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | String (cuid) | Первичный ключ |
| `assignmentId` | String (unique) | FK → Assignment |
| `userId` | String | FK → User (сотрудник) |
| `subRatings` | Json | `{"cid-si": 1\|2\|3}` — выбранный уровень по каждому субкритерию |
| `answers` | Json | `{"cid": {"qi": 1..5}}` — ответы на частотные вопросы |
| `examples` | Json | `{"cid": {"qi": "текст"}}` — примеры из практики |
| `compExamples` | Json | `{"cid": "текст"}` — общий пример по компетенции |
| `generalNote` | String? | Общий комментарий к оценке |
| `status` | AssessmentStatus | Статус заполнения |
| `completedAt` | DateTime? | Время завершения |

---

#### `ManagerAssessment`
Оценка руководителя. Один к одному с `Assignment`.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | String (cuid) | Первичный ключ |
| `assignmentId` | String (unique) | FK → Assignment |
| `assessorId` | String | FK → User (руководитель, кто оценивает) |
| `subjectId` | String | FK → User (сотрудник, кого оценивают) |
| `subRatings` | Json | `{"cid-si": 1\|2\|3}` — выбранный уровень |
| `comments` | Json | `{"cid": "текст"}` — комментарии по компетенциям |
| `generalNote` | String? | Общий комментарий |
| `devPlan` | String? | Индивидуальный план развития |
| `status` | AssessmentStatus | Статус заполнения |
| `completedAt` | DateTime? | Время завершения |

---

## Диаграмма связей

```
User ──────────── managerId ──────────────► User (manager)
 │                                           │
 │ reports[]                          reports[]
 │
 ├── SelfAssessment[] ─── assignmentId ──► Assignment ◄── cycleId ──── AssessmentCycle
 │                                          │                                │
 ├── ManagerAssessment[] (assessor)          │                         templateId
 │                                    employeeId                              │
 └── ManagerAssessment[] (subject)    managerId                    AssessmentTemplate
```

---

## NextAuth-модели

`Account`, `Session`, `VerificationToken` — стандартные модели NextAuth, не требуют модификации.

---

## Инициализация

```bash
# Сгенерировать Prisma Client
npx prisma generate

# Создать таблицы в БД
npx prisma migrate dev --name init

# Открыть Prisma Studio (GUI)
npx prisma studio
```
