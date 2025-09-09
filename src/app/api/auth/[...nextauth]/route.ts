import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      const allowedEmail1 = process.env.ALLOWED_EMAIL1;
      const allowedEmail2 = process.env.ALLOWED_EMAIL2;
      return user.email === allowedEmail1 || user.email === allowedEmail2;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
