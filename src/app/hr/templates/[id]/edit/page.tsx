import { TemplateEditor } from '@/components/hr/TemplateEditor'
import { getTemplate } from '@/lib/template-data'
import { notFound } from 'next/navigation'

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const template = getTemplate(id)
  if (!template) notFound()
  return <TemplateEditor initialData={template} />
}
