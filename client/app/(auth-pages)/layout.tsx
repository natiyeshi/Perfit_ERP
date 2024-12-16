import PowerdBy from "@/components/custom/PowerdBy";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex justify-center flex-col items-center">
      <div className="max-w-7xl ">{children}</div>
      <PowerdBy className="mt-8 " />
    </div>
  );
}
