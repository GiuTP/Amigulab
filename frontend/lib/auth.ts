import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
    async jwt({ token, account }) {
        if (account) {
            token.id_token = account.id_token
        }
        return token
        },
        async session({ session, token }) {
        ;(session as any).id_token = token.id_token
        return session
        },
    },
}