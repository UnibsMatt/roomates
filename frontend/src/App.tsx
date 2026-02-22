import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import ApplicationForm from './components/ApplicationForm';
import BedroomDetails from './components/BedroomDetails';

function LandingPage() {
  const [closed, setClosed] = useState(true);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:py-16">
        {closed ? (
          <div className="w-full h-64 rounded-lg bg-slate-800/80 p-8 text-white">
            <p className="text-3xl text-center text-emerald-300">Candidature terminate verrete contattati a breve in caso di esito positivo
              <br></br>Grazie per la partecipazione!
            </p>
          </div>
        ) : (
          <>
            <section className="md:w-1/2">
              <BedroomDetails />
            </section>
            <section className="md:w-1/2">
              <ApplicationForm />
        </section>
          </>
        )}
      </div>
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Roomates - Tutti i diritti riservati
        Contatti - <a href="mailto:masdmasd92@gmail.com" className="underline">masdmasd92@gmail.com</a>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
