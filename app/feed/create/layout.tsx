import { getUser } from "@/app/actions/getUser";
// import { redirect } from "next/navigation";

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    alert("로그인 사용자만 이용가능합니다.");
    // redirect('/login');
  }

  return <div className="write-layout w-full  m-auto sm:w-4xl">{children}</div>;
}
