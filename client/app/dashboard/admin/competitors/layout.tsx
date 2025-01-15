import InnerSideBar from "../../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Competitors",
          links: [
            { name: "data", link: "/dashboard/admin/competitors" },
            { name: "Report", link: "/dashboard/admin/competitors/report" },
          ],
        }}
      />
    </>
  );
}
