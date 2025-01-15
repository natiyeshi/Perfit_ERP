import InnerSideBar from "../../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Customer",
          links: [
            { name: "data", link: "/dashboard/admin/customers" },
            { name: "Report", link: "/dashboard/admin/customers/report" },
          ],
        }}
      />
    </>
  );
}
