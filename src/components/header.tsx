import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "./user-nav";
import { AuthProvider } from "./auth-provider";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="md:hidden">
         <SidebarTrigger />
       </div>
       <div className="flex-1" />
       <div>
        <AuthProvider>
          <UserNav />
        </AuthProvider>
       </div>
    </header>
  )
}
