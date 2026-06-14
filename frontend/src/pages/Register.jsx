import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuthStore } from '../store/authStore';
import { isEmail, isPhone } from '../utils/helpers';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirm: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!isEmail(form.email)) {
      toast.error(t('validation.invalidEmail'));
      return;
    }
    if (!isPhone(form.phone)) {
      toast.error(t('validation.invalidPhone'));
      return;
    }
    if (form.password !== form.confirm) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }
    if (!form.agree) {
      toast.error(t('auth.agreeRequired'));
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const input =
    'w-full rounded-lg border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';

  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-8 shadow-card">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-4 text-2xl font-bold">{t('auth.registerTitle')}</h1>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            required
            className={input}
            placeholder={t('checkout.firstName')}
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <input
            required
            className={input}
            placeholder={t('checkout.lastName')}
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <input
            required
            className={`${input} sm:col-span-2`}
            placeholder="+998 90 123 45 67"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="email"
            required
            className={`${input} sm:col-span-2`}
            placeholder={t('contact.email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            required
            className={input}
            placeholder={t('auth.password')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="password"
            required
            className={input}
            placeholder={t('auth.confirmPassword')}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />

          <label className="flex cursor-pointer items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
              className="h-4 w-4 rounded border-black/20 text-primary"
            />
            {t('checkout.agreeTerms')}
          </label>

          <div className="sm:col-span-2">
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? <Spinner size="sm" className="border-white border-t-transparent" /> : <UserPlus size={18} />}
              {t('common.register')}
            </Button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t('common.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
