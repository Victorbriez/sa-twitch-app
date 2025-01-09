"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { createPrediction } from "@/app/actions/predictions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

export default function NewPredictionPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createPrediction(formData);

      if (result.success) {
        toast({
          title: "Prédiction créée",
          description: "Votre prédiction a été créée avec succès",
        });
        router.push("/prediction");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur lors de la création",
          description: result.error,
        });
      }
    });
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
              <BreadcrumbPage>Nouvelle prédiction</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl">
          <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-md">
            <CardHeader>
              <CardTitle>Nouvelle Prédiction</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={onSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nom de la prédiction"
                    disabled={isPending}
                    required
                    minLength={3}
                  />
                </div>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Création..." : "Créer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
