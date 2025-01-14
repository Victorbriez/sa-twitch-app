"use client";

import Link from "next/link";
import { type Prediction } from "@prisma/client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy } from "lucide-react";

interface PredictionsListProps {
  predictions: Prediction[];
}

export function PredictionsList({ predictions }: PredictionsListProps) {
  const { toast } = useToast();

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Lien copié",
      description: "Le lien a été copié dans votre presse-papiers.",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {predictions.map((prediction) => {
        const link = `http://localhost:3000/prediction/${prediction.name}`;

        return (
          <Link href={`/prediction/${prediction.name}`} key={prediction.name}>
            <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-md flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-2xl font-bold">
                  {prediction.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="flex-1">
                  <CardDescription>
                    {prediction.description || "Aucune description disponible."}
                  </CardDescription>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(link);
                  }}
                >
                  <Copy className="mr-2 size-4" />
                  Copier le lien
                </Button>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
