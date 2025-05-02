import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/services/server/db"; // เชื่อมต่อกับฐานข้อมูล
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials;

        try {
          // ตรวจสอบข้อมูลในตาราง `member`
          const [memberRows] = await pool.query(
            "SELECT * FROM member WHERE member_email = ?",
            [email]
          );

          if (memberRows && memberRows.length > 0) {
            const user = memberRows[0];
            const isPasswordValid = await bcrypt.compare(
              password,
              user.member_password
            );
            if (!isPasswordValid) return null;

            return {
              id: user.member_id,
              username: user.member_username,
              email: user.member_email,
              role: "admin",
              is_admin: user.is_admin,
            };
          }

          // ตรวจสอบข้อมูลในตาราง `personnel`
          const [personalRows] = await pool.query(
            "SELECT * FROM personnel WHERE personel_username = ?",
            [email]
          );

          if (personalRows && personalRows.length > 0) {
            const user = personalRows[0];

            return {
              id: user.personnel_id,
              username: user.personnel_name,
              email: user.personel_username,
              role: "personal",
              is_admin: false,
            };
          }
        } catch (error) {
          console.error(error);
          return null;
        }

        return null;
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
        token.is_admin = user.is_admin || false;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.is_admin = token.is_admin;
        session.user.role = token.role;
      }
      return session;
    },

    // ⚠️ `user` จะเป็น undefined เสมอใน JWT mode
    async redirect({ url, baseUrl }) {
      // ส่งต่อไปยังหน้าเว็บที่ต้องการ
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
