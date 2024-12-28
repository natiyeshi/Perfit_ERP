import InnerSideBar from "../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Inventory",
          links: [
            { name: "data", link: "/dashboard/inventory" },
            { name: "imports", link: "/dashboard/inventory/import" },
            { name: "register", link: "/dashboard/inventory/register" },
            { name: "Report", link: "/dashboard/inventory/report" },
          ],
        }}
      />
    </>
  );
}
