import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ChevronRight } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getPredictions } from "@/app/actions/predictions";
import { TwitchCoin } from "@/components/icons/twitch-coin";

export async function AppSidebar() {
  const predictions = await getPredictions();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/logo.png"
                    alt="Logo SA Twitch App"
                    width={32}
                    height={32}
                    className="size-8"
                  />
                </div>
                <div className="grid gap-0.5">
                  <span className="text-sm font-semibold">SA Twitch App</span>
                  <span className="text-xs text-muted-foreground">Accueil</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overlays</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible defaultOpen>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Prédictions">
                  <Link href="/prediction" className="flex-1">
                    <TwitchCoin />
                    <span>Prédictions</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="transition-transform duration-200 data-[state=open]:rotate-90">
                    <ChevronRight className="size-4" />
                    <span className="sr-only">Afficher les prédictions</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
              </SidebarMenuItem>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {predictions.length === 0 ? (
                    <SidebarMenuSubItem>
                      <span className="block px-4 py-2 text-sm text-muted-foreground">
                        Aucune prédiction
                      </span>
                    </SidebarMenuSubItem>
                  ) : (
                    predictions.map((prediction) => (
                      <SidebarMenuSubItem key={prediction.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/prediction/${prediction.id}`}>
                            {prediction.name}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  )}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/prediction/new">
                        <Plus className="size-4" />
                        <span>Nouvelle Prédiction</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex items-center gap-2 p-2">
        <UserNav />
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
