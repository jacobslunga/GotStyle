import Info from "@/components/brandSections/Info";
import Main from "@/components/brandSections/Main";
import { FC } from "react";

interface BrandsProps {}

const Brands: FC<BrandsProps> = ({}) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Main />
      <Info />
    </main>
  );
};

export default Brands;
