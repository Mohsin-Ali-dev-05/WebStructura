import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="form-page">
      <p className="page-kicker">404</p>
      <h1>Page not found</h1>
      <p className="page-subtitle">The page you requested does not exist.</p>
      <Link className="btn btn-primary" to="/">
        Back to home
      </Link>
    </section>
  );
}
