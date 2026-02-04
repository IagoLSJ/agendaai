import { getCurrentUser } from '@/services/users'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
import DashboardSidebar from '@/components/DashboardSidebar'
import MobileBottomNav from '@/components/MobileBottomNav'

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <DashboardSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 transition-all duration-300">
        {/* Mobile Header */}
        <DashboardNav user={user} />

        {/* Scrollable Content */}
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full animate-fadeIn">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  )
}