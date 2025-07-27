"use client";

import { useSession } from "next-auth/react";

const ClientPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>You are not signed in.</p>;

  return (
    <div>
      Hello, {session.user?.name}
      <img src={session.user?.image} alt="profile" />
    </div>
  );
};

export default ClientPage;
