"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Prediction } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { editPrediction } from "@/app/actions/predictions";

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

interface EditPredictionDialogProps {
  prediction: Prediction;
  onClose: () => void;
}

export function EditPredictionDialog({
  prediction,
  onClose,
}: EditPredictionDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prediction.name,
      description: prediction.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await editPrediction(prediction.id.toString(), values);
    if (result.success) {
      toast({
        title: "Prédiction modifiée",
        description: "La prédiction a été modifiée avec succès.",
      });
      router.refresh();
      setIsOpen(false);
      onClose();
    } else {
      toast({
        title: "Erreur",
        description:
          result.error || "Une erreur est survenue lors de la modification.",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Modifier la prédiction</AlertDialogTitle>
          <AlertDialogDescription>
            Modifiez les détails de votre prédiction ici. Cliquez sur
            sauvegarder quand vous avez terminé.
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <Button type="submit">Sauvegarder les changements</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
