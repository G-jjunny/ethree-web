import { LandingView } from "@/views/landing";
import { SITE } from "@/shared/constants";
import { buildMetadata } from "@/shared/lib";

export const metadata = buildMetadata({
  title: SITE.tagline,
  description: SITE.description,
  path: "/",
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.legalName,
  url: SITE.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.line1} ${SITE.address.line2}`,
    addressCountry: "KR",
  },
  telephone: SITE.contact.tel,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <LandingView />
    </>
  );
}
