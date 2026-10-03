import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import FieldError from '../components/FieldError.jsx';
import { submitContact } from '../services/contactService.js';
import {
  fieldClass,
  getApiErrorMessage,
  validateContactFields,
} from '../utils/formValidation.js';

const baseFieldClass = 'contact-field';

const TOPICS = [
  'Product or builder questions',
  'Account access and billing',
  'Bug reports and export issues',
  'Partnerships or press',
];

export default function ContactPage() {
  const formId = useId();
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
    <div className="contact-page">
      <header className="contact-header">
        <p className="contact-kicker">Contact</p>
        <h1>Talk with the WebStructura team</h1>
        <p className="contact-lead">
          Questions about your workspace, a stuck export, billing, or getting
          started? Send a short note — we usually reply within one business day.
        </p>
      </header>

      <div className="contact-layout">
        <aside className="contact-aside" aria-labelledby="contact-details-heading">
          <h2 id="contact-details-heading" className="contact-aside-title">
            Direct details
          </h2>

          <dl className="contact-details">
            <div>
              <dt>Email</dt>
              <dd>
                <a href="mailto:support@webstructura.app">
                  support@webstructura.app
                </a>
              </dd>
              <dd className="contact-detail-note">
                Best for product help, account access, and general questions.
              </dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>Monday–Friday, 9:00–17:00 UTC</dd>
              <dd className="contact-detail-note">
                Remote-first team. Weekend messages are answered on the next
                business day.
              </dd>
            </div>
            <div>
              <dt>What to include</dt>
              <dd className="contact-detail-note">
                A clear subject in your first sentence, your account email if
                relevant, and steps to reproduce if you hit a bug.
              </dd>
            </div>
          </dl>

          <div className="contact-topics">
            <h3>Common topics</h3>
            <ul>
              {TOPICS.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>

          <p className="contact-privacy-note">
            Need the legal side? Read our{' '}
            <Link to="/privacy">Privacy Policy</Link> and{' '}
            <Link to="/terms">Terms of Service</Link>.
          </p>
        </aside>

        <section
          className="contact-form-panel"
          aria-labelledby="contact-form-heading"
        >
          <h2 id="contact-form-heading">Send a message</h2>
          <p className="contact-form-lead">
            Fill this in and we will get back to the email you provide.
          </p>

          {success ? (
            <p className="contact-success" role="status">
              Thanks — your message was sent. We&apos;ll reply to your email
              soon.
            </p>
          ) : null}

          {error ? (
            <p className="contact-error" role="alert">
              {error}
            </p>
          ) : null}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-field-group">
              <label htmlFor={`${formId}-name`}>Name</label>
              <input
                id={`${formId}-name`}
                className={fieldClass(baseFieldClass, Boolean(fieldErrors.name))}
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={fieldErrors.name ? true : undefined}
                aria-describedby={
                  fieldErrors.name ? `${formId}-name-error` : undefined
                }
              />
              <FieldError id={`${formId}-name-error`} message={fieldErrors.name} />
            </div>

            <div className="contact-field-group">
              <label htmlFor={`${formId}-email`}>Email</label>
              <input
                id={`${formId}-email`}
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
                aria-describedby={
                  fieldErrors.email ? `${formId}-email-error` : undefined
                }
              />
              <FieldError
                id={`${formId}-email-error`}
                message={fieldErrors.email}
              />
            </div>

            <div className="contact-field-group">
              <label htmlFor={`${formId}-message`}>Message</label>
              <textarea
                id={`${formId}-message`}
                className={`${fieldClass(
                  baseFieldClass,
                  Boolean(fieldErrors.message),
                )} contact-textarea`}
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={fieldErrors.message ? true : undefined}
                aria-describedby={
                  fieldErrors.message ? `${formId}-message-error` : undefined
                }
                placeholder="What do you need help with?"
              />
              <FieldError
                id={`${formId}-message-error`}
                message={fieldErrors.message}
              />
            </div>

            <button
              type="submit"
              className="contact-submit"
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
