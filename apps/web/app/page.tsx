import { prismaClient } from "@repo/db/client";
import { getServerSession } from "next-auth";

const Page = async () => {
  const data = await getServerSession();
  console.log(data);
  const mainuser = await prismaClient.user.findFirst({
    where: {
      username: data.user.name,
    },
  });
  return (
    <div>
      hello tohome {mainuser?.username} <img src={mainuser?.profile} alt="" />
    </div>
  );
};

export default Page;
