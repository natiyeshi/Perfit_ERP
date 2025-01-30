import CustomLink from "@/components/custom/CustomLink";

interface LinkInf {
  name: string;
  link: string;
  Icon?: any;
}

export interface RightSideBarInf {
  name: string;
  links: LinkInf[];
}

const RightSideBar = ({
  children,
  data,
}: {
  children: any;
  data: RightSideBarInf;
}) => {
  return (
    <div className="flex-1 overflow-auto flex w-full">
      <div className="flex-1 ">{children}</div>
      <div className="w-52 border-l px-3 pt-5 flex flex-col gap-2">
        <div className=" text-lg">{data.name}</div>
        {data.links.map((singleLink, ind) => (
          <CustomLink key={ind} link={singleLink.link} name={singleLink.name} />
        ))}
      </div>
    </div>
  );
};

export default RightSideBar;
