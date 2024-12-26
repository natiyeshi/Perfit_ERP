import InnerSideBar from "../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Settings",
          links: [
            { name: "users", link: "/dashboard/settings" },
          ],
        }}
      />
    </>
  );
}
