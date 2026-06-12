const contacts = [
  {
    name: "Salvatore Paternostro",
    phone: "393208531653",
  },
  {
    name: "Mariateresa Paternostro",
    phone: "393206988750",
  },
]

export default function MobileContatti() {
  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile py-10 flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h1 className="text-headline-lg-mobile font-bold text-primary">Contatti</h1>
      </section>

      <div className="flex flex-col gap-6">
        {contacts.map((contact) => (
          <section
            key={contact.phone}
            className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-high shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div>
                <h2 className="text-[20px] font-semibold text-primary">{contact.name}</h2>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-container-high">
              <a
                href={`https://wa.me/${contact.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-on-primary text-body-md font-semibold hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.28z"/>
                </svg>
                Contatta su WhatsApp
              </a>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
