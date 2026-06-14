import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings as SettingsIcon,
  Package,
  Gift,
  ChevronDown,
  Trash2,
  ShoppingCart,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import EmptyState from '../components/ui/EmptyState';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import Spinner from '../components/ui/Spinner';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { getOrders, getPointsHistory } from '../services/userService';
import { getProductsByIds } from '../services/productService';
import { formatPrice, localized } from '../utils/helpers';

const STATUS_VARIANT = {
  processing: 'warning',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

export default function Profile() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const { user, updateUser } = useAuthStore();
  const wishlistIds = useWishlistStore((s) => s.items);

  const [tab, setTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [points, setPoints] = useState([]);
  const [wishProducts, setWishProducts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });

  useEffect(() => {
    Promise.all([getOrders(), getPointsHistory()]).then(([o, p]) => {
      setOrders(o);
      setPoints(p);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getProductsByIds(wishlistIds).then(setWishProducts);
  }, [wishlistIds]);

  const tabs = [
    { key: 'dashboard', label: t('profile.dashboard'), icon: LayoutDashboard },
    { key: 'orders', label: t('profile.orders'), icon: ShoppingBag },
    { key: 'wishlist', label: t('profile.wishlist'), icon: Heart },
    { key: 'settings', label: t('profile.settings'), icon: SettingsIcon },
  ];

  const saveProfile = (e) => {
    e.preventDefault();
    updateUser({ name: profileForm.name, phone: profileForm.phone, email: profileForm.email });
    toast.success(t('common.save') + ' ✓');
  };

  const statusLabel = (s) => t(`profile.${s}`);

  const StatusBadge = ({ status }) => <Badge variant={STATUS_VARIANT[status]}>{statusLabel(status)}</Badge>;

  return (
    <div className="container-x py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit rounded-2xl bg-surface p-4 shadow-card lg:sticky lg:top-28">
          <div className="mb-4 flex items-center gap-3 border-b border-black/5 pb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold">{user?.name}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((tb) => {
              const Icon = tb.icon;
              return (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    tab === tb.key ? 'bg-primary text-white' : 'text-muted hover:bg-black/5'
                  }`}
                >
                  <Icon size={18} /> {tb.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {tab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="rounded-2xl bg-gradient-to-r from-primary-dark to-primary p-6 text-white">
                    <h1 className="text-xl font-bold">
                      {t('profile.welcome')}, {user?.name}! 👋
                    </h1>
                    <p className="mt-1 text-white/85">{t('profile.earnPoints')}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { icon: Package, label: t('profile.totalOrders'), value: orders.length },
                      { icon: Gift, label: t('profile.bonusPoints'), value: user?.bonusPoints ?? 0 },
                      { icon: Heart, label: t('profile.wishlistItems'), value: wishlistIds.length },
                    ].map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <div key={i} className="flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-card">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon size={22} />
                          </span>
                          <div>
                            <p className="text-2xl font-extrabold">{s.value}</p>
                            <p className="text-xs text-muted">{s.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl bg-surface p-5 shadow-card">
                    <h2 className="mb-4 font-bold">{t('profile.recentOrders')}</h2>
                    <div className="space-y-2">
                      {orders.slice(0, 3).map((o) => (
                        <div key={o.id} className="flex items-center justify-between rounded-lg bg-bg px-4 py-3 text-sm">
                          <span className="font-semibold">{o.id}</span>
                          <span className="text-muted">{o.date}</span>
                          <span className="font-semibold">{formatPrice(o.total)} {t('common.currency')}</span>
                          <StatusBadge status={o.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {tab === 'orders' && (
                <div className="rounded-2xl bg-surface p-5 shadow-card">
                  <h2 className="mb-4 font-bold">{t('profile.orders')}</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-black/5 text-left text-xs uppercase text-muted">
                          <th className="py-3 pr-4">{t('profile.orderId')}</th>
                          <th className="py-3 pr-4">{t('profile.date')}</th>
                          <th className="py-3 pr-4">{t('profile.items')}</th>
                          <th className="py-3 pr-4">{t('cart.total')}</th>
                          <th className="py-3 pr-4">{t('profile.status')}</th>
                          <th className="py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <Fragment key={o.id}>
                            <tr className="border-b border-black/5">
                              <td className="py-3 pr-4 font-semibold">{o.id}</td>
                              <td className="py-3 pr-4 text-muted">{o.date}</td>
                              <td className="py-3 pr-4">{o.items}</td>
                              <td className="py-3 pr-4 font-semibold">{formatPrice(o.total)}</td>
                              <td className="py-3 pr-4">
                                <StatusBadge status={o.status} />
                              </td>
                              <td className="py-3">
                                <button
                                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                                  className="flex items-center gap-1 text-xs font-semibold text-primary"
                                >
                                  {t('profile.viewDetails')}
                                  <ChevronDown
                                    size={14}
                                    className={`transition ${expanded === o.id ? 'rotate-180' : ''}`}
                                  />
                                </button>
                              </td>
                            </tr>
                            {expanded === o.id && (
                              <tr className="bg-bg">
                                <td colSpan={6} className="px-4 py-3 text-xs text-muted">
                                  {o.items} {t('profile.items')} · {formatPrice(o.total)} {t('common.currency')} ·{' '}
                                  {statusLabel(o.status)}
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* WISHLIST */}
              {tab === 'wishlist' && (
                <div>
                  {wishProducts.length === 0 ? (
                    <EmptyState
                      icon={Heart}
                      title={t('profile.emptyWishlist')}
                      action={<Button to="/products">{t('common.startShopping')}</Button>}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {wishProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS */}
              {tab === 'settings' && (
                <div className="space-y-6">
                  <form onSubmit={saveProfile} className="rounded-2xl bg-surface p-6 shadow-card">
                    <h2 className="mb-4 font-bold">{t('profile.editProfile')}</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        className="rounded-lg border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder={t('contact.name')}
                      />
                      <input
                        className="rounded-lg border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder={t('checkout.phone')}
                      />
                      <input
                        className="rounded-lg border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder={t('contact.email')}
                      />
                    </div>
                    <Button type="submit" className="mt-4">
                      {t('common.save')}
                    </Button>
                  </form>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      toast.success(t('common.save') + ' ✓');
                    }}
                    className="rounded-2xl bg-surface p-6 shadow-card"
                  >
                    <h2 className="mb-4 font-bold">{t('profile.changePassword')}</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        type="password"
                        className="rounded-lg border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        placeholder={t('profile.currentPassword')}
                      />
                      <input
                        type="password"
                        className="rounded-lg border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                        placeholder={t('profile.newPassword')}
                      />
                    </div>
                    <Button type="submit" variant="secondary" className="mt-4">
                      {t('common.save')}
                    </Button>
                  </form>

                  <div className="rounded-2xl bg-surface p-6 shadow-card">
                    <h2 className="mb-4 font-bold">{t('profile.language')}</h2>
                    <LanguageSwitcher />
                  </div>

                  <div className="rounded-2xl bg-surface p-6 shadow-card">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-bold">{t('profile.bonusPoints')}</h2>
                      <span className="text-2xl font-extrabold text-primary">{user?.bonusPoints ?? 0}</span>
                    </div>
                    <p className="mb-4 text-sm text-muted">{t('profile.earnPoints')}</p>
                    <h3 className="mb-2 text-sm font-bold">{t('profile.pointsHistory')}</h3>
                    <div className="space-y-2">
                      {points.map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-lg bg-bg px-4 py-2.5 text-sm">
                          <span>{localized(p, 'description', lang)}</span>
                          <span className="text-muted">{p.date}</span>
                          <span className="font-bold text-success">+{p.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
