import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Check, MapPin, CreditCard, ClipboardCheck, Banknote, PartyPopper } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import {
  formatPrice,
  localized,
  generateOrderNumber,
  isPhone,
  isCardNumber,
  isExpiry,
  isCvv,
} from '../utils/helpers';

const CITIES = ['Toshkent shahar', 'Toshkent viloyati', 'Samarqand shahar', 'Samarqand viloyati','Buxoro shahar', 'Buxoro viloyati ', 'Namangan shahar', 'Namangan viloyati ', 'Andijon shahar', 'Andijon viloyati ', "Farg'ona shahar",  "Farg‘ona viloyati",'Nukus shahar', 'Surxondaryo viloyati ','Termiz shahar'];

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, discountAmount, total, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState(null);
  const [delivery, setDelivery] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: '',
    city: CITIES[0],
    address: '',
    timeSlot: 'morning',
  });
  const [payment, setPayment] = useState('cash');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderNumber) navigate('/cart');
  }, [items.length, orderNumber, navigate]);

  const steps = [
    { n: 1, label: t('checkout.step1'), icon: MapPin },
    { n: 2, label: t('checkout.step2'), icon: CreditCard },
    { n: 3, label: t('checkout.step3'), icon: ClipboardCheck },
  ];

  const validStep1 = delivery.firstName && delivery.lastName && delivery.phone && delivery.address;

  const goToStep2 = () => {
    if (!isPhone(delivery.phone)) {
      toast.error(t('validation.invalidPhone'));
      return;
    }
    setStep(2);
  };

  const goToStep3 = () => {
    if (payment === 'card' && !(isCardNumber(card.number) && isExpiry(card.expiry) && isCvv(card.cvv))) {
      toast.error(t('validation.invalidCard'));
      return;
    }
    setStep(3);
  };

  const placeOrder = () => {
    if (!agree) {
      toast.error(t('auth.agreeRequired'));
      return;
    }
    const num = generateOrderNumber();
    setOrderNumber(num);
    setTimeout(() => {
      clearCart();
    }, 300);
    setTimeout(() => navigate('/'), 4000);
  };

  const paymentMethods = [
    { id: 'payme', label: 'Payme', logo: 'Payme', card: false },
    { id: 'click', label: 'Click', logo: 'Click', card: false },
    { id: 'cash', label: t('checkout.cashOnDelivery'), icon: Banknote, card: false },
    { id: 'card', label: 'Uzcard / Humo', logo: 'Uzcard', card: true },
  ];

  const input =
    'w-full rounded-lg border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';

  const OrderSummary = () => (
    <div className="rounded-xl bg-surface p-5 shadow-card">
      <h3 className="mb-4 font-bold">{t('checkout.orderSummary')}</h3>
      <div className="hide-scrollbar max-h-56 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-3">
            <img src={item.image} alt="" className="h-12 w-12 rounded object-cover" />
            <div className="flex-1 text-sm">
              <p className="font-medium leading-tight">{localized(item, 'name', lang)}</p>
              <p className="text-xs text-muted">
                {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm">
        <div className="flex justify-between text-muted">
          <span>{t('cart.subtotal')}</span>
          <span>{formatPrice(subtotal())}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>{t('cart.deliveryFee')}</span>
          <span>{deliveryFee() === 0 ? t('common.free') : formatPrice(deliveryFee())}</span>
        </div>
        {discountAmount() > 0 && (
          <div className="flex justify-between text-success">
            <span>{t('cart.discount')}</span>
            <span>−{formatPrice(discountAmount())}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-black/5 pt-2 text-base font-bold">
          <span>{t('cart.grandTotal')}</span>
          <span className="text-primary">{formatPrice(total())} {t('common.currency')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-x py-10">
      <h1 className="mb-8 text-center text-2xl font-bold sm:text-3xl">{t('checkout.title')}</h1>

      {/* Stepper */}
      <div className="mx-auto mb-10 flex max-w-2xl items-center">
        {steps.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          const Icon = s.icon;
          return (
            <div key={s.n} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                    done
                      ? 'border-success bg-success text-white'
                      : active
                        ? 'border-primary bg-primary text-white'
                        : 'border-black/15 bg-surface text-muted'
                  }`}
                >
                  {done ? <Check size={20} /> : <Icon size={20} />}
                </div>
                <span className={`mt-2 text-xs font-semibold ${active ? 'text-primary' : 'text-muted'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded ${step > s.n ? 'bg-success' : 'bg-black/10'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="rounded-xl bg-surface p-6 shadow-card">
              <h2 className="mb-5 text-lg font-bold">{t('checkout.step1')}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t('checkout.firstName')}</label>
                  <input
                    className={input}
                    value={delivery.firstName}
                    onChange={(e) => setDelivery({ ...delivery, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t('checkout.lastName')}</label>
                  <input
                    className={input}
                    value={delivery.lastName}
                    onChange={(e) => setDelivery({ ...delivery, lastName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t('checkout.phone')}</label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-lg border border-r-0 border-black/10 bg-black/5 px-3 text-sm text-muted">
                      +998
                    </span>
                    <input
                      className={`${input} rounded-l-none`}
                      placeholder="90 123 45 67"
                      value={delivery.phone}
                      onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">{t('checkout.city')}</label>
                  <select
                    className={input}
                    value={delivery.city}
                    onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                  >
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">{t('checkout.address')}</label>
                  <textarea
                    rows={3}
                    className={input}
                    value={delivery.address}
                    onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium">{t('checkout.deliveryTime')}</label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      { id: 'morning', label: t('checkout.morning') },
                      { id: 'afternoon', label: t('checkout.afternoon') },
                      { id: 'evening', label: t('checkout.evening') },
                    ].map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setDelivery({ ...delivery, timeSlot: slot.id })}
                        className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition ${
                          delivery.timeSlot === slot.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-black/10 hover:border-primary/40'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button size="lg" disabled={!validStep1} onClick={goToStep2}>
                  {t('common.next')}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="rounded-xl bg-surface p-6 shadow-card">
              <h2 className="mb-5 text-lg font-bold">{t('checkout.paymentMethod')}</h2>
              <div className="space-y-3">
                {paymentMethods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                        payment === m.id ? 'border-primary bg-primary/5' : 'border-black/10 hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === m.id}
                        onChange={() => setPayment(m.id)}
                        className="h-4 w-4 text-primary"
                      />
                      {Icon ? (
                        <Icon size={22} className="text-primary" />
                      ) : (
                        <span className="rounded bg-text px-2 py-1 text-xs font-bold text-white">{m.logo}</span>
                      )}
                      <span className="font-semibold">{m.label}</span>
                    </label>
                  );
                })}
              </div>

              {payment === 'card' && (
                <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-bg p-4">
                  <div className="col-span-2">
                    <label className="mb-1.5 block text-sm font-medium">{t('checkout.cardNumber')}</label>
                    <input
                      className={input}
                      placeholder="8600 0000 0000 0000"
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{t('checkout.expiry')}</label>
                    <input
                      className={input}
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">{t('checkout.cvv')}</label>
                    <input
                      className={input}
                      placeholder="123"
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  {t('common.back')}
                </Button>
                <Button size="lg" onClick={goToStep3}>
                  {t('common.next')}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="rounded-xl bg-surface p-6 shadow-card">
              <h2 className="mb-5 text-lg font-bold">{t('checkout.step3')}</h2>

              <div className="space-y-4">
                <div className="rounded-xl bg-bg p-4">
                  <h3 className="mb-1 text-sm font-bold">{t('checkout.step1')}</h3>
                  <p className="text-sm text-muted">
                    {delivery.firstName} {delivery.lastName} · +998 {delivery.phone}
                    <br />
                    {delivery.city}, {delivery.address}
                  </p>
                </div>
                <div className="rounded-xl bg-bg p-4">
                  <h3 className="mb-1 text-sm font-bold">{t('checkout.paymentMethod')}</h3>
                  <p className="text-sm text-muted">
                    {paymentMethods.find((m) => m.id === payment)?.label}
                  </p>
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 rounded border-black/20 text-primary"
                />
                <span className="text-sm">{t('checkout.agreeTerms')}</span>
              </label>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  {t('common.back')}
                </Button>
                <Button size="lg" onClick={placeOrder}>
                  {t('checkout.placeOrder')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <OrderSummary />
          </div>
        </div>
      </div>

      {/* Success modal */}
      <Modal isOpen={!!orderNumber} onClose={() => navigate('/')}>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <PartyPopper size={32} />
          </div>
          <h3 className="text-xl font-bold">{t('checkout.orderSuccess')}</h3>
          <p className="mt-2 text-muted">
            {t('checkout.orderNumber')}: <span className="font-bold text-primary">{orderNumber}</span>
          </p>
          <p className="mt-1 text-sm text-muted">{t('checkout.smsConfirm')}</p>
          <Button fullWidth className="mt-6" onClick={() => navigate('/')}>
            {t('notFound.goHome')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
