import { useState, useEffect } from "react";

/* =====================================================
   COOKIE BANNER (SOLO COOKIE TECNICI - GDPR COMPLIANT)
   ===================================================== */

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_notice_read");
    if (!accepted) setVisible(true);
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem("cookie_notice_read", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700 shadow-2xl z-50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <p className="text-sm text-slate-300 leading-relaxed">
          Questo sito utilizza esclusivamente cookie tecnici strettamente necessari al corretto funzionamento
          della piattaforma, ai sensi dell'art. 122 del D.Lgs. 196/2003 e delle Linee Guida del Garante.
          Non vengono utilizzati cookie di profilazione né cookie di terze parti per finalità di marketing.
        </p>
        <button
          onClick={handleAcknowledge}
          className="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 transition-colors"
        >
          Presa visione
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   COOKIE POLICY (VERSIONE FORMALE GDPR)
   ===================================================== */

export function CookiePolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="rounded-2xl shadow-lg bg-slate-900 border border-slate-800 p-8 space-y-8 text-slate-200">
          <h1 className="text-3xl font-semibold">Cookie Policy</h1>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">1. Definizione di cookie</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              I cookie sono piccoli file di testo che i siti visitati inviano al terminale dell'utente,
              dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">2. Tipologie di cookie utilizzati</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Il presente sito utilizza esclusivamente cookie tecnici, strettamente necessari
              alla fornitura del servizio richiesto dall'utente.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Cookie di autenticazione e gestione sessione</li>
              <li>Cookie di sicurezza</li>
              <li>Cookie di preferenza tecnica (es. memorizzazione presa visione banner)</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed">
              Non vengono utilizzati cookie di profilazione, analytics di terze parti o strumenti
              pubblicitari comportamentali.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">3. Base giuridica</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              L'utilizzo dei cookie tecnici non richiede il consenso dell'interessato in quanto
              necessario per l'erogazione del servizio ai sensi dell'art. 6, par. 1, lett. b) del GDPR.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">4. Gestione tramite browser</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              L'utente può in ogni momento configurare il proprio browser per rifiutare o eliminare
              i cookie. La disabilitazione dei cookie tecnici potrebbe compromettere il corretto
              funzionamento del sito.
            </p>
          </section>
      </div>
    </div>
  );
}

/* =====================================================
   PRIVACY POLICY (STRUTTURA FORMALE ART. 13 GDPR)
   ===================================================== */

export function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="rounded-2xl shadow-lg bg-slate-900 border border-slate-800 p-8 space-y-8 text-slate-200">
          <h1 className="text-3xl font-semibold">Informativa Privacy</h1>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">1. Titolare del trattamento</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Il Titolare del trattamento è [NOME / RAGIONE SOCIALE], con sede in [INDIRIZZO COMPLETO],
              contattabile all'indirizzo email: [EMAIL PRIVACY].
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">2. Categorie di dati trattati</h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Dati identificativi (email)</li>
              <li>Dati di autenticazione (password cifrata mediante hashing sicuro)</li>
              <li>Numero di telefono (fornito volontariamente)</li>
              <li>Dati contenuti negli annunci pubblicati</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">3. Finalità e base giuridica del trattamento</h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Creazione e gestione dell'account (art. 6, par.1, lett. b GDPR)</li>
              <li>Pubblicazione annunci e intermediazione contatti (art. 6, par.1, lett. b GDPR)</li>
              <li>Adempimento obblighi legali (art. 6, par.1, lett. c GDPR)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">4. Modalità del trattamento</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Il trattamento avviene mediante strumenti informatici e telematici,
              con misure tecniche e organizzative adeguate a garantire la sicurezza,
              l'integrità e la riservatezza dei dati personali.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">5. Comunicazione e diffusione dei dati</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              I dati di contatto inseriti volontariamente potranno essere resi visibili ad
              altri utenti registrati al fine di consentire il contatto diretto relativo
              agli annunci pubblicati. I dati potranno inoltre essere comunicati a fornitori
              di servizi tecnici nominati Responsabili del trattamento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">6. Periodo di conservazione</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              I dati saranno conservati per tutta la durata dell'account e, successivamente,
              per il tempo necessario all'adempimento di obblighi legali o alla tutela dei diritti del Titolare.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">7. Diritti dell'interessato</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              L'interessato può esercitare i diritti previsti dagli artt. 15-22 del GDPR,
              tra cui accesso, rettifica, cancellazione, limitazione del trattamento,
              portabilità dei dati e opposizione, inviando richiesta al Titolare.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">8. Reclamo all'Autorità di controllo</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              L'interessato ha diritto di proporre reclamo all'Autorità Garante per la protezione
              dei dati personali qualora ritenga che il trattamento violi la normativa vigente.
            </p>
          </section>
      </div>
    </div>
  );
}

/* =====================================================
   TERMINI E CONDIZIONI (STRUTTURA FORMALE)
   ===================================================== */

export function TermsAndConditions() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="rounded-2xl shadow-lg bg-slate-900 border border-slate-800 p-8 space-y-8 text-slate-200">
          <h1 className="text-3xl font-semibold">Termini e Condizioni di Utilizzo</h1>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">1. Oggetto</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              La piattaforma fornisce un servizio tecnologico che consente agli utenti
              di pubblicare e consultare annunci relativi a camere in locazione.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">2. Natura del servizio</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Il gestore della piattaforma non è parte dei contratti eventualmente conclusi
              tra gli utenti e non assume alcuna responsabilità in merito alle trattative
              o agli accordi intercorsi tra gli stessi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">3. Obblighi dell'utente</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              L'utente garantisce che le informazioni fornite siano veritiere, aggiornate
              e non lesive di diritti di terzi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">4. Limitazione di responsabilità</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              La piattaforma non garantisce la veridicità degli annunci né il buon esito
              delle trattative tra utenti.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">5. Sospensione o cessazione dell'account</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Il gestore si riserva il diritto di sospendere o cancellare account
              che violino i presenti Termini e Condizioni o la normativa vigente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">6. Legge applicabile e foro competente</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              I presenti Termini sono regolati dalla legge italiana.
              Per ogni controversia sarà competente il foro del luogo
              di residenza o domicilio del consumatore, ove applicabile.
            </p>
          </section>
      </div>
    </div>
  );
}
