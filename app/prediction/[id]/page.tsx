import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function PredictionPage({
  params,
}: {
  params: { id: string };
}) {
  const prediction = await prisma.prediction.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!prediction) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/prediction">Prédictions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{prediction.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl">
          <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">{prediction.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Créé le
                  </p>
                  <p className="text-sm">
                    {prediction.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Dernière modification
                  </p>
                  <p className="text-sm">
                    {prediction.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
