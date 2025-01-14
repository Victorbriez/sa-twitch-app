import Link from "next/link";
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
      {predictions.map((prediction) => (
        <Link href={`/prediction/${prediction.name}`} key={prediction.name}>
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
