import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (session) redirect("/dashboard");
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Little Accountant
        </a>
        {children}
      </div>
    </main>
  );
};

export default Layout;
