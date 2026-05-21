import { COMPETENCIES } from './assessment-data'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface TemplateCriterion {
  id: string
  name: string
  j: string
  m: string
  s: string
}

export interface TemplateCompetency {
  id: string
  code: string
  name: string
  sub: string
  criteria: TemplateCriterion[]
}

export interface TemplateData {
  id: string
  name: string
  description: string
  role: string
  status: 'active' | 'archive' | 'draft'
  cycles: number
  competencies: TemplateCompetency[]
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function emptyCompetency(): TemplateCompetency {
  return { id: uid(), code: '', name: '', sub: '', criteria: [emptyCriterion()] }
}

export function emptyCriterion(): TemplateCriterion {
  return { id: uid(), name: '', j: '', m: '', s: '' }
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PO_COMPETENCIES: TemplateCompetency[] = COMPETENCIES.map(c => ({
  id: `c-${c.code.toLowerCase()}`,
  code: c.code,
  name: c.name,
  sub: c.sub,
  criteria: c.subs.map((s, i) => ({
    id: `${c.code}-${i}`,
    name: s.name,
    j: s.j,
    m: s.m,
    s: s.s,
  })),
}))

export const TEMPLATES: TemplateData[] = [
  {
    id: 'product-owner-v2',
    name: 'Product Owner v2',
    description: 'Актуальная версия для PO и PM. 9 компетенций, 3 уровня оценки.',
    role: 'Product Owner / Product Manager',
    status: 'active',
    cycles: 4,
    competencies: PO_COMPETENCIES,
  },
  {
    id: 'product-owner-v1',
    name: 'Product Owner v1',
    description: 'Первая версия шаблона PO. Архивная, использовалась до Q2 2024.',
    role: 'Product Owner',
    status: 'archive',
    cycles: 2,
    competencies: PO_COMPETENCIES.slice(0, 8),
  },
  {
    id: 'backend',
    name: 'Backend разработчик',
    description: 'Для серверной разработки: архитектура, код-ревью, надёжность систем.',
    role: 'Backend Developer',
    status: 'draft',
    cycles: 0,
    competencies: [],
  },
  {
    id: 'frontend',
    name: 'Frontend разработчик',
    description: 'Для разработки интерфейсов: качество кода, UX-мышление, производительность.',
    role: 'Frontend Developer',
    status: 'draft',
    cycles: 0,
    competencies: [],
  },
  {
    id: 'bim-manager',
    name: 'BIM-менеджер',
    description: 'Управление информационными моделями зданий, координация проектирования.',
    role: 'BIM Manager',
    status: 'draft',
    cycles: 0,
    competencies: [],
  },
  {
    id: 'engineer',
    name: 'Инженер-строитель',
    description: 'Технический надзор, контроль качества строительства, работа с подрядчиками.',
    role: 'Инженер-строитель',
    status: 'draft',
    cycles: 0,
    competencies: [],
  },
  {
    id: 'safety-manager',
    name: 'Менеджер по охране труда',
    description: 'Соблюдение норм ОТиПБ на строительных объектах, проверки, обучение.',
    role: 'Менеджер по охране труда',
    status: 'draft',
    cycles: 0,
    competencies: [],
  },
  {
    id: 'sales-manager',
    name: 'Менеджер по продажам',
    description: 'Продажа объектов недвижимости, работа с клиентами, воронка сделок.',
    role: 'Менеджер по продажам',
    status: 'draft',
    cycles: 0,
    competencies: [],
  },
  {
    id: 'appraiser',
    name: 'Оценщик недвижимости',
    description: 'Оценка рыночной стоимости объектов, подготовка отчётов, экспертиза.',
    role: 'Оценщик недвижимости',
    status: 'draft',
    cycles: 0,
    competencies: [],
  },
  {
    id: 'project-manager',
    name: 'Руководитель проекта',
    description: 'Управление строительным проектом: сроки, бюджет, подрядчики, сдача объекта.',
    role: 'Руководитель проекта',
    status: 'draft',
    cycles: 0,
    competencies: [],
  },
]

export function getTemplate(id: string): TemplateData | undefined {
  return TEMPLATES.find(t => t.id === id)
}
