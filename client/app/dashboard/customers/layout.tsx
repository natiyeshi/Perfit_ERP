import InnerSideBar from "../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Customer",
          links: [
            { name: "data", link: "/dashboard/customers" },
            { name: "Report", link: "/dashboard/customers/report" },
          ],
        }}
      />
    </>
  );
}
