import InnerSideBar from "../../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Inventory",
          links: [
            { name: "data", link: "/dashboard/sales/inventory" },
            { name: "imports", link: "/dashboard/sales/inventory/import" },
            { name: "register", link: "/dashboard/sales/inventory/register" },
            { name: "Report", link: "/dashboard/sales/inventory/report" },
          ],
        }}
      />
    </>
  );
}
