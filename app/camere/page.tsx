import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Camere",
};

export default function Camere() {
  const rooms = [
    {
      id: "101",
      name: "101",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCo64f2tdD04CVHNwYNxEj32KeVlnX75Abw0TOzFK90u8ZMmNIWkNYNVG1MJJM8N3OlO9Aosql9v9rpLhDp4QiW5yeoDVbjPbNnXTnGtP3hClhI3nBZmR5iMfHGc0TBL9UL6TqYMAXuZbuLk1TMm1z503cCsnjS4c1_-FxTyIAY4juzjPS9An85Z9vQLJ-gJFaEG3HDJEjwV5G5S_U7Dd9mdj2KKlX4B_6NklNvAoaoB9qn4wjQ93NueRS937DJbuvl0lKdkyjKKmw",
    },
    {
      id: "102",
      name: "102",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCchw9pE3C5PdG9BV-Bz3NieIUgVvaVeVrqygPAwJCgfDmmQ10SFb9KjHfFCnWMgByKNz3NbXQ9_nStArSqQfrofoBF0SVYSGGr1WfyRr9fCgHTXOFWMe0wimp1FP2cSxafV_6nM5rH-uhuMhS8D4t8Rlr-0Jn_3iu2MiWID9ndEC2QYAvFG4xGbSkJrcIGj8OKr7Khf3Rmr08Jcu5HLBJ7LWHy8GYKENcimkR-xT0j9tTM0ul37eCmCe2gk_sf9_pSW3NwQj-HMGo",
    },
    {
      id: "103",
      name: "103",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2nPqA4DNaN5iudLawzJOcSAZvzUMfFJcF_RtQdqKjWlhct_aNH2NcdQwmAITvAv8ZSFOUO0AUweXBtb63FjAOExOQyI4euf3nlAGcEf0vXYifAdYzEhgVBZsSsDb_MPLd_TF7w2vG_K53ZiHxI0Hwe1LxThdGnkdJfDhsMj21a6SVow731KUz8anQVMRkFLFNJ2Wb8z5z2auqHWRsw8nXUv4p0YypPoeYSadzKGpyhSGHB1xseNFl5x7AsY2bj2Cs7NGXOuQXoFM",
    },
    {
      id: "104",
      name: "104",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHKez_jbCq2VtVPv1x_1yIvrgtuoDZQeHNTBErTvB4RWv1HC5Y3-p_cU0roWwocz2cb_3xF5hElKUl2faaxYkA6FQSK-c3sKxytJoL8gc22trY8AisiYVlUNgFm1q8g5vLC_2CLk7DSYoVxsQWH-gvzegLuFzoCwx2BULiXmD3FGxMIyUsb5UbiS_IgadwMHiBlzQxNTWqsZqBAW_gfcOjQj2TWkMXikXBpt8d0pWvUGylv470JkZXcJwM8j1Ua5D7lGHM5NXyExs",
    },
  ];

  return (
    <div className="flex-grow pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full pt-10 md:pt-20">
      <div className="mb-12">
        <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary font-bold mb-2">
          Seleziona la tua camera
        </h1>
        <p className="text-body-md text-secondary">
          Scopri le nostre soluzioni esclusive per un soggiorno indimenticabile a Corleone.
        </p>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="flex flex-col group cursor-pointer border-b md:border-b-0 border-outline-variant pb-8 md:pb-0"
          >
            <div className="relative w-full aspect-[4/3] bg-surface-container-high mb-6 overflow-hidden">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="flex flex-col gap-4 flex-grow">
              <h2 className="text-headline-md font-semibold text-primary">
                {room.name}
              </h2>
              <div className="mt-auto pt-4 border-t border-outline-variant md:border-t-0">
                <Link 
                  href={`/camere/${room.id}`}
                  className="block w-full bg-primary text-on-primary text-body-md font-semibold uppercase tracking-widest py-3 hover:opacity-70 transition-opacity duration-300 active:scale-95 text-center"
                >
                  Prenota Ora
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
