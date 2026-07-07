import PublicSiteView from "@/components/PublicSiteView";
import { getSiteBySubdomain } from "@/lib/data/sites";
import { notFound } from "next/navigation";


export default async function PublicSitePage({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const site = await getSiteBySubdomain(subdomain);

  if (!site || !site.current_code) notFound();

  return <PublicSiteView code={site.current_code} title={site.title} />;
}