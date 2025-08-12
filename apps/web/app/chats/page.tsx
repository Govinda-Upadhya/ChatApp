"use client";

import { useSession } from "next-auth/react";
import ClientPage from "./clientPage";

export default function Page() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not signed in. Please signin</p>;
  return <ClientPage user={session.user.name} />;
}
