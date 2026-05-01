import { ContactPageComponent } from "@/components/contact-page";
import { getPortfolioData } from "@/lib/portfolio-data";

export default async function Page() {
  const data = await getPortfolioData();
  
  return (
    <>
      <ContactPageComponent profile={data.profile} />
    </>
  );
}
