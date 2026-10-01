import { useState } from 'react';
import { Clock, Mail, MapPin } from 'lucide-react';
import FieldError from '../components/FieldError.jsx';
import { submitContact } from '../services/contactService.js';
import {
  fieldClass,
  getApiErrorMessage,
  validateContactFields,
} from '../utils/formValidation.js';

const baseFieldClass =
  'w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm text-gray-900';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setError('');
    setSuccess(false);
    const errors = validateContactFields(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
      setFieldErrors({});
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          'Could not send your message. Please try again.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-page min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-16 px-6 lg:px-12 max-w-7xl mx-auto">
      <header className="contact-header mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-6 shadow-sm">
          💬 Get in Touch
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Talk with the WebStructura team
        </h1>
        <p className="text-lg text-gray-600 mt-3 leading-relaxed max-w-2xl">
          Questions about your workspace, billing, or a project? Send a note —
          we typically reply within one business day.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-w-0 max-w-5xl">
        <aside className="contact-aside w-full lg:w-72 shrink-0 space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-gray-900 m-0 tracking-tight">
                Support email
              </h2>
            </div>
            <a
              className="text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
              href="mailto:support@webstructura.app"
            >
              support@webstructura.app
            </a>
            <p className="text-sm text-gray-500 m-0 leading-relaxed">
              Product help, account access, and general inquiries.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-gray-900 m-0 tracking-tight">
                Location
              </h2>
            </div>
            <p className="text-emerald-700 font-medium m-0 leading-relaxed">
              Remote-first · Serving teams worldwide
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-500 leading-relaxed">
              <Clock
                className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <p className="m-0">Hours: Mon–Fri, 9:00–17:00 UTC</p>
            </div>
          </div>
        </aside>

        <section className="contact-form-panel flex-1 min-w-0 w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-2xl shadow-gray-100/50 p-8 md:p-10">
          <h2 className="text-xl font-bold text-gray-900 m-0 mb-6 tracking-tight">
            Send a message
          </h2>

          {success ? (
            <p
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl mb-4"
              role="status"
            >
              Thanks — your message was sent. We&apos;ll get back to you soon.
            </p>
          ) : null}

          {error ? (
            <p className="error text-sm mb-4" role="alert">
              {error}
            </p>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-900">Name</span>
              <input
                className={fieldClass(
                  baseFieldClass,
                  Boolean(fieldErrors.name),
                )}
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={fieldErrors.name ? true : undefined}
              />
              <FieldError message={fieldErrors.name} />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-900">Email</span>
              <input
                className={fieldClass(
                  baseFieldClass,
                  Boolean(fieldErrors.email),
                )}
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={fieldErrors.email ? true : undefined}
              />
              <FieldError message={fieldErrors.email} />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-gray-900">
                Message
              </span>
              <textarea
                className={`${fieldClass(
                  baseFieldClass,
                  Boolean(fieldErrors.message),
                )} min-h-[140px] resize-y`}
                name="message"
                value={form.message}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={fieldErrors.message ? true : undefined}
              />
              <FieldError message={fieldErrors.message} />
            </label>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
