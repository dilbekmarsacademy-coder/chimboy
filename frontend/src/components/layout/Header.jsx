import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut } from 'lucide-react';
import Logo from '../ui/Logo';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import SearchBar from '../ui/SearchBar';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/', key: 'home', end: true },
  { to: '/products', key: 'products' },
  { to: '/promotions', key: 'promotions' },
  { to: '/stores', key: 'stores' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
];

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-primary' : 'text-text hover:text-primary'
    }`;

  return (
    <>
      {/* top strip — hidden on mobile to reclaim vertical space */}
      <div className="hidden bg-text text-white sm:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <span>{t('cart.freeDeliveryNote')}</span>
          <a href="tel:+998712001001" className="font-medium hover:text-accent">
            +998 95 036 00 00
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-surface transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {({ isActive }) => (
                  <>
                    {t(`nav.${item.key}`)}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-primary"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text transition hover:bg-black/5"
              aria-label="search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-text transition hover:bg-black/5 sm:flex"
              aria-label="wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-text transition hover:bg-black/5"
              aria-label="cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link
                  to="/profile"
                  className="flex h-10 items-center gap-2 rounded-full bg-black/5 px-3 text-sm font-semibold transition hover:bg-black/10"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[80px] truncate">{user?.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-primary"
                  aria-label={t('common.logout')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark sm:flex"
              >
                <User size={16} /> {t('common.login')}
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text transition hover:bg-black/5 lg:hidden"
              aria-label="menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <motion.div
              className="relative z-10 w-full max-w-xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <SearchBar onClose={() => setSearchOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[80] flex h-full w-80 max-w-[85%] flex-col bg-surface shadow-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex items-center justify-between border-b border-black/5 p-4">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
                  aria-label="close"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-3 text-base font-semibold transition ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-black/5'
                      }`
                    }
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-black/5 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <LanguageSwitcher />
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-muted"
                  >
                    <Heart size={18} /> {t('profile.wishlist')}
                  </Link>
                </div>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      navigate('/');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary py-3 font-semibold text-primary"
                  >
                    <LogOut size={18} /> {t('common.logout')}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-white"
                  >
                    <User size={18} /> {t('common.login')}
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
