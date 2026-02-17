import React, { useState } from 'react';
import { submitApplication } from '../lib/api';
import type { ApplicationPayload } from '../types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const initialForm: ApplicationPayload = {
  full_name: '',
  email: '',
  phone: '',
  course: '',
  sex: undefined,
  age: undefined,
  message: '',

};

const ApplicationForm: React.FC = () => {
  const [form, setForm] = useState<ApplicationPayload>(initialForm);
  const [errors, setErrors] = useState<{
    full_name?: string;
    email?: string;
    phone?: string;
    course?: string;
    sex?: string;
    age?: string;
  }>(
    {},
  );
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'age' ? (value ? Number(value) : undefined) : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.full_name.trim()) newErrors.full_name = 'Il nome completo è obbligatorio.';
    if (!form.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido.';
    }
    if (form.phone && !/^[\d\s\+\-\(\)]+$/.test(form.phone.trim())) {
      newErrors.phone = 'Inserisci un numero di telefono valido.';
    }
    if (!form.course.trim()) newErrors.course = 'Il corso/programma è obbligatorio.';
    if (!form.sex) newErrors.sex = 'Il sesso è obbligatorio.';
    if (!form.age) newErrors.age = 'L\'età è obbligatoria.';
    else if (form.age < 18 || form.age > 100) newErrors.age = 'L\'età deve essere compresa tra 18 e 100 anni.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setStatusMessage('');

    try {
      await submitApplication({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || undefined,
        course: form.course.trim(),
        sex: form.sex,
        age: form.age,
        message: form.message?.trim() || undefined,
      });

      setStatus('success');
      setStatusMessage('La tua candidatura è stata inviata con successo.');
      setForm(initialForm);
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(
        err?.message ?? 'Qualcosa è andato storto durante l\'invio della tua candidatura.',
      );
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/50 backdrop-blur">
      <h2 className="text-xl font-semibold text-white md:text-2xl">
        Candidati per la camera
      </h2>
      <p className="mt-1 text-sm text-slate-300">
        Raccontaci un po' di te e dei tuoi studi.
      </p>

      {/* Status banners */}
      {status === 'success' && (
        <div className="mt-4 rounded-2xl border border-emerald-700 bg-emerald-900/40 px-4 py-3 text-sm text-emerald-100">
          {statusMessage}
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 rounded-2xl border border-rose-700 bg-rose-900/40 px-4 py-3 text-sm text-rose-100">
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-slate-200"
          >
            Nome completo <span className="text-rose-400">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
            placeholder="es. Maria Rossi"
            value={form.full_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.full_name && (
            <p className="text-xs text-rose-400">{errors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-200"
          >
            Email <span className="text-rose-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
            placeholder="es. maria.rossi@esempio.com"
            value={form.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-xs text-rose-400">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-slate-200"
          >
            Cellulare
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
            placeholder="es. +39 123 456 7890"
            value={form.phone}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-xs text-rose-400">{errors.phone}</p>
          )}
        </div>

        {/* Course / program */}
        <div className="space-y-1.5">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-slate-200"
          >
            Corso / programma universitario <span className="text-rose-400">*</span>
          </label>
          <input
            id="course"
            name="course"
            type="text"
            className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
            placeholder="es. Laurea in Informatica, Magistrale in Economia..."
            value={form.course}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.course && (
            <p className="text-xs text-rose-400">{errors.course}</p>
          )}
        </div>

        {/* Sex */}
        <div className="space-y-1.5">
          <label
            htmlFor="sex"
            className="block text-sm font-medium text-slate-200"
          >
            Sesso <span className="text-rose-400">*</span>
          </label>
          <select
            id="sex"
            name="sex"
            className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
            value={form.sex || ''}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="">Seleziona...</option>
            <option value="M">Maschio</option>
            <option value="F">Femmina</option>
            <option value="O">Altro</option>
          </select>
          {errors.sex && (
            <p className="text-xs text-rose-400">{errors.sex}</p>
          )}
        </div>

        {/* Age */}
        <div className="space-y-1.5">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-slate-200"
          >
            Età <span className="text-rose-400">*</span>
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min="18"
            max="100"
            className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
            placeholder="es. 22"
            value={form.age || ''}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.age && (
            <p className="text-xs text-rose-400">{errors.age}</p>
          )}
        </div>

        {/* Optional message */}
        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-slate-200"
          >
            Messaggio o domande (facoltativo)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="block w-full resize-none rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2"
            placeholder="Condividi la tua data di trasferimento preferita, vincoli di budget o eventuali domande."
            value={form.message}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-900 border-t-transparent" />
                Invio candidatura...
              </span>
            ) : (
              'Invia candidatura'
            )}
          </button>
          <div className="mt-3 space-y-1.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs leading-relaxed text-slate-400">
              <strong className="text-slate-300">Informativa Privacy (GDPR):</strong> Inviando la candidatura, accetti il trattamento dei tuoi dati personali ai sensi del Regolamento UE 2016/679 (GDPR). I dati forniti saranno utilizzati esclusivamente per la selezione del candidato e per le comunicazioni relative alla disponibilità della camera.
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              Tutti i dati personali verranno permanentemente cancellati entro 30 giorni dalla conclusione del processo di selezione. 
              Hai il diritto di richiedere l'accesso, la rettifica o 
              la cancellazione anticipata dei tuoi dati in qualsiasi momento contattandoci via email.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;

