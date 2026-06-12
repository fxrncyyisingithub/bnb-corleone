type Dict = {
  title: string
  address: string
}

export default function MobileLocation({ dict }: { dict: Dict }) {
  return (
    <div className="flex-grow w-full px-margin-mobile py-10 flex flex-col gap-8 min-h-[80vh]">
      <section className="flex flex-col gap-3">
        <h1 className="text-headline-lg-mobile font-bold text-primary">{dict.title}</h1>
        <p className="text-body-md text-primary font-semibold">
          {dict.address}
        </p>
      </section>

      <div className="w-full aspect-[4/3] bg-surface-container-high overflow-hidden rounded">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8669756845466!2d13.292902011765444!3d37.81658470963309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x131a1c77b1d6621f%3A0xa4ad251039a8e7da!2sCorleone%20Guesthouse!5e0!3m2!1sit!2sit!4v1781263887065!5m2!1sit!2sit"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
