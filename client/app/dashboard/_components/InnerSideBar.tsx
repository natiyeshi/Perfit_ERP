import CustomLink from "@/components/custom/CustomLink";

interface LinkInf {
  name: string;
  link: string;
  Icon?: any;
}

export interface InnerSideBarInf {
  name: string;
  links: LinkInf[];
}

const InnerSideBar = ({
  children,
  data,
}: {
  children: any;
  data: InnerSideBarInf;
}) => {
  return (
    <>
      <div className="min-w-[230px]  ml-[80px] border-r">
        <div className="h-12 min-h-12 max-h-12 ps-4 text-white border-b capitalize text-lg flex">
          <div className="my-auto">{data.name}</div>
        </div>
        <div className="flex flex-col gap-2 mt-5 ps-4">
          {data.links.map((singleLink, ind) => (
            <CustomLink
              key={ind}
              link={singleLink.link}
              name={singleLink.name}
            />
          ))}
        </div>
      </div>
      <div className={`w-full max-h-screen flex-1 overflow-x-hidden overflow-y-auto`}>
        <div className="w-full flex flex-col  h-full">
          <div className="flex w-full h-12 min-h-12 max-h-12 border-b"></div>
          {children}
        </div>
      </div>
    </>
  );
};

export default InnerSideBar;
