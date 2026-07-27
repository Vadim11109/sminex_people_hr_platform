// Опросники внешних оценщиков (заказчик / РЦЭ) — компактная версия методики v2.1.
export interface QOption { value: number; label: string }
export interface Question { key: string; text: string }
export interface Questionnaire {
  intro: string
  openLabel: string
  options: QOption[]
  questions: Question[]
}

const CUSTOMER: Questionnaire = {
  intro: 'Обратная связь бизнес-заказчика о работе Product Owner. Оцените по шкале ожиданий; выберите «Не могу оценить», если наблюдений недостаточно.',
  openLabel: 'Что PO делает особенно ценно и что стоит усилить?',
  options: [
    { value: 3, label: 'Выше ожиданий' },
    { value: 2, label: 'На уровне' },
    { value: 1, label: 'Ниже ожиданий' },
  ],
  questions: [
    { key: 'c1', text: 'Понимание ваших целей и проблемы' },
    { key: 'c2', text: 'Польза решений PO для бизнеса' },
    { key: 'c3', text: 'Управление ожиданиями' },
    { key: 'c4', text: 'Предсказуемость результатов работы' },
    { key: 'c5', text: 'Понятность приоритетов' },
  ],
}

const RCE: Questionnaire = {
  intro: 'Оценка Центра экспертизы (бэк / фронт / 1С / QA / системный анализ / UX): качество постановки задач команде и совместного взаимодействия. Шкала уровня.',
  openLabel: 'Где PO помогает вашей экспертизе, а что мешает совместной работе?',
  options: [
    { value: 3, label: 'Экспертный' },
    { value: 2, label: 'Самостоятельный' },
    { value: 1, label: 'Базовый' },
  ],
  questions: [
    { key: 'r1', text: 'Ясность цели и бизнес-контекста в задачах' },
    { key: 'r2', text: 'Готовность требований к старту (Definition of Ready)' },
    { key: 'r3', text: 'Качество декомпозиции задач' },
    { key: 'r4', text: 'Учёт технических и архитектурных ограничений' },
    { key: 'r5', text: 'Конструктивность взаимодействия с экспертизой' },
  ],
}

export function questionnaireFor(role: string): Questionnaire {
  return role === 'RCE' ? RCE : CUSTOMER
}

export function roleLabel(role: string): string {
  return role === 'RCE' ? 'РЦЭ' : 'Заказчик'
}
