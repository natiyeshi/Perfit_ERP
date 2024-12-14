import ErrorMessage from "@/components/custom/ErrorMessage";
import EmployeeTable from "../../_components/EmployeeTable";

const Page = async () => {

  return (
    <>
      <div className={`w-full max-h-screen`}>
        <div className="w-full flex flex-col h-full">
          <div className="flex w-full h-12 border-b"></div>
          <div className=" overflow-y-auto w-full h-full flex-1  flex flex-col">
            <div></div>
            {/* {error ? (
              <ErrorMessage message={error.message} topic="Sorry" />
            ) : (
              <EmployeeTable mainData={Employees ?? []} />
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
