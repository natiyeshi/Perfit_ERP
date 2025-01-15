import InnerSideBar from "../../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Inventory",
          links: [
            { name: "data", link: "/dashboard/admin/inventory" },
            { name: "register", link: "/dashboard/admin/inventory/register" },
            { name: "Report", link: "/dashboard/admin/inventory/report" },
          ],
        }}
      />
    </>
  );
}
