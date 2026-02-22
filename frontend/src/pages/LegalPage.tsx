import { useState } from 'react';
import { CookiePolicy, PrivacyPolicy, TermsAndConditions } from '../components/Laws';

type Tab = 'cookie' | 'privacy' | 'terms';

const TABS: { id: Tab; label: string }[] = [
  { id: 'cookie', label: 'Cookie Policy' },
  { id: 'privacy', label: 'Informativa Privacy' },
  { id: 'terms', label: 'Termini e Condizioni' },
];

export default function LegalPage() {
  const [active, setActive] = useState<Tab>('cookie');

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Note Legali</h1>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-slate-700 mb-2">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={[
                'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
                active === id
                  ? 'bg-slate-900 border border-b-slate-900 border-slate-700 text-slate-100 -mb-px'
                  : 'text-slate-400 hover:text-slate-200',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {active === 'cookie' && <CookiePolicy />}
        {active === 'privacy' && <PrivacyPolicy />}
        {active === 'terms' && <TermsAndConditions />}
      </div>
    </div>
  );
}
