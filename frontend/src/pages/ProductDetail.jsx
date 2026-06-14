import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Heart, ShoppingCart, ShieldCheck, Leaf, BadgeCheck, ChevronRight } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import ImageGallery from '../components/ui/ImageGallery';
import StarRating from '../components/ui/StarRating';
import PriceDisplay from '../components/ui/PriceDisplay';
import QuantitySelector from '../components/ui/QuantitySelector';
import CountdownTimer from '../components/ui/CountdownTimer';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ProductCard from '../components/ui/ProductCard';
import { getProductById, getRelatedProducts, getReviewsByProduct } from '../services/productService';
import { getPromotions } from '../services/promotionService';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { localized, applyDiscount } from '../utils/helpers';

// Build weight variants from the product's real weight with proportional pricing.
const buildVariants = (product) => {
  const base = product.weight;
  const round = (n) => Math.max(500, Math.round(n / 500) * 500);
  const sizes = [...new Set([Math.round(base / 2), base, base * 2])].filter((s) => s >= 50);
  return sizes.map((w) => {
    const ratio = w / base;
    return {
      weight: w,
      price: w === base ? product.price : round(product.price * ratio),
      oldPrice: product.oldPrice ? (w === base ? product.oldPrice : round(product.oldPrice * ratio)) : null,
    };
  });
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, comment: '' });

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlisted = useWishlistStore((s) => (product ? s.items.includes(product.id) : false));

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    getProductById(id).then(async (p) => {
      if (!p) {
        setLoading(false);
        return;
      }
      setProduct(p);
      setWeight(p.weight);
      setQty(1);
      setTab('description');
      const [rel, rev, promos] = await Promise.all([
        getRelatedProducts(p.id),
        getReviewsByProduct(p.id),
        getPromotions('all'),
      ]);
      setRelated(rel);
      setReviews(rev);
      setPromo(promos.find((pr) => pr.productId === p.id) || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">{t('products.noResults')}</h1>
        <Button to="/products">{t('nav.products')}</Button>
      </div>
    );
  }

  const name = localized(product, 'name', lang);
  const category = product.category;

  // Weight variants + the currently selected one (defaults to base weight).
  const variants = buildVariants(product);
  const selectedWeight = weight ?? product.weight;
  const variant = variants.find((v) => v.weight === selectedWeight) || variants[0];

  // Apply the live promo on top of the variant price, so the countdown is real.
  const hasPromo = !!promo;
  const currentPrice = hasPromo ? applyDiscount(variant.price, promo.discountPercent) : variant.price;
  const strikePrice = hasPromo ? variant.price : variant.oldPrice;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, { weight: selectedWeight, quantity: qty, price: currentPrice });
    toast.success(t('misc.addedToCart'));
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.rating || !reviewForm.comment) return;
    setReviews((prev) => [
      {
        id: Date.now(),
        productId: product.id,
        userName: reviewForm.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setReviewForm({ name: '', rating: 0, comment: '' });
    toast.success(t('product.reviewSubmitted'));
  };

  const tabs = [
    { key: 'description', label: t('product.description') },
    { key: 'ingredients', label: t('product.ingredients') },
    { key: 'storage', label: t('product.storage') },
    { key: 'certificates', label: t('product.certificates') },
    { key: 'reviews', label: `${t('product.reviews')} (${reviews.length})` },
  ];

  const trustBadges = [
    { icon: Leaf, label: t('product.natural') },
    { icon: BadgeCheck, label: t('product.gost') },
    { icon: ShieldCheck, label: t('product.fresh') },
  ];

  return (
    <div className="container-x py-8">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('nav.products'), href: `/products?category=${category}` },
          { label: name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} alt={name} />

        <div>
          <div className="flex items-center gap-2">
            <Badge variant="danger">Chimboy</Badge>
            {product.isNew && <Badge variant="new">{t('misc.newBadge')}</Badge>}
            {product.inStock ? (
              <Badge variant="success">{t('common.inStock')}</Badge>
            ) : (
              <Badge variant="neutral">{t('common.outOfStock')}</Badge>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{name}</h1>

          <a href="#reviews" onClick={() => setTab('reviews')} className="mt-2 flex items-center gap-2">
            <StarRating value={product.rating} />
            <span className="text-sm text-muted">
              {product.rating} · {product.reviewCount} {t('common.reviews')}
            </span>
          </a>

          <div className="mt-5">
            <PriceDisplay price={currentPrice} oldPrice={strikePrice} size="lg" />
            {promo && (
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                {t('common.endsIn')}: <CountdownTimer expiresAt={promo.expiresAt} variant="inline" />
              </div>
            )}
          </div>

          {/* Weight selector */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-bold">{t('product.selectWeight')}</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.weight}
                  onClick={() => setWeight(v.weight)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
                    selectedWeight === v.weight
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-black/10 hover:border-primary/50'
                  }`}
                >
                  {v.weight}{product.unit}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div>
              <p className="mb-2 text-sm font-bold">{t('product.quantity')}</p>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={handleAddToCart} disabled={!product.inStock} className="flex-1">
              <ShoppingCart size={20} /> {t('common.addToCart')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const added = toggleWishlist(product.id);
                toast.success(added ? t('misc.addedToWishlist') : t('misc.removedFromWishlist'));
              }}
            >
              <Heart size={20} className={wishlisted ? 'fill-primary text-primary' : ''} />
              {t('product.addToWishlist')}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-black/5 pt-6">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <Icon size={24} className="text-success" />
                <span className="text-xs font-medium text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div id="reviews" className="mt-12">
        <div className="hide-scrollbar flex gap-1 overflow-x-auto border-b border-black/10">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === tb.key ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === 'description' && (
            <p className="max-w-3xl leading-relaxed text-muted">{localized(product, 'description', lang)}</p>
          )}

          {tab === 'ingredients' && (
            <div className="max-w-3xl">
              <ul className="flex flex-wrap gap-2">
                {localized(product, 'ingredients', lang)
                  .split(',')
                  .map((ing, i) => (
                    <li key={i} className="rounded-full bg-black/5 px-3 py-1.5 text-sm">
                      {ing.trim()}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {tab === 'storage' && (
            <div className="max-w-3xl space-y-3 text-muted">
              <p className="leading-relaxed">{localized(product, 'storageInfo', lang)}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <span className="rounded-lg bg-black/5 px-4 py-2 text-sm">
                  <strong>{t('product.shelfLife')}:</strong> 180 {lang === 'ru' ? 'дней' : 'kun'}
                </span>
                <span className="rounded-lg bg-black/5 px-4 py-2 text-sm">
                  <strong>{t('product.temperature')}:</strong> 0°C — +14°C
                </span>
              </div>
            </div>
          )}

          {tab === 'certificates' && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {['ISO 22000', 'GOST', 'HALAL', 'HACCP'].map((c) => (
                <div key={c} className="flex aspect-square flex-col items-center justify-center rounded-xl border border-black/10 bg-surface">
                  <BadgeCheck size={32} className="mb-2 text-success" />
                  <span className="font-bold">{c}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                {reviews.length === 0 && <p className="text-muted">—</p>}
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-black/5 bg-surface p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{r.userName}</span>
                      <span className="text-xs text-muted">{r.date}</span>
                    </div>
                    <StarRating value={r.rating} size={14} />
                    <p className="mt-2 text-sm text-muted">{r.comment}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={submitReview} className="h-fit rounded-xl border border-black/5 bg-surface p-5">
                <h3 className="mb-4 font-bold">{t('product.writeReview')}</h3>
                <div className="space-y-3">
                  <input
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder={t('product.yourName')}
                    required
                    className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{t('product.yourRating')}:</span>
                    <StarRating
                      value={reviewForm.rating}
                      readonly={false}
                      size={22}
                      onChange={(v) => setReviewForm({ ...reviewForm, rating: v })}
                    />
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder={t('product.yourComment')}
                    required
                    rows={4}
                    className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <Button type="submit" fullWidth>
                    {t('common.submit')}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">{t('product.relatedProducts')}</h2>
            <Link to={`/products?category=${category}`} className="text-sm font-semibold text-primary">
              {t('common.viewAll')} <ChevronRight size={14} className="inline" />
            </Link>
          </div>
          <div className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {related.map((p) => (
              <div key={p.id} className="w-56 shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
