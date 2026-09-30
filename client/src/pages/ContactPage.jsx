import { useState } from "react";
import FieldError from "../components/FieldError.jsx";
import { submitContact } from "../services/contactService.js";
import {
  fieldClass,
  getApiErrorMessage,
  validateContactFields,
} from "../utils/formValidation.js";

const baseFieldClass =
  "w-full py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none transition-shadow shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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

    setError("");
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
      setForm({ name: "", email: "", message: "" });
      setFieldErrors({});
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Could not send your message. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-page pt-12 pb-16 lg:pt-16 lg:pb-24">
      <header className="contact-header mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-text tracking-normal">
          Talk with the WebStructura team
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl leading-relaxed">
          Questions about your workspace, billing, or a project? Send a note —
          we typically reply within one business day.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="contact-aside lg:w-2/5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 md:p-8">
            <h2 className="text-lg font-bold text-brand-text m-0 mb-2 tracking-normal">
              Support email
            </h2>
            <a
              className="text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
              href="mailto:support@webstructura.app"
            >
              support@webstructura.app
            </a>
            <p className="text-sm text-gray-500 mt-2 m-0 leading-relaxed">
              Product help, account access, and general inquiries.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 md:p-8">
            <h2 className="text-lg font-bold text-brand-text m-0 mb-2 tracking-normal">
              Location
            </h2>
            <p className="text-emerald-700 font-medium hover:text-emerald-800 m-0 leading-relaxed">
              Remote-first · Serving teams worldwide
            </p>
            <p className="text-sm text-gray-500 mt-2 m-0 leading-relaxed">
              Hours: Mon–Fri, 9:00–17:00 UTC
            </p>
          </div>
        </aside>

        <section className="contact-form-panel flex-1 bg-white rounded-2xl border border-gray-100 shadow-soft p-6 md:p-8">
          <h2 className="text-xl font-bold text-brand-text m-0 mb-6 tracking-normal">
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
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
