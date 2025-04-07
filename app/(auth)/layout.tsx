import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (session) redirect("/dashboard");
  return (
    <main className="auth-container flex items-center justify-center h-screen">
      <div className="shadow-md outline outline-black/5 dark:bg-gray-800 p-6">{children}</div>
    </main>
  );
};

export default Layout;
