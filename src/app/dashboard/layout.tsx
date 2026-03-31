// app/dashboard/layout.tsx
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {

  return (
    <div className="radial-glow-bg min-h-screen w-full">
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <main className="radial-glow-bg relative z-10 flex flex-col gap-3 min-h-screen p-2 md:p-2 ">
            <DashboardNavbar />
            <div className="glass rounded-2xl flex-1 p-6 border border-[rgba(0,255,170,0.15)]">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
