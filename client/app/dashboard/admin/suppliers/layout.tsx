import InnerSideBar from "../../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Suppliers",
          links: [
            { name: "data", link: "/dashboard/admin/suppliers" },
            { name: "Report", link: "/dashboard/admin/suppliers/report" },
          ],
        }}
      />
    </>
  );
}
