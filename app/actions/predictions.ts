"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createPrediction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Vous devez être connecté" };
    }

    const name = formData.get("name");
    const description = formData.get("description");

    if (!name || typeof name !== "string") {
      return { success: false, error: "Le nom est requis" };
    }

    if (typeof description !== "string") {
      return { success: false, error: "La description est invalide" };
    }

    if (name.length < 3) {
      return {
        success: false,
        error: "Le nom doit contenir au moins 3 caractères",
      };
    }

    const isValidName = /^[a-zA-Z0-9_-]+$/.test(name);
    if (!isValidName) {
      return {
        success: false,
        error:
          "Le nom ne peut contenir que des caractères alphanumériques, des tirets (-) ou des underscores (_).",
      };
    }

    const prediction = await prisma.prediction.create({
      data: {
        name,
        description,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    return { success: true, data: prediction };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Ce nom est déjà utilisé" };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getPredictions() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return [];
    }

    return await prisma.prediction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch {
    return [];
  }
}

export async function deletePrediction(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Vous devez être connecté" };
    }

    const prediction = await prisma.prediction.findUnique({
      where: { id: parseInt(id) },
    });

    if (!prediction) {
      return { success: false, error: "Prédiction introuvable" };
    }

    if (prediction.userId !== session.user.id) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à supprimer cette prédiction",
      };
    }

    await prisma.prediction.delete({
      where: { id: parseInt(id) },
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Une erreur est survenue" };
  }
}
