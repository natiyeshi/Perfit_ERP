import InnerSideBar from "../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Products",
          links: [
            { name: "data", link: "/dashboard/products" },
            { name: "Report", link: "/dashboard/products/report" },
          ],
        }}
      />
    </>
  );
}
