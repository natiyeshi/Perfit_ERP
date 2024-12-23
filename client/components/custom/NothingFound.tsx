import Image from "next/image";
import img from "@/public/assets/not-found.png";
const NothingFound = ({
  width = 100,
  height = 100,
  className = "w-32",
}: {
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <Image
      width={width}
      height={height}
      className={className}
      src={img}
      alt=""
    />
  );
};

export default NothingFound;
