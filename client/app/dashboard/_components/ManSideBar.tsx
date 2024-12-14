import { FaPeopleArrows } from "react-icons/fa";
const MainSideBar = () => {
  return (
    <div className="w-20 absolute group pb-12 hover:w-[240px] duration-300 border-r bg-background  min-h-screen overflow-y-auto overflow-x-hidden ">
      <div className="py-3  w-full">
        <div className="w-[80px] text-center capitalize font-semibold">D</div>
      </div>
      <div className="flex flex-col gap-3 px-2 pt-2">
        <SideBarLink />
      </div>
    </div>
  );
};


const SideBarLink = () => {
  return (
    <div className="pb-2 border-b ">
      <div className="flex gap-1  items-center  py-1 rounded bg-zinc-800">
        <div className="min-w-[60px] py-2 px-1  flex ">
          <FaPeopleArrows className="text-xl text-gray-300 mx-auto" />
        </div>
        <div className="group-hover:flex hidden group-hover:min-w-fit  group-hover:flex-nowrap group-hover:overflow-hidden whitespace-nowrap text-clip">
          Human Resources
        </div>
      </div>
    </div>
  );
};


export default MainSideBar;
