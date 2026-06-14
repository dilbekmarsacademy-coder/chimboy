import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      toast.success(t('auth.loginSuccess'));
      navigate(location.state?.from || '/');
    } catch {
      toast.error(t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const input =
    'w-full rounded-lg border border-black/10 py-3 pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';

  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-4 text-2xl font-bold">{t('auth.loginTitle')}</h1>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              required
              className={input}
              placeholder={t('auth.emailOrPhone')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type={show ? 'text' : 'password'}
              required
              className={input}
              placeholder={t('auth.password')}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="h-4 w-4 rounded border-black/20 text-primary"
              />
              {t('auth.rememberMe')}
            </label>
            <button type="button" className="font-medium text-primary hover:underline">
              {t('auth.forgotPassword')}
            </button>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? <Spinner size="sm" className="border-white border-t-transparent" /> : <LogIn size={18} />}
            {t('common.login')}
          </Button>
        </form>

        <p className="mt-5 rounded-lg bg-bg p-3 text-center text-xs text-muted">
          Demo: {t('auth.password')} = <strong>chimboy123</strong>
        </p>

        <p className="mt-5 text-center text-sm text-muted">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            {t('common.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
