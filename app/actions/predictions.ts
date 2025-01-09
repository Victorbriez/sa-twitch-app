"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createPrediction(formData: FormData) {
  try {
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
      data: { name },
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
    return await prisma.prediction.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
