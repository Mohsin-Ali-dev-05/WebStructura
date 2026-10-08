import SectionWrapper from './SectionWrapper.jsx';
import { WS_H2, WS_SUB } from './designSystem.js';

export default function Contact({
  heading = 'Contact',
  email = '',
  phone = '',
  address = '',
  message = '',
}) {
  return (
    <SectionWrapper
      id="contact"
      className="ws-section"
      aria-label="Contact"
    >
      <header className="mb-5 md:mb-7 max-w-2xl">
        <h2 className={WS_H2}>{heading}</h2>
        {message ? <p className={WS_SUB}>{message}</p> : null}
      </header>

      <ul className="flex flex-col gap-2.5 max-w-md list-none m-0 p-0">
        {email ? (
          <li className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <strong className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
              Email
            </strong>
            <a
              className="text-sm text-emerald-700 font-medium hover:text-emerald-800 transition-colors"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          </li>
        ) : null}
        {phone ? (
          <li className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <strong className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
              Phone
            </strong>
            <span className="text-sm text-gray-700">{phone}</span>
          </li>
        ) : null}
        {address ? (
          <li className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <strong className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
              Address
            </strong>
            <span className="text-sm text-gray-700">{address}</span>
          </li>
        ) : null}
      </ul>
    </SectionWrapper>
  );
}
