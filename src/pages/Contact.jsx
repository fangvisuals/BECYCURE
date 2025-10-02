// src/pages/Contact.jsx

import React, { useMemo, useState } from "react";
import BackButton from "../components/BackButton.jsx";
import GradientText from "../components/GradientText.jsx";
import { ScrambleText } from "../components/Scramble.jsx";
import Panel from "../components/Panel.jsx";
import Stepper, { Step } from "@/components/Stepper.jsx";

function StepBadge({ index, state }) {
  const styles =
    state === "done"
      ? "bg-green-400 text-green-900"
      : state === "active"
      ? "bg-green-300/30 text-green-300 ring-1 ring-green-300/50"
      : "bg-white/5 text-white/60 ring-1 ring-white/10";
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${styles}`} aria-hidden>
      {index + 1}
    </div>
  );
}

function StepHeader({ steps, current }) {
  return (
    <ol className="grid grid-cols-3 gap-3 sm:gap-4">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "idle";
        return (
          <li key={i} className="flex items-center gap-3">
            <StepBadge index={i} state={state} />
            <span className={`text-sm sm:text-base ${state === "done" ? "text-green-300" : state === "active" ? "text-white" : "text-white/60"}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function Contact() {
  const steps = useMemo(() => ["Coordonnées", "Projet", "Validation"], []);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    budget: "",
    message: "",
    consent: false,
  });

  const canNext = useMemo(() => {
    if (step <= 1) return Boolean(form.name && form.email);
    if (step === 2) return Boolean(form.subject && form.message);
    if (step >= 3) return Boolean(form.consent);
    return false;
  }, [step, form]);

  // Validation + erreurs
  const [touched, setTouched] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const markTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (step <= 1) {
      if (!form.name) e.name = 'Requis';
      const emailOk = /.+@.+\..+/.test(form.email || '');
      if (!form.email) e.email = 'Requis';
      else if (!emailOk) e.email = 'Email invalide';
    } else if (step === 2) {
      if (!form.subject) e.subject = 'Requis';
      if (!form.message) e.message = 'Requis';
    } else if (step >= 3) {
      if (!form.consent) e.consent = 'Nécessaire';
    }
    return e;
  }, [step, form]);

  const invalid = (name) => Boolean(errors[name]) && (showErrors || touched[name]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen text-white py-10 px-4 sm:px-6 md:px-10 lg:px-24 overflow-y-auto">
      <BackButton strokeClass="stroke-green-300" className="mb-4" />
      <h1 className="title leading-tight mb-8">
        <span className="block">
          <span className="inline-flex items-baseline gap-x-2 md:gap-x-3">
            <GradientText colors={["#40ffaa", "#81fa9fff", "#40ffd6ff", "#40ffafff", "#40ffaa"]} animationSpeed={3}>
              <ScrambleText as="span" text={"/ CONTACT"} trigger="mount" duration={300} cyclesPerLetter={4} shuffleMs={120} respectMotion={false} reserveWidth={false} />
            </GradientText>
          </span>
        </span>
      </h1>

      <Panel border="ring-1 ring-green-500/20" padding="p-5 sm:p-7" className="max-w-4xl w-full">
        {submitted ? (
          <div className="text-center space-y-3">
            <div className="text-green-300 text-xl font-semibold">Merci !</div>
            <p className="text-gray-300/90">Nous avons bien reçu votre message. Notre équipe vous répondra rapidement.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Animated Stepper */}
            <Stepper
              initialStep={1}
              onStepChange={(s) => setStep(s)}
              onFinalStepCompleted={() => setSubmitted(true)}
              allowNext={canNext}
              onNextAttempt={() => setShowErrors(true)}
              stepCircleContainerClassName=""
              stepContainerClassName=""
              contentClassName=""
              footerClassName=""
              backButtonText="Précédent"
              nextButtonText="Suivant"
              disableStepIndicators={true}
            >
              <Step>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Nom complet *</label>
                    <input name="name" value={form.name} onChange={onChange} onBlur={() => markTouched('name')} className={`w-full rounded-lg bg-white/5 ring-1 outline-none px-3 py-2 placeholder:text-white/40 ${invalid('name') ? 'ring-red-400 focus:ring-red-400' : 'ring-white/10 focus:ring-2 focus:ring-green-300/60'}`} placeholder="Votre nom" />
                    {invalid('name') && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={onChange} onBlur={() => markTouched('email')} className={`w-full rounded-lg bg-white/5 ring-1 outline-none px-3 py-2 placeholder:text-white/40 ${invalid('email') ? 'ring-red-400 focus:ring-red-400' : 'ring-white/10 focus:ring-2 focus:ring-green-300/60'}`} placeholder="vous@domaine.com" />
                    {invalid('email') && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Société</label>
                    <input name="company" value={form.company} onChange={onChange} className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-green-300/60 outline-none px-3 py-2 placeholder:text-white/40" placeholder="Nom de l'entreprise" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Téléphone</label>
                    <input name="phone" value={form.phone} onChange={onChange} className="w-full rounded-lg bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-green-300/60 outline-none px-3 py-2 placeholder:text-white/40" placeholder="Optionnel" />
                  </div>
                </div>
              </Step>

              <Step>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-1">Sujet *</label>
                    <div className="relative">
                    <select name="subject" value={form.subject} onChange={onChange} onBlur={() => markTouched('subject')} className={`select-base pr-10 ${invalid('subject') ? 'ring-red-400 focus:ring-red-400' : ''}`}>
                      <option value="">Choisir un sujet</option>
                      <option value="Audit">Audit</option>
                      <option value="Integration">Intégration</option>
                      <option value="Services manages">Services managés</option>
                      <option value="Autre">Autre</option>
                    </select>
                    {invalid('subject') && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/80 mb-1">Budget</label>
                  <div className="relative">
                    <select name="budget" value={form.budget} onChange={onChange} className="select-base pr-10">
                      <option value="">Non défini</option>
                      <option value="<10k">Moins de 10k</option>
                      <option value="10-50k">10 - 50k</option>
                      <option value=">50k">Plus de 50k</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-white/80 mb-1">Message *</label>
                  <textarea name="message" value={form.message} onChange={onChange} onBlur={() => markTouched('message')} rows={6} className={`w-full rounded-lg bg-white/5 ring-1 outline-none px-3 py-2 placeholder:text-white/40 scrollbar-themed textarea-resizable ${invalid('message') ? 'ring-red-400 focus:ring-red-400' : 'ring-white/10 focus:ring-2 focus:ring-green-300/60'}`} placeholder="Décrivez votre besoin..." />
                  {invalid('message') && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                </div>
              </div>
              </Step>

              <Step>
                <div className="space-y-4">
                  <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                    <div className="text-sm text-white/70">Récapitulatif</div>
                    <ul className="mt-2 text-sm text-gray-300/90 space-y-1">
                      <li><span className="text-white/60">Nom:&nbsp;</span>{form.name || "-"}</li>
                      <li><span className="text-white/60">Email:&nbsp;</span>{form.email || "-"}</li>
                      <li><span className="text-white/60">Société:&nbsp;</span>{form.company || "-"}</li>
                      <li><span className="text-white/60">Téléphone:&nbsp;</span>{form.phone || "-"}</li>
                      <li><span className="text-white/60">Sujet:&nbsp;</span>{form.subject || "-"}</li>
                      <li><span className="text-white/60">Budget:&nbsp;</span>{form.budget || "-"}</li>
                    </ul>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-gray-300/90">
                    <input type="checkbox" name="consent" checked={form.consent} onChange={onChange} className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-green-400 focus:ring-green-300" />
                    <span>J'accepte que mes données soient utilisées pour être recontacté.</span>
                  </label>
                </div>
              </Step>
            </Stepper>
          </form>
        )}
      </Panel>
    </div>
  );
}


