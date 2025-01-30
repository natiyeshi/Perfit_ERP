import CustomerLayout from "../../_modules/customers/layout";

export default async function Layout({ children }: { children: any }) {
  return <CustomerLayout children={children} />;
}
