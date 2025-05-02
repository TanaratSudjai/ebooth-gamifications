"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectAfterLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const timer = setTimeout(() => {
        if (session?.user?.is_admin) {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/personal");
        }
      }, 1500);
      return () => clearTimeout(timer);
    } else if (status === "unauthenticated") {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, session, router]);

  return (
    <p className="text-center flex bg-white h-screen justify-center items-center">
      <span className="loading loading-spinner text-warning"></span>
    </p>
  );
}
