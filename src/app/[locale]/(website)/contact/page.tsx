import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { images } from "@/assets";
import { PageHeading } from "@/components/page-heading";
import { ContactForm } from "@/components/website-forms";

export default async function ContactPage() {
  const t = await getTranslations("pages.contact");
  const c = await getTranslations("common");
  return (
    <>
      <PageHeading
        title={t("title")}
        subtitle={t("subtitle")}
        image={images.contact.png}
      />
      <section className="container grid gap-12 py-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="mb-7 text-2xl font-bold">{t("subtitle")}</h2>
          <ContactForm />
        </div>
        <aside className="h-fit rounded-xl bg-muted p-6 md:p-8">
          <h2 className="mb-7 text-2xl font-bold">{c("contactDetails")}</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 font-bold">{t("office")}</h3>
                <p className="leading-7 text-muted-foreground">
                  {c("address")}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-primary" />
              <dl className="w-full space-y-3">
                {[
                  {
                    label: c("phone"),
                    value: "0598893600",
                    tel: "+970598893600",
                  },
                  {
                    label: t("landline"),
                    value: "082455020",
                    tel: "+97082455020",
                  },
                  {
                    label: t("sales"),
                    value: "0566606600",
                    tel: "+970566606600",
                  },
                ].map((item) => (
                  <div
                    key={item.tel}
                    className="flex flex-wrap justify-between gap-x-4 gap-y-1"
                  >
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd>
                      <a
                        href={`tel:${item.tel}`}
                        dir="ltr"
                        className="font-bold underline-offset-4 hover:underline"
                      >
                        {item.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <a
              href="mailto:info@abuaitah.ps"
              className="flex min-h-11 items-center gap-4 break-all hover:underline"
            >
              <Mail className="size-5 shrink-0 text-primary" />
              info@abuaitah.ps
            </a>
          </div>
          <h3 className="mb-4 mt-8 border-t border-border pt-7 text-xl font-bold">
            {t("distributors")}
          </h3>
          <dl className="space-y-3">
            {["north", "central", "rafah", "gaza", "khan"].map((key) => (
              <div key={key} className="flex flex-wrap justify-between gap-2">
                <dt className="text-muted-foreground">{t(key)}</dt>
                <dd>
                  <a
                    href="tel:+970594220235"
                    dir="ltr"
                    className="font-bold hover:underline"
                  >
                    0594220235
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>
      <section className="container pb-6">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Salah+Al+Din+Street+North+Gaza"
          target="_blank"
          rel="noreferrer"
          aria-label={t("map")}
          className="block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src={images.map.png}
            alt={t("map")}
            width={1088}
            height={400}
            sizes="100vw"
            className="min-h-48 w-full object-cover"
          />
        </a>
      </section>
    </>
  );
}
