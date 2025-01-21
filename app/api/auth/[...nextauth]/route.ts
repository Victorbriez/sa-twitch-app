import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";

import { prisma } from "@/lib/prisma";

const handler = NextAuth({
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
});

export const GET = handler;
export const POST = handler;
