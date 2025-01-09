"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DiscIcon as Discord } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/prediction";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bienvenue</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={() => signIn("discord", { callbackUrl })}
          >
            <Discord className="mr-2 size-4" />
            Continuer avec Discord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
