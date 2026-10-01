import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="not-found-page min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50/50 px-6 text-center">
      <div
        className="text-8xl md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-300 select-none drop-shadow-sm leading-none mb-6"
        aria-hidden="true"
      >
        404
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
        Page not found
      </h1>
      <p className="text-lg text-gray-500 mt-4 max-w-md mx-auto leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Head back home to keep building.
      </p>

      <Link
        to="/"
        className="mt-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>
    </div>
  );
}
