// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, profile }) {
      const { name, email, image } = user;
      const id = profile?.sub;

      if (!id) {
        console.error("Profile ID is undefined");
        return false;
      }

      try {
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_ID_QUERY, { id });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            _id: id,
            name,
            username: email?.split("@")[0] || name?.replace(/\s+/g, "").toLowerCase(),
            email,
            image,
            bio: "",
          });
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      try {
        const id = profile?.sub;

        if (account && id) {
          const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });

          if (user) {
            token.id = user._id;
          }
        }

        return token;
      } catch (error) {
        console.error("Error during JWT:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        session.user.id = token.id as string;
        return session;
      } catch (error) {
        console.error("Error during session:", error);
        return session;
      }
    },
  },
});
