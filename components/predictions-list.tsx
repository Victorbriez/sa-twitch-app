"use client";

import { useState } from "react";
import Link from "next/link";
import { type Prediction } from "@prisma/client";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  ExternalLink,
  Settings,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditPredictionDialog } from "@/components/edit-prediction-dialog";
import { DeletePredictionAlert } from "@/components/delete-prediction-dialog";

interface PredictionsListProps {
  predictions: Prediction[];
}

export function PredictionsList({ predictions }: PredictionsListProps) {
  const { toast } = useToast();
  const [editingPrediction, setEditingPrediction] = useState<Prediction | null>(
    null
  );
  const [deletingPrediction, setDeletingPrediction] =
    useState<Prediction | null>(null);

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans votre presse-papiers.",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {predictions.length === 0 && (
        <div className="col-span-full text-center">
          <h2 className="text-2xl font-bold mb-2">Aucune prédiction</h2>
          <p className="text-muted-foreground">
            Commencez par créer votre première prédiction !
          </p>
        </div>
      )}
      {predictions.map((prediction) => {
        const link = `http://localhost:3000/prediction/${prediction.name}/overlay`;

        return (
          <Card
            key={prediction.id}
            className="transition-all duration-200 hover:border-primary/50 hover:shadow-md flex flex-col justify-between group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold truncate">
                {prediction.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingPrediction(prediction);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Modifier</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setDeletingPrediction(prediction);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Supprimer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <CardDescription className="flex-1 mb-4 line-clamp-3 overflow-hidden text-ellipsis">
                {prediction.description || "Aucune description disponible."}
              </CardDescription>
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex gap-2">
                  <Button
                    className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(link);
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copier le lien
                  </Button>
                  <Button
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    variant="outline"
                    asChild
                  >
                    <Link href={link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Ouvrir l&apos;overlay</span>
                    </Link>
                  </Button>
                </div>
                <Button
                  className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                  variant="default"
                  asChild
                >
                  <Link href={`/prediction/${prediction.name}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Customiser
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {editingPrediction && (
        <EditPredictionDialog
          prediction={editingPrediction}
          onClose={() => setEditingPrediction(null)}
        />
      )}
      {deletingPrediction && (
        <DeletePredictionAlert
          predictionId={deletingPrediction.id}
          predictionName={deletingPrediction.name}
          isOpen={!!deletingPrediction}
          onOpenChange={(open) => {
            if (!open) setDeletingPrediction(null);
          }}
        />
      )}
    </div>
  );
}
