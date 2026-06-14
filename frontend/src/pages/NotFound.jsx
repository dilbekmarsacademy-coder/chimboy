import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-[7rem] font-extrabold leading-none text-primary">404</p>
      <h1 className="mt-2 text-2xl font-bold">{t('notFound.title')}</h1>
      <p className="mt-2 max-w-sm text-muted">{t('notFound.message')}</p>
      <Button to="/" size="lg" className="mt-7">
        <Home size={18} /> {t('notFound.goHome')}
      </Button>
    </div>
  );
}
