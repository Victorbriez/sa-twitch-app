import { getPredictions } from "@/app/actions/predictions";
import { PredictionsList } from "@/components/predictions-list";
import { NewPredictionDialog } from "@/components/new-prediction-dialog";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";

export default async function PredictionPage() {
  const predictions = await getPredictions();

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Prédictions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Prédictions</h1>
              <p className="text-muted-foreground">
                Gérez vos overlays de prédictions Twitch
              </p>
            </div>
            <NewPredictionDialog>
              <Button size="sm">
                <Plus className="mr-2 size-4" />
                Nouvelle prédiction
              </Button>
            </NewPredictionDialog>
          </div>
          <PredictionsList predictions={predictions} />
        </div>
      </main>
    </div>
  );
}
