"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Accueil</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="h-full p-6 space-y-8">
          <h1>Accueil</h1>
        </div>
      </main>
    </div>
  );
}
