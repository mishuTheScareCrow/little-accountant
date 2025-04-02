import { handlers } from "@/auth";
export const { GET, POST } = handlers;

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/lib/prisma";
// import { NextAuthConfig } from "next-auth";

// export const authOptions: NextAuthConfig = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
