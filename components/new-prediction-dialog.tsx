"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { createPrediction } from "@/app/actions/predictions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Le nom doit contenir au moins 3 caractères",
    })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Le nom ne peut contenir que des lettres, chiffres, _ ou -",
    }),
  description: z.string().optional(),
});

interface NewPredictionDialogProps {
  children: React.ReactNode;
}

export function NewPredictionDialog({ children }: NewPredictionDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.description) {
      formData.append("description", values.description);
    }

    const result = await createPrediction(formData);

    if (result.success) {
      toast({
        title: "Prédiction créée",
        description: "Votre prédiction a été créée avec succès",
      });
      if (result.data) {
        router.push(`/prediction/custom/${result.data.name}`);
      }
      setOpen(false);
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Erreur lors de la création",
        description: result.error,
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Nouvelle Prédiction</AlertDialogTitle>
          <AlertDialogDescription>
            Créez une nouvelle prédiction pour votre stream.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la prédiction" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choisissez un nom unique pour votre prédiction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de la prédiction"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optionnel. Ajoutez une description à votre prédiction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Création..." : "Créer"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
