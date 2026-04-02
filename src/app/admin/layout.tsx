"use client";

import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("nb-theme");
    return () => {
      document.body.classList.remove("nb-theme");
    };
  }, []);

  return <>{children}</>;
}
