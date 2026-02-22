import React, { useRef, useState } from 'react';

const BedroomDetails: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const images = [    {
      src: '/room (7).jpeg',
      alt: 'Zona scrivania e studio',
    },
    
    {
      src: '/room (10).jpeg',
      alt: 'Armadio e spazio guardaroba',
    },
    
    {
      src: '/room (6).jpeg',
      alt: 'Camera doppia scrivania armadi e studio',
    },
    {
      src: '/room (1).jpeg',
      alt: 'Cucina e zona pranzo dell\'appartamento',
    },
    {
      src: '/room (2).jpeg',
      alt: 'Bagno',
    },
    {
      src: '/room (3).jpeg',
      alt: 'Sala e spazio comune',
    },
    {
      src: '/room (4).jpeg',
      alt: 'Camera doppia scrivania armadi e studio',
    },
    {
      src: '/room (5).jpeg',
      alt: 'Camera doppia scrivania armadi e studio',
    },
    {
      src: '/room (8).jpeg',
      alt: 'Armadio e spazio guardaroba',
    },
    {
      src: '/room (9).jpeg',
      alt: 'Armadio e spazio guardaroba',
    },
    {
      src: '/room (11).jpeg',
      alt: 'Armadio e spazio guardaroba',
    },
  ];

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const imageWidth = container.offsetWidth;
      container.scrollTo({
        left: imageWidth * index,
        behavior: 'smooth',
      });
      setCurrentImageIndex(index);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    scrollToImage(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    scrollToImage(newIndex);
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-slate-950/50 backdrop-blur">
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
        Camera studenti· Tutte le spese sono incluse
      </span>

      <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Camera singola in appartamento condiviso ( DISPONIBILE DA FINE MARZO 2026 )
      </h1>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="min-w-full snap-center"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-64 w-full object-contain md:h-72"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 p-2 text-slate-100 backdrop-blur transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Immagine precedente"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 p-2 text-slate-100 backdrop-blur transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Immagine successiva"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`h-2 w-2 rounded-full transition ${
                index === currentImageIndex
                  ? 'bg-emerald-500 w-4'
                  : 'bg-slate-400/50 hover:bg-slate-400'
              }`}
              aria-label={`Vai all'immagine ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-100 backdrop-blur">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Posizione
          </h2>
          <p className="text-sm text-slate-200">
            <a href='https://maps.app.goo.gl/9thUXvXFZbnfViTm6' className="font-medium text-slate-100 underline" target="_blank" rel="noopener noreferrer">
            Via Bligny, 25123 Brescia
            </a>
            , Vicino a Bar Garda e cartoleria Snoopy
          </p>
          <p className="text-sm text-slate-400">
            5 minuti a piedi (150m) da{' '}
            <span className="font-medium text-slate-100">
              Universita degli studi di Brescia - Ingegneria
            </span>
          </p>
          <p className="text-sm text-slate-400">
            10 minuti a piedi (400m) da{' '}
            <span className="font-medium text-slate-100">
              Universita degli studi di Brescia - Facoltà di Medicina
            </span>
          </p>
          <p className="text-sm text-slate-400">
            5 minuti a piedi (150m) da{' '}
            <span className="font-medium text-slate-100">
              Metro Monpiano
            </span>
          </p>
          <p className="text-sm text-slate-400">
            15 minuti a piedi (1100m) da{' '}
            <span className="font-medium text-slate-100">
              Satellite Spedali Civili
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Servizi inclusi
          </h2>
          <div className="rounded-2xl bg-slate-900/80 p-3 text-sm text-slate-100 ring-1 ring-slate-800">
            <div className="flex items-center justify-between">
              <span>Spese condominiali</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-slate-300">
              <span>Bollette acqua, gas, teleriscaldamento</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-slate-300">
              <span>Lavatrice, forno, microonde, friggitrice ad aria</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-slate-300">
              <span>Internet fibra 2.5Gbit in casa</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-slate-300">
              <span>Manutenzione ordinaria</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-slate-300">
              <span>Netflix, Amazon prime</span>
            </div>
            
            <div className="mt-3 border-t border-slate-800 pt-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Tutto compreso</span>
                <span className="text-base font-bold text-emerald-400">
                  €350 / mese
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Info aggiuntive
        </h2>
        <div className="text-sm overflow-hidden rounded-2xl p-4 border border-slate-800 bg-slate-900">
          Ricerchiamo possibilmente figura femminile, ma valutiamo anche maschile. <br/>
          L'appartamento è composto da 4 camere, di cui 3 già occupate da 1 ragazze universitarie e 2 ragazzi lavoratori<br/> 
          Presenta 2 bagni, cucina e ampia sala.<br/>
          La camera disponibile è una singola spaziosa con letto matrimoniale, armadio e scrivania.<br/> 
          L'appartamento è completamente arredato e dotato di tutti i comfort necessari per uno studente universitario. <br/> 
          La zona è tranquilla e ben servita dai mezzi pubblici, con facile accesso all'università e al centro città.<br/>
          Andremo in ordine di priorità in base alla data di candidatura, ma è possibile indicare eventuali preferenze o esigenze particolari nel modulo di candidatura. <br/>
          Per qualsiasi domanda o per organizzare una visita, non esitate a contattarci.
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Posizione
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <iframe
            title="Approximate location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=10.22733807563782%2C45.56250152646091%2C10.241500139236452%2C45.56918644246592&amp;layer=mapnik"
            className="h-56 w-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default BedroomDetails;

