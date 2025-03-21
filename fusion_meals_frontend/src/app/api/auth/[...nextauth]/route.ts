import NextAuth from "next-auth";
import { authOptions } from "./auth";

// Create and export the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 