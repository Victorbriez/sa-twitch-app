import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { revalidatePath } from "next/cache";

const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      };
    },
  },
  events: {
    createUser: async (user) => {
      await prisma.user.update({
        where: { id: user.user.id },
        data: { role: "member" },
      });
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
};

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

    let descriptionToSave = null;
    if (description !== null && description !== undefined) {
      if (typeof description !== "string") {
        return { success: false, error: "La description est invalide" };
      }
      descriptionToSave = description;
    }

    const prediction = await prisma.prediction.create({
      data: {
        name,
        description: descriptionToSave,
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

export async function editPrediction(
  id: string,
  data: { name: string; description?: string }
) {
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
        error: "Vous n'êtes pas autorisé à modifier cette prédiction",
      };
    }

    const updatedPrediction = await prisma.prediction.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    revalidatePath("/");
    return { success: true, data: updatedPrediction };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Ce nom est déjà utilisé" };
    }
    return { success: false, error: "Une erreur est survenue" };
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
