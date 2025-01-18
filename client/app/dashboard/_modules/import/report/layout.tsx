import RightSideBar from "../../../_components/RightSideBar";

const Layout = ({ children }: { children: any }) => {
  return (
    //   <RightSideBar
    //     children={children}
    //     data={{
    //       name: "Report",
    //       links: [
    //         { name: "Gender", link: "/dashboard/admin/import/report/gender" },
    //         { name: "Status", link: "/dashboard/admin/import/report/status" },
    //       ],
    //     }}
    //   />
    // );
    <>{children}</>
  );
};

export default Layout;
