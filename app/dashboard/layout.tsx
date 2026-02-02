import { getCurrentUser } from '@/services/users'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
import DashboardTabs from '@/components/DashboardTabs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <DashboardTabs />
        {children}
      </div>
    </div>
  )
}