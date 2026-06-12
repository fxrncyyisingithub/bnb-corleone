import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contatti",
};

export default function Contatti() {
  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-20 flex flex-col gap-10">
      {/* Page Header */}
      <section className="flex flex-col gap-4">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-primary">Contatti</h1>
        <p className="text-body-lg text-secondary max-w-2xl">
          Siamo a vostra disposizione per qualsiasi richiesta o necessità. Contattate direttamente il reparto desiderato.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sede Centrale */}
        <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">apartment</span>
            <h2 className="text-[24px] font-semibold text-primary">Sede Centrale</h2>
          </div>
          <p className="text-body-md text-secondary">
            Corleone Guesthouse<br />Via Roma 123, 00100 Roma, Italia
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <a href="tel:+390612345678" className="flex items-center gap-2 text-body-md text-primary font-semibold hover:underline">
              <span className="material-symbols-outlined text-secondary text-sm">call</span>
              +39 06 1234 5678
            </a>
            <a href="mailto:info@corleoneguesthouse.it" className="flex items-center gap-2 text-body-md text-primary font-semibold hover:underline">
              <span className="material-symbols-outlined text-secondary text-sm">mail</span>
              info@corleoneguesthouse.it
            </a>
          </div>
        </section>

        {/* Relazioni Media */}
        <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">campaign</span>
            <h2 className="text-[24px] font-semibold text-primary">Relazioni Media</h2>
          </div>
          <p className="text-body-md text-secondary">
            Per richieste stampa, interviste e materiale fotografico ad alta risoluzione.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <a href="mailto:press@corleoneguesthouse.it" className="flex items-center gap-2 text-body-md text-primary font-semibold hover:underline">
              <span className="material-symbols-outlined text-secondary text-sm">mail</span>
              press@corleoneguesthouse.it
            </a>
          </div>
        </section>

        {/* Direzione - Elena Rostova */}
        <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0 relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIR-OLS8wVcT9rGV_pybeTZMV6CEttIBHgrpr797RpZ1gBd2aXo1a6D6Xi9naFma0D1x0gTsKc1vXyLBFcZRNDgb2kG8qFTAXrqlw9KI5aMGwRHqFuCeMNDssmBcQsgiSkVeYi8jDagDbIw-28mr7KuoKSZqBcnoBUbbRvBeLdG9fFXxbR_VhXPshP3k0nyWWcsEyx7BBs1nv3SfZSLFWzBuxA16ba870Cy06mKVEi72jpGdEVhV7pKBH_EBMGMagvAQQzmhS1Lv4"
                alt="Elena Rostova"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold text-primary">Elena Rostova</h2>
              <p className="text-label-sm font-semibold text-secondary uppercase tracking-widest mt-1">
                Direttrice Generale
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-container-high">
            <a href="mailto:direzione@corleoneguesthouse.it" className="flex items-center justify-center w-full py-3 bg-primary text-on-primary text-body-md font-semibold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined mr-2 text-sm">mail</span> Contatta Direzione
            </a>
          </div>
        </section>

        {/* Concierge - Marco Vetti */}
        <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0 relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBoxMpiUCPdxo4xKXlwcSHNzH57XTe1H2EOzEjkLO0izMeCAYA2SEIjMRu2mrHACp7vV9cS7kBav1xaTtZYD-v9QdpjhSeifNAb4i6R91YDUI9Z-DCIFJhsbmrnkLAR7zjpXlcs2-SGpLiWUgj7NLAkVQ5OJ6wmx9VAmrsZjJtLkAnQL3IikU6lYVwgPVrAkPwQnVoOHvAyHt3EyEeJpxZXuRtx-qabe-xZlkG4kVqS3lfIbrKwjj4JwsYUcsYHLAMgdmlkFs5I6I"
                alt="Marco Vetti"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold text-primary">Marco Vetti</h2>
              <p className="text-label-sm font-semibold text-secondary uppercase tracking-widest mt-1">
                Capo Concierge
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-auto pt-4 border-t border-surface-container-high">
            <a href="tel:+393331234567" className="flex items-center justify-center w-full py-3 bg-surface-container-lowest border border-primary text-primary text-body-md font-semibold hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined mr-2 text-sm">call</span> Chiama
            </a>
            <a href="mailto:concierge@corleoneguesthouse.it" className="flex items-center justify-center w-full py-3 bg-primary text-on-primary text-body-md font-semibold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined mr-2 text-sm">mail</span> Email
            </a>
          </div>
        </section>

        {/* Eventi - Sofia Bianchi */}
        <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0 relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC27djZLVWRIDpFL13esOEoMK-Q1JVvyr8t7nc8jDLER0bIlAba8U0zVxlQJafaafvKRgZZISKWhTohpHfNhHGEyQvT_0dRrgoRALIX-bgVmLEB30vZ0Bp6be7KdJlBo4gxuwP-0X-uJOlcXUM1GD31QPfhqsU8QQRzTCK3eHy1FZKqzAuvTtIDAq8LkTXYwJI88qEsJ65ZIXWIwPNcZzKs_n7Iu80ydvuagUV_SVxzC5hzaMOEjZdB7p4TVvRaCxhnauHE1b6Bso"
                alt="Sofia Bianchi"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold text-primary">Sofia Bianchi</h2>
              <p className="text-label-sm font-semibold text-secondary uppercase tracking-widest mt-1">
                Responsabile Eventi
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-container-high">
            <a href="mailto:eventi@corleoneguesthouse.it" className="flex items-center justify-center w-full py-3 bg-primary text-on-primary text-body-md font-semibold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined mr-2 text-sm">mail</span> Richiedi Info Eventi
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
