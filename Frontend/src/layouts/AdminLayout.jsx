import PropTypes from 'prop-types';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAdmin } from '@/context/AdminContext';

const AdminLayout = ({ children }) => {
  const { user, userRole } = useAdmin();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden bg-gray-900 text-white">
        <div className="fixed inset-y-0 left-0 z-30">
          <AppSidebar user={user} userRole={userRole} />
        </div>
        
        <div className="w-full pl-[var(--sidebar-width)]">
          <div className="h-12 px-4 flex items-center">
            <SidebarTrigger className="opacity-70 hover:opacity-100" />
          </div>
          
          <main className="px-6 py-2">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
