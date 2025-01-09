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

    if (!name || typeof name !== "string") {
      return { success: false, error: "Le nom est requis" };
    }

    if (name.length < 3) {
      return {
        success: false,
        error: "Le nom doit contenir au moins 3 caractères",
      };
    }

    const prediction = await prisma.prediction.create({
      data: {
        name,
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
        createdAt: "desc",
      },
    });
  } catch {
    return [];
  }
}
