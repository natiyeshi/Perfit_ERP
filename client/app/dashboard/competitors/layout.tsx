import InnerSideBar from "../_components/InnerSideBar";

export default async function Layout({ children }: { children: any }) {
  return (
    <>
      <InnerSideBar
        children={children}
        data={{
          name: "Competitors",
          links: [
            { name: "data", link: "/dashboard/competitors" },
            { name: "Report", link: "/dashboard/competitors/report" },
          ],
        }}
      />
    </>
  );
}
