
import MainSideBar from "./_components/ManSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <main className="w-full min-h-screen flex text-sm text-gray-400 bg-background">
      <MainSideBar />
      <>{children}</>
    </main>
  );
}
