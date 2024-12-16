import InnerSideBar from "../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Import",
          links: [
            { name: "data", link: "/dashboard/import" },
            { name: "register", link: "/dashboard/import/register" },
            { name: "Report", link: "/dashboard/import/report" },
          ],
        }}
      />
    </>
  );
}
