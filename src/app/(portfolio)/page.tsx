// global styles temporarily disabled to debug build parsing issues
import PortfolioComponent from "@/components/PortfolioComponent";
import { getPortfolioData } from "@/lib/portfolio-data";

export default async function Home() {
  const data = await getPortfolioData();
  return <PortfolioComponent data={data} />;
}
