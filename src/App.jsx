import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './supabase';
import Home from './Home';
import ExploreCategories from './ExploreCategories';
import Contact from './Contact';
import History from './History';
import OtpVerificationModal from './OtpVerificationModal';
import { usingFallbackSupabaseConfig } from './supabase';

const PRODUCTS_TABLE = 'product';
const ORDERS_TABLE = 'orders';
const SORT_OPTIONS = ['default', 'price-asc', 'price-desc', 'name-asc'];
const WISHLIST_TABLE = 'wishlist';
const HISTORY_TABLE = 'history';
const STORAGE_PREFIX = 'flipmark-state';
const ORDER_STAGES = ['Confirmed', 'Packed', 'Out for delivery', 'Delivered'];
const PROMO_CODES = {
  SAVE10: { type: 'percent', value: 10, label: '10% off' },
  WELCOME5: { type: 'flat', value: 5, label: '₹5 off' },
  FREESHIP: { type: 'flat', value: 40, label: 'Delivery fee waived' },
};
const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label="No image available">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f4efe6" />
          <stop offset="100%" stop-color="#e7dcc8" />
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#bg)" />
      <rect x="80" y="70" width="480" height="340" rx="28" fill="#fffaf2" stroke="#d6cab5" stroke-width="6" />
      <circle cx="250" cy="190" r="40" fill="#d9c7ab" />
      <path d="M170 360l95-110 70 75 58-44 77 79H170z" fill="#d8c7ab" />
      <text x="320" y="278" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#7b6f5f">No image available</text>
    </svg>
  `);

const BROWSE_CATEGORIES = [
  { name: 'fruit', url: 'https://i1-e.pinimg.com/736x/3c/0d/e3/3c0de391cc7481d46823ce2c7783e46f.jpg' },
  { name: 'vegetable', url: 'https://i.pinimg.com/736x/e1/97/54/e197541134f94ba268224cc0daf6397d.jpg' },
  { name: 'juice', url: 'https://i.pinimg.com/736x/87/f8/ad/87f8adddcabe77c01a5ba68cc44bbefd.jpg' },
  { name: 'pulse', url: 'https://i1-e.pinimg.com/236x/6a/83/84/6a8384c79498dd8509b7dbde5d78b966.jpg' },
  { name: 'Cereal', url: 'https://i1-e.pinimg.com/736x/88/b5/4d/88b54d96d591e6727186775099ead63b.jpg' },
  { name: 'dairy', url: 'https://i1-e.pinimg.com/736x/2c/e7/11/2ce711058a94302de93350453d712ce4.jpg' },
  { name: 'snacks', url: 'https://i1-e.pinimg.com/736x/a4/be/02/a4be02805f3cea603c8939b42f86a7bf.jpg' },
  { name: 'masala', url: 'https://i.pinimg.com/736x/ae/aa/c8/aeaac82c8f2327dbe9b21d71ab360387.jpg' },
  { name: 'dryfruits&nuts', url: 'https://i.pinimg.com/736x/e0/f1/02/e0f102e4f7080b4612a70646574a6784.jpg' },
  { name: 'pickles', url: 'https://i.pinimg.com/1200x/f2/2c/39/f22c394f7968d4c8c9544424c90b8908.jpg' },
  { name: 'icecream', url: 'https://i.pinimg.com/736x/70/0d/d0/700dd03b943e3544d92d766f1e650c4c.jpg' },
  { name: 'cakes', url: ' https://i.pinimg.com/736x/e4/69/0e/e4690ed2422f22a485fc9e299eba9a46.jpg' },
  { name: 'fastfood', url: 'https://i.pinimg.com/1200x/23/6b/a5/236ba56962a3ba362a47fcbc634f206e.jpg' },
  { name: 'streetfood', url: 'https://i.pinimg.com/236x/2b/b5/dc/2bb5dc75f9e9f3283e6a823aeabc85b2.jpg' },


];
function formatPrice(value) {
  if (value === null || value === undefined || value === '') {
    return 'Price on request';
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  return `₹${numericValue.toLocaleString('en-IN')}`;
}

function formatDate(value) {
  if (!value) {
    return 'Created date unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function safeParseJSON(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getUserStorageKey(authUser) {
  if (!authUser) {
    return `${STORAGE_PREFIX}:guest`;
  }

  return `${STORAGE_PREFIX}:${authUser.id || authUser.email || 'guest'}`;
}

function readUserState(authUser) {
  if (typeof window === 'undefined') {
    return null;
  }

  const storageKey = getUserStorageKey(authUser);
  return safeParseJSON(window.localStorage.getItem(storageKey), null);
}

function writeUserState(authUser, value) {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey = getUserStorageKey(authUser);
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

function createOrderId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getOrderStage(createdAt) {
  const age = Date.now() - createdAt;

  if (age < 15 * 1000) {
    return ORDER_STAGES[0];
  }

  if (age < 30 * 1000) {
    return ORDER_STAGES[1];
  }

  if (age < 45 * 1000) {
    return ORDER_STAGES[2];
  }

  return ORDER_STAGES[3];
}

function formatCurrencyAmount(value) {
  const numericValue = Number(value || 0);
  return `₹${numericValue.toLocaleString('en-IN')}`;
}

function getUnitForCategory(category) {
  if (!category) return 'kg';
  const cat = String(category).toLowerCase();
  if (cat.includes('water') || cat.includes('juice')) return 'L';
  if (cat.includes('pickles') || cat.includes('icecream') || cat.includes('cakes') || cat.includes('fastfood') || cat.includes('streetfood')) return '';
  // treat dairy/milk as quantity-only (no unit displayed)
  return 'kg';
}

function formatQuantity(quantity, category) {
  const numericQuantity = Number(quantity || 0);
  const unit = getUnitForCategory(category);
  const fmt = Number.isInteger(numericQuantity) ? String(numericQuantity) : String(parseFloat(numericQuantity.toFixed(3)));
  const cat = String(category || '').toLowerCase();
  if (cat.includes('dairy') || cat.includes('milk') || cat.includes('snack') || cat.includes('pickles') || cat.includes('icecream') || cat.includes('cakes') || cat.includes('fastfood') || cat.includes('streetfood')) {
    return fmt;
  }
  return unit ? `${fmt} ${unit}` : fmt;
}

function buildLineItems(cartEntries, formatPrice) {
  return cartEntries.map(({ product, quantity }) => ({
    id: product.id,
    name: product.name || 'Unnamed product',
    category: product.category || 'Uncategorized',
    quantity,
    price: Number(product.price || 0),
    formattedPrice: formatPrice(product.price),
  }));
}

function getUserIdentifier(authUser) {
  return authUser?.id || authUser?.email || '';
}

function isUuid(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function getSupabaseUserId() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !isUuid(data?.user?.id)) {
      return '';
    }

    return data.user.id;
  } catch (err) {
    console.warn('Supabase getUser threw:', err?.message || err);
    return '';
  }
}

function buildHistoryOrders(rows, productById) {
  const groupedOrders = new Map();

  rows.forEach((row) => {
    const rawDate = row.date || row.created_at || new Date().toISOString();
    const parsedDate = new Date(rawDate);
    const createdAt = Number.isNaN(parsedDate.getTime()) ? Date.now() : parsedDate.getTime();
    const orderKey = String(rawDate);

    if (!groupedOrders.has(orderKey)) {
      groupedOrders.set(orderKey, {
        id: `history-${orderKey}`,
        trackingCode: `FM-${String(createdAt).slice(-6).toUpperCase()}`,
        createdAt,
        items: [],
        subtotal: 0,
        total: 0,
        paymentMethod: 'Saved purchase',
      });
    }

    const order = groupedOrders.get(orderKey);
    const product = productById.get(String(row.product_id));
    const quantity = Number(row.quantity || 1);
    const price = Number(product?.price || 0);

    order.items.push({
      id: String(row.product_id),
      historyId: row.id || String(row.product_id),
      productId: String(row.product_id),
      name: product?.name || `Product #${row.product_id}`,
      category: product?.category || 'Uncategorized',
      quantity,
      price,
      formattedPrice: formatPrice(price),
    });
    order.subtotal += price * quantity;
    order.total = order.subtotal;
  });

  return Array.from(groupedOrders.values()).sort((left, right) => right.createdAt - left.createdAt);
}

function App() {
  const [activePage, setActivePage] = useState('home');
  const [pendingScrollTarget, setPendingScrollTarget] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortMode, setSortMode] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authPasswordVisible, setAuthPasswordVisible] = useState(false);
  const [authIconsAvailable, setAuthIconsAvailable] = useState(true);
  const [otpOpen, setOtpOpen] = useState(false);
  const showOtp = otpOpen;
  const setShowOtp = setOtpOpen;
  const [pendingOrder, setPendingOrder] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const [orders, setOrders] = useState([]);
  const [drawerView, setDrawerView] = useState('cart');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [snackbar, setSnackbar] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [remoteDataHydratedKey, setRemoteDataHydratedKey] = useState('');
  const cartPreviewTimerRef = useRef(null);
  const snackbarTimerRef = useRef(null);
  const orderTimersRef = useRef([]);
  const hydratedStorageKeyRef = useRef('');
  const lastWishlistSyncSignatureRef = useRef('');

  const pushSnackbar = (message) => {
    setSnackbar(message);

    if (snackbarTimerRef.current) {
      window.clearTimeout(snackbarTimerRef.current);
    }

    snackbarTimerRef.current = window.setTimeout(() => {
      setSnackbar('');
    }, 2500);
  };

  const notifyUser = (title, body) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (notificationEnabled && 'Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(title, { body });
    }
  };

  const navigateToPage = (page, scrollTarget = 'top') => {
    setActivePage(page);
    setPendingScrollTarget(scrollTarget);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !pendingScrollTarget) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      if (pendingScrollTarget === 'products') {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setPendingScrollTarget(null);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activePage, pendingScrollTarget]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError('');
      console.info(`Loading products from ${PRODUCTS_TABLE}`);

      const { data, error: fetchError } = await supabase
        .from(PRODUCTS_TABLE)
        .select('id, name, price, category, imageUrl, created_at')
        .order('created_at', { ascending: false });

      if (!isMounted) {
        return;
      }

      if (fetchError) {
        console.error('Supabase product fetch failed:', fetchError);
        setProducts([]);
        setError(fetchError.message || 'Unable to load products from Supabase.');
        setLoading(false);
        return;
      }

      const nextProducts = Array.isArray(data) ? data : [];

      console.info(`Loaded ${nextProducts.length} product(s) from Supabase.`);
      if (nextProducts.length === 0) {
        console.warn(
          'Supabase returned 0 rows for anon client. If your table has data, check RLS SELECT policy for public.product.',
        );
        setError('No rows returned from Supabase. If your table has data, allow anon SELECT on public.product (RLS policy).');
      }

      setProducts(nextProducts);
      setLoading(false);
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (!isMounted) {
          return;
        }

        if (sessionError) {
          console.warn('Supabase session lookup failed:', sessionError);
        }

        if (data?.session?.user) {
          setAuthUser(data.session.user);
        } else {
          setAuthUser(null);
        }
      } catch (authLookupError) {
        setAuthUser(null);
        console.warn('Auth bootstrap failed:', authLookupError);
      } finally {
        if (isMounted) {
          setAuthReady(true);
        }
      }
    };

    bootstrapAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        setAuthOpen(false);
        pushSnackbar(`Signed in as ${session.user.email || 'user'}`);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const authStorageKey = getUserStorageKey(authUser);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    const stored = readUserState(authUser) || {};
    setCartItems(stored.cartItems || {});
    setWishlistItems(stored.wishlistItems || {});
    setOrders(Array.isArray(stored.orders) ? stored.orders : []);
    setAppliedPromoCode(stored.appliedPromoCode || '');
    setPromoCodeInput(stored.appliedPromoCode || '');
    hydratedStorageKeyRef.current = authStorageKey;
  }, [authReady, authStorageKey, authUser]);

  useEffect(() => {
    if (!authReady || hydratedStorageKeyRef.current !== authStorageKey) {
      return;
    }

    writeUserState(authUser, {
      cartItems,
      wishlistItems,
      orders,
      appliedPromoCode,
    });
  }, [appliedPromoCode, authReady, authStorageKey, authUser, cartItems, orders, wishlistItems]);

  useEffect(() => {
    return () => {
      if (snackbarTimerRef.current) {
        window.clearTimeout(snackbarTimerRef.current);
      }

      if (cartPreviewTimerRef.current) {
        window.clearTimeout(cartPreviewTimerRef.current);
      }

      orderTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  const categories = useMemo(() => {
    const categoryNames = new Set();

    for (const product of products) {
      const categoryName = (product.category || '').trim();

      if (categoryName) {
        categoryNames.add(categoryName);
      }
    }

    return ['All', ...Array.from(categoryNames).sort((left, right) => left.localeCompare(right))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const normalizedCategory = activeCategory.toLowerCase();
    const minPriceValue = minPrice === '' ? null : Number(minPrice);
    const maxPriceValue = maxPrice === '' ? null : Number(maxPrice);

    let nextProducts = products.filter((product) => {
      const matchesCategory =
        activeCategory === 'All' || (product.category || '').trim().toLowerCase() === normalizedCategory;
      const searchableText = `${product.name || ''} ${product.category || ''}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const priceValue = Number(product.price || 0);
      const matchesMinPrice = minPriceValue === null || Number.isNaN(minPriceValue) || priceValue >= minPriceValue;
      const matchesMaxPrice = maxPriceValue === null || Number.isNaN(maxPriceValue) || priceValue <= maxPriceValue;

      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    if (sortMode === 'price-asc') {
      nextProducts = [...nextProducts].sort((left, right) => Number(left.price || 0) - Number(right.price || 0));
    }

    if (sortMode === 'price-desc') {
      nextProducts = [...nextProducts].sort((left, right) => Number(right.price || 0) - Number(left.price || 0));
    }

    if (sortMode === 'name-asc') {
      nextProducts = [...nextProducts].sort((left, right) => (left.name || '').localeCompare(right.name || ''));
    }

    return nextProducts;
  }, [activeCategory, maxPrice, minPrice, products, searchTerm, sortMode]);

  const categoryImages = useMemo(() => {
    const nextImages = new Map();

    for (const product of products) {
      const categoryName = (product.category || '').trim();

      if (categoryName && !nextImages.has(categoryName)) {
        nextImages.set(categoryName, product.imageUrl || FALLBACK_IMAGE);
      }
    }

    return nextImages;
  }, [products]);

  const getCategoryImage = (categoryName) => {
    if (categoryName === 'All') {
      return trendingProducts[0]?.imageUrl || FALLBACK_IMAGE;
    }

    return categoryImages.get(categoryName) || FALLBACK_IMAGE;
  };

  const resultLabel = useMemo(() => {
    if (loading) {
      return 'Loading products...';
    }

    if (error) {
      return error;
    }

    return `${visibleProducts.length} product${visibleProducts.length === 1 ? '' : 's'} shown`;
  }, [error, loading, visibleProducts.length]);

  const sortLabel =
    sortMode === 'price-asc'
      ? 'Price: Low to High'
      : sortMode === 'price-desc'
        ? 'Price: High to Low'
        : sortMode === 'name-asc'
          ? 'Name: A to Z'
          : 'Default Sorting';

  const FORCED_TRENDING_NAMES = ['kulfi', 'cashews', 'brownies', 'chesse pizze', 'cheese pizza'];

  function _normalizeName(n) {
    return String(n || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  const forcedSet = new Set(FORCED_TRENDING_NAMES.map(_normalizeName));
  const forced = products.filter((p) => forcedSet.has(_normalizeName(p.name)));
  const others = products.filter((p) => !forcedSet.has(_normalizeName(p.name)));
  const trendingProducts = [...forced, ...others].slice(0, 4);

  const productById = useMemo(() => {
    return new Map(products.map((product) => [String(product.id), product]));
  }, [products]);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    let isMounted = true;

    const loadRemoteUserData = async () => {
      try {
        const userId = await getSupabaseUserId();

        if (!userId) {
          if (isMounted) {
            setRemoteDataHydratedKey('');
            lastWishlistSyncSignatureRef.current = '';
          }
          return;
        }

        let wishlistResponse = { data: [], error: null };
        let historyResponse = { data: [], error: null };

        try {
          wishlistResponse = await supabase.from(WISHLIST_TABLE).select('product_id').eq('user_id', userId);
        } catch (err) {
          console.warn('Wishlist fetch threw:', err?.message || err);
        }

        try {
          historyResponse = await supabase.from(HISTORY_TABLE).select('id, product_id, quantity, date').eq('user_id', userId).order('date', { ascending: false });
        } catch (err) {
          console.warn('History fetch threw:', err?.message || err);
        }

        if (!isMounted) {
          return;
        }

        if (wishlistResponse?.error) {
          if (wishlistResponse.error?.status === 404) {
            console.info('Wishlist table not found on Supabase; skipping wishlist sync.');
          } else {
            console.warn('Wishlist fetch error:', wishlistResponse.error);
          }
        } else if (Array.isArray(wishlistResponse.data)) {
          const nextWishlistItems = {};

          wishlistResponse.data.forEach((row) => {
            if (row?.product_id !== undefined && row?.product_id !== null) {
              nextWishlistItems[row.product_id] = true;
            }
          });

          if (Object.keys(nextWishlistItems).length > 0) {
            setWishlistItems(nextWishlistItems);
          }

          lastWishlistSyncSignatureRef.current = Object.keys(nextWishlistItems).sort().join('|');
        }

        if (historyResponse?.error) {
          if (historyResponse.error?.status === 404) {
            console.info('History table not found on Supabase; skipping history load.');
          } else {
            console.warn('History fetch error:', historyResponse.error);
          }
        } else if (Array.isArray(historyResponse.data) && historyResponse.data.length > 0) {
          setOrders(buildHistoryOrders(historyResponse.data, productById));
        }
      } catch (remoteLoadError) {
        console.warn('Remote user data load failed:', remoteLoadError);
      } finally {
        if (isMounted) {
          setRemoteDataHydratedKey(authStorageKey);
        }
      }
    };

    loadRemoteUserData();

    return () => {
      isMounted = false;
    };
  }, [authReady, authStorageKey, authUser, productById]);

  const wishlistSyncSignature = useMemo(() => Object.keys(wishlistItems).sort().join('|'), [wishlistItems]);

  useEffect(() => {
    if (!authReady || !authUser || remoteDataHydratedKey !== authStorageKey) {
      return;
    }

    if (wishlistSyncSignature === lastWishlistSyncSignatureRef.current) {
      return;
    }

    const syncWishlist = async () => {
      try {
        const userId = await getSupabaseUserId();

        if (!userId) {
          return;
        }

        const wishlistRows = Object.keys(wishlistItems).map((productId) => ({
          user_id: userId,
          product_id: productId,
        }));

        const deleteResponse = await supabase.from(WISHLIST_TABLE).delete().eq('user_id', userId);

        if (deleteResponse.error) {
          throw deleteResponse.error;
        }

        if (wishlistRows.length > 0) {
          const insertResponse = await supabase.from(WISHLIST_TABLE).insert(wishlistRows);

          if (insertResponse.error) {
            throw insertResponse.error;
          }
        }

        lastWishlistSyncSignatureRef.current = wishlistSyncSignature;
      } catch (wishlistSyncError) {
        console.warn('Wishlist sync failed:', wishlistSyncError);
      }
    };

    syncWishlist();
  }, [authReady, authStorageKey, authUser, remoteDataHydratedKey, wishlistItems, wishlistSyncSignature]);

  const handleCategoryJump = (categoryName) => {
    // Match categories case-insensitively so browse tiles (which use lower-case keys)
    // still select the right category even if products store a different casing.
    const matched = categories.find((c) => String(c).toLowerCase() === String(categoryName).toLowerCase());
    setActiveCategory(matched || 'All');
    navigateToPage('home', 'products');
  };

  const handleAddToCart = (productId) => {
    setCartItems((previous) => ({
      ...previous,
      [productId]: (previous[productId] || 0) + 1,
    }));
    setCartOpen(true);
    setCartPreviewOpen(true);
    setDrawerView('cart');
    const product = products.find((p) => String(p.id) === String(productId));
    const unit = getUnitForCategory(product?.category);
    const cat = String(product?.category || '').toLowerCase();
    const addedText = (cat.includes('dairy') || cat.includes('milk') || cat.includes('snack')) ? 'Added 1 to cart' : `Added 1 ${unit} to cart`;
    pushSnackbar(addedText);
    notifyUser('FlipMark cart updated', 'An item was added to your cart.');
  };

  const handleDecreaseCart = (productId) => {
    setCartItems((previous) => {
      const currentQuantity = previous[productId] || 0;

      if (currentQuantity <= 1) {
        const nextCart = { ...previous };
        delete nextCart[productId];
        return nextCart;
      }

      return {
        ...previous,
        [productId]: currentQuantity - 1,
      };
    });
    pushSnackbar('Cart updated');
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((previous) => {
      const nextCart = { ...previous };
      delete nextCart[productId];
      return nextCart;
    });
    pushSnackbar('Removed from cart');
  };

  const toggleWishlist = (productId) => {
    setWishlistItems((previous) => {
      const nextWishlist = { ...previous };

      if (nextWishlist[productId]) {
        delete nextWishlist[productId];
        pushSnackbar('Removed from wishlist');
      } else {
        nextWishlist[productId] = true;
        pushSnackbar('Saved for later');
      }

      return nextWishlist;
    });
  };

  const handleRemoveHistoryItem = async (historyId) => {
    if (!historyId) return;

    const removeHistoryItemLocally = (previousOrders) => {
      return previousOrders
        .map((order) => {
          const nextItems = (order.items || []).filter((it) => String(it.historyId || '') !== String(historyId));
          return { ...order, items: nextItems };
        })
        .filter((order) => Array.isArray(order.items) && order.items.length > 0);
    };

    const matchingItem = orders
      .flatMap((order) => order.items || [])
      .find((item) => String(item.historyId || item.id || '') === String(historyId));
    const isDatabaseBackedHistory = Boolean(
      matchingItem && String(matchingItem.historyId || '') !== String(matchingItem.id || ''),
    );
    const previousOrders = orders;

    // Remove the item from the screen right away so the UI feels immediate.
    setOrders((currentOrders) => removeHistoryItemLocally(currentOrders));

    // Only hit Supabase for rows that came from the history table.
    const userId = await getSupabaseUserId();

    if (!userId || !isDatabaseBackedHistory) {
      pushSnackbar('Removed item from history');
      return;
    }

    try {
      const { error } = await supabase.from(HISTORY_TABLE).delete().eq('id', historyId).eq('user_id', userId);

      if (error) {
        console.warn('Failed to delete history row:', error);
        setOrders(previousOrders);
        pushSnackbar('Unable to remove history item');
        return;
      }

      pushSnackbar('Removed item from history');
    } catch (err) {
      console.warn('Error removing history item:', err);
      setOrders(previousOrders);
      pushSnackbar('Unable to remove history item');
    }
  };

  const getWishlistCount = (productId) => (wishlistItems[productId] ? 1 : 0);

  const getCartCount = (productId) => cartItems[productId] || 0;

  const cartEntries = useMemo(() => {
    return Object.entries(cartItems)
      .map(([productId, quantity]) => {
        const product = products.find((item) => String(item.id) === String(productId));

        if (!product) {
          return null;
        }

        return {
          product,
          quantity,
        };
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const cartItemCount = cartEntries.reduce((total, entry) => total + entry.quantity, 0);

  const cartTotal = cartEntries.reduce((total, entry) => {
    return total + Number(entry.product.price || 0) * entry.quantity;
  }, 0);

  const cartPreviewEntries = cartEntries.slice(0, 3);

  const wishlistEntries = useMemo(() => {
    return Object.keys(wishlistItems)
      .map((productId) => productById.get(String(productId)))
      .filter(Boolean);
  }, [productById, wishlistItems]);

  const discountInfo = PROMO_CODES[appliedPromoCode.toUpperCase()] || null;
  const discountAmount = useMemo(() => {
    if (!discountInfo) {
      return 0;
    }

    if (discountInfo.type === 'percent') {
      return Math.round((cartTotal * discountInfo.value) / 100);
    }

    return Math.min(cartTotal, discountInfo.value);
  }, [cartTotal, discountInfo]);

  const payableTotal = Math.max(0, cartTotal - discountAmount);

  const accountLabel = authUser?.user_metadata?.full_name || authUser?.email || 'Guest';

  const openAuthModal = () => {
    setAuthMode('login');
    setAuthPasswordVisible(false);
    setAuthOpen(true);
  };

  const handleOrder = (product) => {
    if (!product?.id) {
      pushSnackbar('Unable to start order for this product');
      return;
    }

    setPendingOrder({
      source: 'single',
      items: [
        {
          id: String(product.id),
          name: product.name || 'Unnamed product',
          category: product.category || 'Uncategorized',
          quantity: 1,
          price: Number(product.price || 0),
          formattedPrice: formatPrice(product.price),
        },
      ],
      subtotal: Number(product.price || 0),
      discountAmount: 0,
      total: Number(product.price || 0),
      clearCart: false,
    });
    setShowOtp(true); // FIX: open the OTP modal before completing a single-item order.
  };

  const openOtpModal = () => {
    if (cartEntries.length === 0) {
      pushSnackbar('Your cart is empty');
      return;
    }

    setPendingOrder({
      source: 'cart',
      items: cartEntries.map(({ product, quantity }) => ({
        id: String(product.id),
        name: product.name || 'Unnamed product',
        category: product.category || 'Uncategorized',
        quantity,
        price: Number(product.price || 0),
        formattedPrice: formatPrice(product.price),
      })),
      subtotal: cartTotal,
      discountAmount,
      total: payableTotal,
      clearCart: true,
    });
    setShowOtp(true); // FIX: keep checkout verification on the shared OTP modal.
  };

  const handleOtpVerified = async ({ email }) => {
    if (!pendingOrder) {
      throw new Error('No pending order found. Please start the order again.');
    }

    const createdAt = Date.now();
    const createdAtIso = new Date(createdAt).toISOString();
    const userName = authUser?.user_metadata?.full_name || authUser?.email || email || 'Guest';
    const orderRows = pendingOrder.items.map((item) => ({
      user_id: authUser?.id || null,
      user_name: userName,
      product_id: String(item.id),
      product_name: item.name || 'Unnamed product',
      price: item.price,
      quantity: item.quantity,
      created_at: createdAtIso,
    }));

    const { error: insertError } = await supabase.from(ORDERS_TABLE).insert(orderRows);

    if (insertError) {
      console.error('Failed to save order:', insertError);
      throw new Error(insertError.message || 'Unable to save your order right now. Please try again.');
    }

    const order = {
      id: createOrderId(),
      trackingCode: `FM-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      createdAt,
      items: pendingOrder.items.map((item) => ({
        id: String(item.id),
        historyId: String(item.id),
        productId: String(item.id),
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        formattedPrice: formatPrice(item.price),
      })),
      subtotal: pendingOrder.subtotal,
      discountAmount: pendingOrder.discountAmount,
      total: pendingOrder.total,
      paymentMethod: 'OTP verified',
      status: 'Confirmed',
      customer: userName,
    };

    setOrders((previousOrders) => [order, ...previousOrders]);

    if (pendingOrder.clearCart) {
      setCartItems({});
      setAppliedPromoCode('');
      setPromoCodeInput('');
    }

    setDrawerView('orders');
    setCartOpen(true);
    pushSnackbar('Order Confirmed Successfully');
    notifyUser('Order placed', `${order.trackingCode} has been confirmed.`);

    setPendingOrder(null);
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError('');

    const email = authForm.email.trim();
    const password = authForm.password;
    const name = authForm.name.trim();

    try {
      if (!email || !password) {
        throw new Error('Email and password are required.');
      }

      if (authMode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || email.split('@')[0] } },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data?.session?.user) {
          setAuthUser(data.session.user);
          setAuthOpen(false);
          setAuthForm({ name: '', email: '', password: '' });
          pushSnackbar('Account created and signed in');
        } else {
          setAuthError('Account created. Please verify your email, then sign in.');
          pushSnackbar('Account created. Please sign in after verification.');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        if (!data?.session?.user) {
          throw new Error('Login succeeded but no active session was returned by Supabase.');
        }

        setAuthUser(data.session.user);
        setAuthOpen(false);
        setAuthForm({ name: '', email: '', password: '' });
        pushSnackbar('Signed in successfully');
      }
    } catch (authSubmitError) {
      // Surface Supabase error to the UI so users can see what went wrong.
      console.warn('Auth submit failed:', authSubmitError);
      const rawMessage = authSubmitError?.message || JSON.stringify(authSubmitError);
      const normalizedMessage = String(rawMessage || '').toLowerCase();

      if (normalizedMessage.includes('invalid login credentials')) {
        setAuthError(
          usingFallbackSupabaseConfig
            ? 'Invalid login credentials for the fallback Supabase project. Make sure this email/password belongs to the same project, or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for your own project.'
            : 'Invalid login credentials. Double-check the email/password, or sign up first if this account does not exist yet.',
        );
      } else if (normalizedMessage.includes('email not confirmed')) {
        setAuthError('Your account was created, but the email is not verified yet. Check your inbox and confirm it, then log in again.');
      } else {
        setAuthError(rawMessage);
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.warn('Supabase sign out failed:', signOutError);
    }

    setAuthUser(null);
    setAuthOpen(false);
    setCartItems({});
    setWishlistItems({});
    setOrders([]);
    setAppliedPromoCode('');
    setPromoCodeInput('');
    pushSnackbar('Signed out');
  };

  const handleEnableNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      pushSnackbar('Notifications are not supported in this browser');
      return;
    }

    const permission = await window.Notification.requestPermission();
    setNotificationEnabled(permission === 'granted');
    pushSnackbar(permission === 'granted' ? 'Notifications enabled' : 'Notifications blocked');
  };

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();

    if (!code) {
      setAppliedPromoCode('');
      pushSnackbar('Promo cleared');
      return;
    }

    if (!PROMO_CODES[code]) {
      pushSnackbar('Invalid promo code');
      return;
    }

    setAppliedPromoCode(code);
    pushSnackbar(`Applied ${code}`);
  };

  const cartPreviewLabel = cartItemCount > 0 ? `${cartItemCount} item${cartItemCount === 1 ? '' : 's'}` : 'Cart empty';

  if (activePage === 'history') {
    return (
      <div className="page-shell route-page route-page--history">
        <History
          orders={orders}
          onNavigateHome={() => navigateToPage('home', 'top')}
          onNavigateProducts={() => navigateToPage('home', 'products')}
          onNavigateContact={() => navigateToPage('contact', 'top')}
          onRemoveHistoryItem={handleRemoveHistoryItem}
        />
      </div>
    );
  }

  if (activePage === 'explore') {
    return (
      <div className="page-shell route-page route-page--explore">
        <ExploreCategories
          onNavigateHome={() => navigateToPage('home', 'top')}
          onNavigateProducts={() => navigateToPage('home', 'products')}
          onNavigateHistory={() => navigateToPage('history', 'top')}
          onNavigateContact={() => navigateToPage('contact', 'top')}
          onJumpToProducts={handleCategoryJump}
        />
      </div>
    );
  }

  if (activePage === 'contact') {
    return (
      <div className="page-shell route-page route-page--contact">
        <Contact
          onNavigateHome={() => navigateToPage('home', 'top')}
          onNavigateProducts={() => navigateToPage('home', 'products')}
          onNavigateHistory={() => navigateToPage('history', 'top')}
        />
      </div>
    );
  }

  return (
    <div className="page-shell route-page route-page--home">
      <Home
        categories={categories}
        trendingProducts={trendingProducts}
        products={products}
        onJumpToProducts={handleCategoryJump}
        onExploreCategories={() => navigateToPage('explore', 'top')}
        onNavigateHome={() => navigateToPage('home', 'top')}
        onNavigateProducts={() => navigateToPage('home', 'products')}
        onNavigateContact={() => navigateToPage('contact', 'top')}
        onNavigateHistory={() => navigateToPage('history', 'top')}
        fallbackImage={FALLBACK_IMAGE}
        formatPrice={formatPrice}
        getCategoryImage={getCategoryImage}
        cartItemCount={cartItemCount}
        cartPreviewEntries={cartPreviewEntries}
        cartPreviewLabel={cartPreviewLabel}
        cartPreviewOpen={cartPreviewOpen}
        setCartPreviewOpen={setCartPreviewOpen}
        onOpenAuth={openAuthModal}
        onCartToggle={() => setCartOpen(true)}
        currentUserLabel={accountLabel}
        isAuthenticated={Boolean(authUser)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main>
        <section className="categories-section container" id="products">
          <h2>Trending Products</h2>

          <div className="trending-grid">
            {trendingProducts.length === 0 ? (
              <div className="empty-state">Loading trending products...</div>
            ) : (
              trendingProducts.map((product) => (
                <article className="trending-card" key={product.id}>
                  <div className="product-visual">
                    <img src={product.imageUrl || FALLBACK_IMAGE} alt={product.name || 'Product image'} />
                  </div>
                  <div className="product-meta">
                    <span className="product-category">{product.category || 'Uncategorized'}</span>
                    <h3>{product.name || 'Unnamed product'}</h3>
                    <div className="price-row">
                      <span className="price-label">Price</span>
                      <span className="price-now">{formatPrice(product.price)}</span>
                    </div>
                    <div className="product-card-actions">
                      <button
                        type="button"
                        className="wishlist-toggle-btn"
                        aria-pressed={getWishlistCount(product.id) > 0}
                        onClick={() => toggleWishlist(product.id)}
                      >
                        {getWishlistCount(product.id) > 0 ? 'Saved' : 'Save'}
                      </button>
                      <button
                        type="button"
                        className="primary-cta small-cta"
                        onClick={() => handleOrder(product)}
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="categories-section-spacer">
            <h3>Browse all categories</h3>
          </div>

          <div className="categories-grid">
            {BROWSE_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className="category-card"
                onClick={() => handleCategoryJump(cat.name)}
              >
                <span className="category-image-wrap">
                  <img src={cat.url} alt={cat.name} />
                </span>
                <p className="category-name">{cat.name}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="products-section container">
          <div className="offer-banner" role="status" aria-live="polite">
            {resultLabel}
          </div>

          <div className="products-toolbar">
            <p>
              Showing {visibleProducts.length} result{visibleProducts.length === 1 ? '' : 's'}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            </p>

            <div className="toolbar-actions">
              <button
                type="button"
                className="cart-drawer-toggle"
                onClick={() => {
                  setCartOpen(true);
                  setDrawerView('cart');
                }}
                onMouseEnter={() => setCartPreviewOpen(true)}
                onMouseLeave={() => {
                  if (cartPreviewTimerRef.current) {
                    window.clearout(cartPreviewTimerRef.current);
                  }

                  cartPreviewTimerRef.current = window.setTimeout(() => setCartPreviewOpen(false), 140);
                }}
              >
                Cart ({cartItemCount} item{cartItemCount === 1 ? '' : 's'})
              </button>
              {cartPreviewOpen ? (
                <div className="cart-preview-dropdown" role="dialog" aria-label="Cart preview">
                  <div className="cart-preview-head">
                    <strong>{cartPreviewLabel}</strong>
                    <button type="button" className="link-button" onClick={() => setCartOpen(true)}>
                      View cart
                    </button>
                  </div>
                  {cartPreviewEntries.length === 0 ? (
                    <p className="cart-preview-empty">Your cart is empty. Add something to continue.</p>
                  ) : (
                    <div className="cart-preview-list">
                      {cartPreviewEntries.map(({ product, quantity }) => (
                        <div className="cart-preview-item" key={product.id}>
                          <span>{product.name || 'Unnamed product'}</span>
                          <strong>{formatQuantity(quantity, product.category)}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    className="primary-cta small-cta"
                    disabled={cartPreviewEntries.length === 0}
                    onClick={() => {
                      setDrawerView('checkout');
                      setCartOpen(true);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              ) : null}
              <div className="filter-chips" aria-label="Quick category filter">
                <button type="button" className="filter-chip" onClick={() => setActiveCategory('All')}>
                  All
                </button>
                {categories
                  .filter((categoryName) => categoryName !== 'All')
                  .slice(0, 3)
                  .map((categoryName) => (
                    <button
                      key={categoryName}
                      type="button"
                      className="filter-chip"
                      onClick={() => setActiveCategory(categoryName)}
                    >
                      {categoryName}
                    </button>
                  ))}
              </div>

              <input
                className="price-filter-input"
                type="number"
                min="0"
                placeholder="Min price"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />
              <input
                className="price-filter-input"
                type="number"
                min="0"
                placeholder="Max price"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />

              <button
                type="button"
                className={`icon-button${viewMode === 'grid' ? ' active' : ''}`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                ▦
              </button>
              <button
                type="button"
                className={`icon-button${viewMode === 'list' ? ' active' : ''}`}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                ☰
              </button>
              <button
                type="button"
                className="sort-button"
                onClick={() => {
                  const currentIndex = SORT_OPTIONS.indexOf(sortMode);
                  const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;
                  setSortMode(SORT_OPTIONS[nextIndex]);
                }}
              >
                {sortLabel} ▾
              </button>
            </div>
          </div>

          <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {loading ? (
              <div className="empty-state">Loading products from Supabase...</div>
            ) : error ? (
              <div className="empty-state">{error}</div>
            ) : visibleProducts.length === 0 ? (
              <div className="empty-state">No products match your search or category filter.</div>
            ) : (
              visibleProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <button
                    type="button"
                    className={`wishlist-heart${getWishlistCount(product.id) > 0 ? ' active' : ''}`}
                    aria-label={getWishlistCount(product.id) > 0 ? 'Remove from wishlist' : 'Save for later'}
                    aria-pressed={getWishlistCount(product.id) > 0}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    ♥
                  </button>
                  <div className="product-visual">
                    <img src={product.imageUrl || FALLBACK_IMAGE} alt={product.name || 'Product image'} />
                  </div>
                  <div className="product-meta">
                    <span className="product-category">{product.category || 'Uncategorized'}</span>
                    <h3>{product.name || 'Unnamed product'}</h3>
                    <div className="price-row">
                      <span className="price-label">Price</span>
                      <span className="price-now">{formatPrice(product.price)}</span>
                    </div>
                    <div className="price-row">
                      <span className="price-label">Created</span>
                      <span>{formatDate(product.created_at)}</span>
                    </div>
                    <div className="product-card-actions">
                      <div className="qty-inline">
                        <button type="button" className="remove-cart-btn" onClick={() => handleDecreaseCart(product.id)}>
                          -
                        </button>
                        <strong>{formatQuantity(getCartCount(product.id) || 0, product.category)}</strong>
                        <button type="button" className="add-cart-btn" onClick={() => handleAddToCart(product.id)}>
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="primary-cta small-cta"
                        onClick={() => handleOrder(product)}
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {cartOpen ? (
        <button
          type="button"
          className="cart-backdrop"
          aria-label="Close cart drawer"
          onClick={() => setCartOpen(false)}
        />
      ) : null}

      <aside className={`cart-drawer${cartOpen ? ' open' : ''}`} aria-label="Shopping cart" aria-hidden={!cartOpen}>
          <div className="cart-drawer-header">
          <div>
            <h3>Shopping Center</h3>
            <p>{cartItemCount} item{cartItemCount === 1 ? '' : 's'}</p>
          </div>
          <button type="button" className="cart-drawer-close" onClick={() => setCartOpen(false)}>
            Close
          </button>
        </div>

        <div className="drawer-view-switch">
          <button type="button" className={`drawer-view-btn${drawerView === 'cart' ? ' active' : ''}`} onClick={() => setDrawerView('cart')}>
            Cart
          </button>
          <button type="button" className={`drawer-view-btn${drawerView === 'wishlist' ? ' active' : ''}`} onClick={() => setDrawerView('wishlist')}>
            Wishlist
          </button>
          <button type="button" className={`drawer-view-btn${drawerView === 'orders' ? ' active' : ''}`} onClick={() => setDrawerView('orders')}>
            Orders
          </button>
          <button type="button" className={`drawer-view-btn${drawerView === 'checkout' ? ' active' : ''}`} onClick={() => setDrawerView('checkout')}>
            Checkout
          </button>
        </div>

        {drawerView === 'cart' ? (
          <>
            <div className="cart-items-list">
              {cartEntries.length === 0 ? (
                <div className="empty-state cart-empty-state">
                  <p className="cart-empty">Your cart is empty.</p>
                  <p>Browse products and use the add button to build your cart.</p>
                  <button type="button" className="primary-cta small-cta" onClick={() => setCartOpen(false)}>
                    Continue shopping
                  </button>
                </div>
              ) : (
                cartEntries.map(({ product, quantity }) => (
                  <article className="cart-item-row" key={product.id}>
                    <div>
                      <strong>{product.name || 'Unnamed product'}</strong>
                      <p>
                        {product.category || 'Uncategorized'} · {formatPrice(product.price)} each
                      </p>
                    </div>

                    <div className="cart-item-right">
                      <button type="button" className="remove-cart-btn" onClick={() => handleDecreaseCart(product.id)}>
                        -
                      </button>
                      <strong>{quantity}</strong>
                      <button type="button" className="add-cart-btn" onClick={() => handleAddToCart(product.id)}>
                        +
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="cart-total-box">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <button type="button" className="place-order-btn" onClick={() => setDrawerView('checkout')} disabled={cartEntries.length === 0}>
                Go to checkout
              </button>
            </div>
          </>
        ) : null}

        {drawerView === 'wishlist' ? (
          <>
            <div className="cart-items-list">
              {wishlistEntries.length === 0 ? (
                <div className="empty-state cart-empty-state">
                  <p className="cart-empty">No saved items yet.</p>
                  <p>Use the heart button on a product to save it for later.</p>
                </div>
              ) : (
                wishlistEntries.map((product) => (
                  <article className="cart-item-row" key={product.id}>
                    <div>
                      <strong>{product.name || 'Unnamed product'}</strong>
                      <p>{product.category || 'Uncategorized'} · {formatPrice(product.price)}</p>
                    </div>
                    <div className="cart-item-right">
                      <button type="button" className="remove-cart-btn" onClick={() => toggleWishlist(product.id)}>
                        Remove
                      </button>
                      <button type="button" className="add-cart-btn" onClick={() => handleAddToCart(product.id)}>
                        Add
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        ) : null}

        {drawerView === 'orders' ? (
          <div className="order-history-list">
            {orders.length === 0 ? (
              <div className="empty-state cart-empty-state">
                <p className="cart-empty">No orders yet.</p>
                <p>Complete checkout to track deliveries here.</p>
              </div>
            ) : (
              orders.map((order) => (
                <article className="history-card order-card" key={order.id}>
                  <div className="cart-summary-row">
                    <span>{order.trackingCode}</span>
                    <strong>{getOrderStage(order.createdAt)}</strong>
                  </div>
                  <p>{`${order.items.reduce((total, item) => total + Number(item.quantity || 0), 0)} item${order.items.reduce((total, item) => total + Number(item.quantity || 0), 0) === 1 ? '' : 's'}`} • {order.paymentMethod}</p>
                  <div className="history-items">
                    {order.items.map((item) => (
                      <p key={item.id}>
                        {item.name} • {formatQuantity(item.quantity, item.category)}
                      </p>
                    ))}
                  </div>
                  <p className="delivery-total-line">Total: {formatPrice(order.total)}</p>
                </article>
              ))
            )}
          </div>
        ) : null}

        {drawerView === 'checkout' ? (
          <div className="order-flow">
            <div className="delivery-box">
              <p className="delivery-title">Checkout summary</p>
              <p>Subtotal: {formatPrice(cartTotal)}</p>
              <p>Discount: {formatPrice(discountAmount)}</p>
              <p className="delivery-total-line">Payable: {formatPrice(payableTotal)}</p>
            </div>

            <div className="promo-row">
              <input
                type="text"
                className="promo-input"
                placeholder="Promo code"
                value={promoCodeInput}
                onChange={(event) => setPromoCodeInput(event.target.value)}
              />
              <button type="button" className="filter-chip" onClick={handleApplyPromo}>
                Apply
              </button>
            </div>

            <div className="checkout-actions">
              <button type="button" className="place-order-btn" onClick={openOtpModal} disabled={cartEntries.length === 0}>
                Order
              </button>
            </div>

            <button type="button" className="remove-cart-btn checkout-secondary" onClick={handleEnableNotifications}>
              Enable notifications
            </button>
          </div>
        ) : null}
      </aside>

      {authOpen ? (
        <div className="auth-modal-backdrop" role="presentation" onClick={() => setAuthOpen(false)}>
          <section className="auth-page-shell auth-modal" role="dialog" aria-modal="true" aria-label="Account access" onClick={(event) => event.stopPropagation()}>
            <div className="auth-page-card">
              <h1>{authMode === 'login' ? 'Sign in' : 'Create account'}</h1>
              <p>Use one account so your cart, wishlist, and orders stay together on this device.</p>

              <div className="auth-mode-switch">
                <button type="button" className={`auth-mode-btn${authMode === 'login' ? ' active' : ''}`} onClick={() => setAuthMode('login')}>
                  Login
                </button>
                <button type="button" className={`auth-mode-btn${authMode === 'signup' ? ' active' : ''}`} onClick={() => setAuthMode('signup')}>
                  Signup
                </button>
              </div>

              <form className="auth-form" onSubmit={handleAuthSubmit}>
                {authMode === 'signup' ? (
                  <input
                    type="text"
                    placeholder="Full name"
                    value={authForm.name}
                    onChange={(event) => setAuthForm((previous) => ({ ...previous, name: event.target.value }))}
                  />
                ) : null}
                <input
                  type="email"
                  placeholder="Email address"
                  value={authForm.email}
                  onChange={(event) => setAuthForm((previous) => ({ ...previous, email: event.target.value }))}
                />
                <div className="password-field">
                  <input
                    type={authPasswordVisible ? 'text' : 'password'}
                    placeholder="Password"
                    value={authForm.password}
                    onChange={(event) => setAuthForm((previous) => ({ ...previous, password: event.target.value }))}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    aria-pressed={authPasswordVisible}
                    aria-label={authPasswordVisible ? 'Hide password' : 'Show password'}
                    onClick={() => setAuthPasswordVisible((p) => !p)}
                  >
                    {/* Prefer user-provided icons in public/icons/, fallback to emoji if missing */}
                    <img
                      src={authPasswordVisible ? 'https://img.icons8.com/?size=100&id=85035&format=png&color=000000' : '/icons/eye.svg'}
                      alt={authPasswordVisible ? 'Hide' : 'Show'}
                      style={{ display: authIconsAvailable ? 'inline-block' : 'none', width: 18, height: 18 }}
                      onError={() => setAuthIconsAvailable(false)}
                    />
                    {!authIconsAvailable ? (authPasswordVisible ? '🙈' : '👁️') : null}
                  </button>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={authBusy}>
                  {authBusy ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Signup'}
                </button>
              </form>

              {authError ? <p className="auth-message auth-error">{authError}</p> : null}
              <div className="auth-message auth-account-actions">
                <span>{authUser ? `Signed in as ${accountLabel}` : 'No account active.'}</span>
                {authUser ? (
                  <button type="button" className="link-button auth-link" onClick={handleLogout}>
                    Logout
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <OtpVerificationModal
        open={showOtp}
        onClose={() => {
          setPendingOrder(null);
          setShowOtp(false); // FIX: close the shared OTP modal and clear the pending single-order state.
        }}
        onVerified={handleOtpVerified}
      />

      {snackbar ? <div className="snackbar">{snackbar}</div> : null}
    </div>
  );
}

export default App;
