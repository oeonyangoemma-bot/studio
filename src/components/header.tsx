import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "./ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="md:hidden">
         <SidebarTrigger />
       </div>
       <div className="flex-1" />
       <div className="flex items-center gap-2">
           <Button asChild variant="ghost">
              <Link href="#">Login</Link>
          </Button>
          <Button asChild>
              <Link href="#">Sign Up</Link>
          </Button>
       </div>
    </header>
  )
}
