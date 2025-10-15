"use client"

import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "./auth-provider"
import { LogIn, LogOut, User as UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserNav() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    }

    if (loading) {
      return null; // Or a loading skeleton
    }

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                 <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
        )
    }

    const initial = user.email ? user.email.charAt(0).toUpperCase() : <UserIcon />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-full justify-start gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1 truncate group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium leading-none truncate">{user.email}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || "Farmer"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
