import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="auth-container flex items-center justify-center h-screen">
      <div className="shadow-md outline outline-black/5 dark:bg-gray-800 p-6">{children}</div>
    </main>
  );
};

export default Layout;
