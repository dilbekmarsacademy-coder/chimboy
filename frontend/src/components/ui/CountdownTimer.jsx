import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useCountdown from '../../hooks/useCountdown';

const pad = (n) => String(n).padStart(2, '0');

export default function CountdownTimer({ expiresAt, variant = 'boxes', className = '' }) {
  const { t } = useTranslation();
  const { days, hours, minutes, seconds, expired } = useCountdown(expiresAt);

  if (expired) {
    return <span className={`text-xs font-semibold text-muted ${className}`}>—</span>;
  }

  if (variant === 'inline') {
    return (
      <span className={`font-mono text-sm font-bold tabular-nums ${className}`}>
        {days > 0 && `${days}d `}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    );
  }

  const Box = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <span className="min-w-[2.2rem] rounded-md bg-text px-1.5 py-1 text-center font-mono text-sm font-bold tabular-nums text-white">
        {pad(value)}
      </span>
      <span className="mt-1 text-[10px] uppercase text-muted">{label}</span>
    </div>
  );

  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label={t('common.endsIn')}>
      {days > 0 && <Box value={days} label="d" />}
      <Box value={hours} label="h" />
      <Box value={minutes} label="m" />
      <Box value={seconds} label="s" />
    </div>
  );
}

CountdownTimer.propTypes = {
  expiresAt: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['boxes', 'inline']),
  className: PropTypes.string,
};
