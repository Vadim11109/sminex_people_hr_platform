import { redirect } from 'next/navigation'

// DEV: redirect to manager dashboard for quick preview
// In prod, proxy.ts handles role-based routing
export default function RootPage() {
  redirect('/manager')
}
