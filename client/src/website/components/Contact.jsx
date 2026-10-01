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
      <header className="mb-4 md:mb-6 max-w-2xl">
        <h2 className={WS_H2}>{heading}</h2>
        {message ? <p className={WS_SUB}>{message}</p> : null}
      </header>

      <ul className="flex flex-col gap-3 max-w-xl list-none m-0 p-0">
        {email ? (
          <li className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <strong className="block text-sm font-semibold text-gray-900 mb-1">
              Email
            </strong>
            <a
              className="text-emerald-700 font-medium hover:text-emerald-800 transition-all"
              href={`mailto:${email}`}
            >
              {email}
            </a>
          </li>
        ) : null}
        {phone ? (
          <li className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <strong className="block text-sm font-semibold text-gray-900 mb-1">
              Phone
            </strong>
            <span className="text-gray-600">{phone}</span>
          </li>
        ) : null}
        {address ? (
          <li className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <strong className="block text-sm font-semibold text-gray-900 mb-1">
              Address
            </strong>
            <span className="text-gray-600">{address}</span>
          </li>
        ) : null}
      </ul>
    </SectionWrapper>
  );
}
