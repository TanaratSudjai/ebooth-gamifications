import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/services/server/db"; // แก้ไขให้ตรงกับที่เก็บไฟล์ db.js
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials;
        const [rows] = await pool.query(
          "SELECT * FROM member WHERE member_email = ?",
          [email]
        );

        if (!rows || rows.length === 0) {
          return null;
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(
          password,
          user.member_password
        );
        if (!isPasswordValid) {
          return null;
        }

        // ส่งเฉพาะค่าที่ต้องการ
        return {
          id: user.member_id,
          username: user.member_username,
          email: user.member_email,
          is_admin: user.is_admin,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.is_admin = user.is_admin;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.is_admin = token.is_admin;
      }
      return session;
    },

    // ⚠️ `user` จะ undefined เสมอใน JWT mode!
    async redirect({ url, baseUrl }) {
      // เอาข้อมูลไปจัดการใน frontend ดีกว่า
      return baseUrl;
    },
  },

  pages: {
    signIn: "/",
    error: "/login?error=true",
    signOut: "/auth/signout",
    callbackUrl: "/auth/redirect",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
