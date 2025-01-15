import InnerSideBar from "../../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Import",
          links: [
            { name: "data", link: "/dashboard/admin/import" },
            { name: "register", link: "/dashboard/admin/import/register" },
            { name: "Report", link: "/dashboard/admin/import/report" },
          ],
        }}
      />
    </>
  );
}
