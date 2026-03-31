import { auth } from "@/lib/auth";
import HomeView from "@/modules/home/ui/views/home-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) redirect("/sign-in");

  return <HomeView session={data.session} />; // pass both if you want
};

export default Page;
