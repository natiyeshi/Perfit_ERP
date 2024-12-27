import InnerSideBar from "../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Suppliers",
          links: [
            { name: "data", link: "/dashboard/suppliers" },
            { name: "Report", link: "/dashboard/suppliers/report" },
          ],
        }}
      />
    </>
  );
}
