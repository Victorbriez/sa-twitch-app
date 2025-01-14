"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deletePrediction } from "@/app/actions/predictions";

interface DeletePredictionAlertProps {
  predictionId: number;
  predictionName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePredictionAlert({
  predictionId,
  predictionName,
  isOpen,
  onOpenChange,
}: DeletePredictionAlertProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePrediction(predictionId.toString());
    if (result.success) {
      toast({
        title: "Prédiction supprimée",
        description: "La prédiction a été supprimée avec succès.",
      });
      router.refresh();
    } else {
      toast({
        title: "Erreur",
        description:
          result.error || "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    }
    setIsDeleting(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous sûr de vouloir supprimer cette prédiction ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera
            définitivement la prédiction &quot;{predictionName}&quot; et toutes
            les données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
