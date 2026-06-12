import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/locales";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BotIdProvider from "@/app/components/BotIdProvider";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }, { lang: "de" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${lang}"`,
        }}
      />
      <Header lang={lang} dict={dict.nav} />
      <main className="flex-grow pt-20">{children}</main>
      <Footer dict={dict.footer} lang={lang} />
      <BotIdProvider />
    </>
  );
}
