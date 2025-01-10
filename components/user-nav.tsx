"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, User, LogIn } from "lucide-react";

export function UserNav() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Button
              onClick={() => signIn("discord", { callbackUrl: "/prediction" })}
              className="w-full justify-start gap-2 bg-primary hover:bg-secondary/90 dark:bg-primary dark:hover:bg-secondary/90"
            >
              <LogIn className="size-4" />
              <span className="font-medium">Connexion avec Discord</span>
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="relative h-10 w-full hover:bg-accent transition-colors">
              <div className="flex w-full items-center gap-3">
                <Avatar className="size-7 border-2 border-primary">
                  <AvatarImage
                    src={session.user.image!}
                    alt={session.user.name!}
                  />
                  <AvatarFallback>
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden text-left">
                  <p className="truncate text-sm font-medium">
                    {session.user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive gap-2 font-medium"
              onClick={() => signOut()}
            >
              <LogOut className="size-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
