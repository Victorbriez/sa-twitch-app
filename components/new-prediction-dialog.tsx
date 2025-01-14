"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { createPrediction } from "@/app/actions/predictions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NewPredictionDialogProps {
  children: React.ReactNode;
}

export function NewPredictionDialog({ children }: NewPredictionDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createPrediction(formData);

      if (result.success) {
        toast({
          title: "Prédiction créée",
          description: "Votre prédiction a été créée avec succès",
        });
        if (result.data) {
          router.push(`/prediction/${result.data.id}`);
        }
        setOpen(false);
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nouvelle Prédiction</AlertDialogTitle>
          <AlertDialogDescription>
            Créez une nouvelle prédiction pour votre stream.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={onSubmit} className="space-y-4 py-4">
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
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Annuler</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={isPending}>
              {isPending ? "Création..." : "Créer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
