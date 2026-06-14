import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import QuantitySelector from '../components/ui/QuantitySelector';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { useCartStore, FREE_DELIVERY_THRESHOLD } from '../store/cartStore';
import { formatPrice, localized } from '../utils/helpers';

export default function Cart() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const navigate = useNavigate();

  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    applyPromoCode,
    appliedPromoCode,
    removePromoCode,
  } = useCartStore();

  const [code, setCode] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    const res = applyPromoCode(code);
    if (res.ok) {
      toast.success(t('promotions.codeApplied', { discount: res.percent }));
      setCode('');
    } else {
      toast.error(t('promotions.codeInvalid'));
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-x py-10">
        <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{t('cart.title')}</h1>
        <EmptyState
          icon={ShoppingBag}
          title={t('cart.empty')}
          message={t('cart.emptyMessage')}
          action={<Button to="/products" size="lg">{t('common.startShopping')}</Button>}
        />
      </div>
    );
  }

  const sub = subtotal();
  const remaining = FREE_DELIVERY_THRESHOLD - sub;

  return (
    <div className="container-x py-10">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          {remaining > 0 && (
            <div className="mb-4 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
              {lang === 'ru'
                ? `Добавьте товаров на ${formatPrice(remaining)} сум для бесплатной доставки`
                : `Bepul yetkazib berish uchun yana ${formatPrice(remaining)} so'mlik mahsulot qo'shing`}
            </div>
          )}

          <div className="overflow-hidden rounded-xl bg-surface shadow-card">
            {/* header (desktop) */}
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-black/5 px-5 py-3 text-xs font-bold uppercase text-muted sm:grid">
              <span>{t('cart.product')}</span>
              <span className="text-center">{t('cart.price')}</span>
              <span className="text-center">{t('cart.quantity')}</span>
              <span className="text-right">{t('cart.total')}</span>
              <span />
            </div>

            {items.map((item) => (
              <div
                key={item.key}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-black/5 px-4 py-4 last:border-0 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:px-5"
              >
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold leading-tight">{localized(item, 'name', lang)}</p>
                    <p className="text-xs text-muted">{item.weight}{item.unit}</p>
                    <p className="mt-1 text-sm font-bold text-primary sm:hidden">
                      {formatPrice(item.price * item.quantity)} {t('common.currency')}
                    </p>
                  </div>
                </div>
                <span className="hidden text-center text-sm sm:block">
                  {formatPrice(item.price)}
                </span>
                <div className="col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto sm:flex sm:justify-center">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.key, q)}
                    size="sm"
                  />
                </div>
                <span className="hidden text-right font-bold sm:block">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => {
                    removeItem(item.key);
                    toast.success(t('misc.removedFromCart'));
                  }}
                  className="col-start-2 row-start-2 justify-self-end text-muted transition hover:text-danger sm:col-start-auto sm:row-start-auto"
                  aria-label={t('cart.remove')}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <Link to="/products" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            ← {t('common.continueShopping')}
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-xl bg-surface p-5 shadow-card">
            <h2 className="mb-4 text-lg font-bold">{t('checkout.orderSummary')}</h2>

            <form onSubmit={handleApply} className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('promotions.enterCode')}
                    className="w-full rounded-lg border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm">
                  {t('common.apply')}
                </Button>
              </div>
              {appliedPromoCode && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
                  <span className="font-semibold">{appliedPromoCode}</span>
                  <button type="button" onClick={removePromoCode} className="text-xs underline">
                    {t('common.clear')}
                  </button>
                </div>
              )}
            </form>

            <div className="space-y-2.5 border-t border-black/5 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{t('cart.subtotal')}</span>
                <span className="font-semibold">{formatPrice(sub)} {t('common.currency')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">{t('cart.deliveryFee')}</span>
                <span className="font-semibold">
                  {deliveryFee() === 0 ? (
                    <span className="text-success">{t('common.free')}</span>
                  ) : (
                    `${formatPrice(deliveryFee())} ${t('common.currency')}`
                  )}
                </span>
              </div>
              {discountAmount() > 0 && (
                <div className="flex justify-between text-success">
                  <span>{t('cart.discount')}</span>
                  <span className="font-semibold">−{formatPrice(discountAmount())} {t('common.currency')}</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between border-t border-black/5 pt-4">
              <span className="font-bold">{t('cart.grandTotal')}</span>
              <span className="text-2xl font-extrabold text-primary">
                {formatPrice(total())} <span className="text-sm">{t('common.currency')}</span>
              </span>
            </div>

            <Button fullWidth size="lg" className="mt-5" onClick={() => navigate('/checkout')}>
              {t('cart.checkout')} <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
