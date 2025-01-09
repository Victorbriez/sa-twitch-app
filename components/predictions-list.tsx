import Link from "next/link";
import { Plus } from "lucide-react";
import { type Prediction } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PredictionsListProps {
  predictions: Prediction[];
}

export function PredictionsList({ predictions }: PredictionsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-dashed transition-colors hover:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-2xl font-bold">
            Nouvelle prédiction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" size="lg">
            <Link href="/prediction/new">
              <Plus className="mr-2 size-4" />
              Créer
            </Link>
          </Button>
        </CardContent>
      </Card>
      {predictions.map((prediction) => (
        <Link href={`/prediction/${prediction.id}`} key={prediction.id}>
          <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <CardTitle className="text-2xl font-bold">
                {prediction.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Créé le {prediction.createdAt.toLocaleDateString()}
              </CardDescription>
              <Button className="mt-4 w-full" variant="secondary">
                Voir les détails
              </Button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
