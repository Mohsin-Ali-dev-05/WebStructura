import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import {
  buildLoginRedirectState,
  getAuthGateMessage,
} from '../utils/authGate.js';

/**
 * Link to a protected destination.
 * Signed-in users go straight there; guests are guided to Sign in with a notice.
 */
export default function AuthLink({
  to,
  children,
  className = '',
  title,
  onClick,
  replace = false,
  message,
  notify = true,
  ...props
}) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const target = typeof to === 'string' ? to : to?.pathname || '/dashboard';
  const authMessage = message || getAuthGateMessage(target);
  const tip =
    title ||
    (isAuthenticated
      ? undefined
      : `${authMessage} Sign in to continue.`);

  function handleClick(event) {
    if (typeof onClick === 'function') {
      onClick(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    if (loading) {
      event.preventDefault();
      return;
    }

    if (isAuthenticated) {
      return;
    }

    event.preventDefault();

    if (notify) {
      toast(authMessage, {
        icon: '🔐',
        duration: 4000,
      });
    }

    navigate('/login', {
      replace,
      state: buildLoginRedirectState(target, { message: authMessage }),
    });
  }

  return (
    <Link
      to={isAuthenticated ? to : '/login'}
      className={className}
      title={tip}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
