import React, { useState, useEffect } from 'react';
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  ArrowRight,
  Play,
  Leaf,
  ShieldCheck,
  Truck,
  X,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Menu,
  Sparkles,
  ArrowUp,
  CheckCircle2,
  Layers,
  Send,
  Eye,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, type Variants } from 'framer-motion';
import TucanScrollCanvas from './components/TucanScrollCanvas';

// Image assets
import HERO_IMAGE from './assets/images/hero_fashion_model_1793897266319.jpg';
import CATEGORY_HOODIE from './assets/images/category_hoodie_1793897267335.jpg';
import CATEGORY_OUTERWEAR from './assets/images/category_outerwear_1793897268118.jpg';
import CATEGORY_CREWNECK from './assets/images/category_crewneck_1793897269056.jpg';
import CATEGORY_BOTTOMS from './assets/images/category_bottoms_1793897269676.jpg';
import CATEGORY_FOOTWEAR from './assets/images/category_footwear_1793897269427.jpg';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  color: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'hoodie-01',
    name: 'Heavyweight Relaxed Hoodie',
    category: 'Hoodies',
    price: 110,
    image: CATEGORY_HOODIE,
    description: 'Custom 480gsm French terry cotton with structured drop shoulders and double-layered hood.',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Forest Green'
  },
  {
    id: 'outerwear-01',
    name: 'Oversized City Trench Coat',
    category: 'Outerwear',
    price: 240,
    image: CATEGORY_OUTERWEAR,
    description: 'Water-repellent structured twill with storm flap, horn buttons, and fluid silhouette.',
    sizes: ['XS', 'S', 'M', 'L'],
    color: 'Sand Beige'
  },
  {
    id: 'crewneck-01',
    name: 'Studio Minimalist Crewneck',
    category: 'Sweatshirts',
    price: 95,
    image: CATEGORY_CREWNECK,
    description: 'Ultra-soft loopback organic fleece, ribbed trims, and clean tonal chest embroidery.',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Oatmeal Heather'
  },
  {
    id: 'bottoms-01',
    name: 'Tailored Wide-Leg Sweatpant',
    category: 'Bottoms',
    price: 105,
    image: CATEGORY_BOTTOMS,
    description: 'Architectural straight leg cut with deep pockets, encased waistband, and raw edge hem.',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Sage Green'
  },
  {
    id: 'footwear-01',
    name: 'Monochrome Leather Sneaker',
    category: 'Footwear',
    price: 165,
    image: CATEGORY_FOOTWEAR,
    description: 'Buttery Italian nappa leather, hand-stitched cupsole, and cushioned memory foam insole.',
    sizes: ['40', '41', '42', '43', '44'],
    color: 'Pristine White'
  }
];

// Animation Variants for Scroll & In-View Reveals
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: custom * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const categoryContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const categoryCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickShopOpen, setIsQuickShopOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [wishlistCount, setWishlistCount] = useState(3);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const checkScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Cart state initialized with 1 item as shown in the reference image badge
  const [cartItems, setCartItems] = useState([
    {
      product: PRODUCTS[0],
      size: 'L',
      quantity: 1
    }
  ]);

  const navLinks = ['Home', 'Shop', 'New Arrivals', 'Collections', 'About', 'Contact'];

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const openQuickShop = (product: ProductItem) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[1] || product.sizes[0]);
    setIsQuickShopOpen(true);
  };

  const addToCart = (product: ProductItem, size: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    triggerToast(`Added ${product.name} (${size}) to bag`);
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId && item.size === size) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: ProductItem; size: string; quantity: number }[]
    );
  };

  const totalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  const toggleWishlist = () => {
    if (isWishlisted) {
      setIsWishlisted(false);
      setWishlistCount(prev => Math.max(0, prev - 1));
      triggerToast('Removed from wishlist');
    } else {
      setIsWishlisted(true);
      setWishlistCount(prev => prev + 1);
      triggerToast('Saved to wishlist');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      triggerToast('Welcome to the Atelier Circle · 15% VIP code dispatched');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-['DM_Sans',sans-serif] selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* Background Toucan Scroll-Driven Animation */}
      <TucanScrollCanvas />

      {/* Top Window Reading Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-white origin-left z-50 pointer-events-none"
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-6 right-6 z-50 bg-white text-black px-5 py-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-2xl border border-white/20"
          >
            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 w-full px-6 md:px-12 pt-7 pb-4"
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Left Brand / Spacer on desktop or Mobile Menu trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <span className="lg:hidden text-sm font-bold tracking-widest text-white uppercase">
              STUDIO
            </span>
          </div>

          {/* Centered Pill Navigation Bar */}
          <nav className="hidden lg:flex items-center bg-white rounded-full px-2 py-1.5 shadow-2xl border border-white/10">
            {navLinks.map((link) => {
              const isActive = activeNav === link;
              return (
                <button
                  key={link}
                  onClick={() => {
                    setActiveNav(link);
                    if (link === 'Shop' || link === 'Collections' || link === 'New Arrivals') {
                      openQuickShop(PRODUCTS[0]);
                    }
                  }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-md'
                      : 'text-black hover:text-black/70'
                  }`}
                >
                  {link === 'Home' && <Home className="w-4 h-4 stroke-[2.2]" />}
                  <span>{link}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Shopping Bag Button with count '1' */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 transition-all"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-white stroke-[1.8]" />
              {totalItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center shadow-md"
                >
                  {totalItemsCount}
                </motion.span>
              )}
            </motion.button>

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleWishlist}
              className={`w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center transition-all ${
                isWishlisted ? 'text-white bg-white/20' : 'text-white hover:bg-white/15'
              }`}
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-transform ${
                  isWishlisted ? 'fill-white text-white scale-110' : 'stroke-[1.8]'
                }`}
              />
            </motion.button>

            {/* User Profile Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => triggerToast('Signed in as Guest · Member #882')}
              className="w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 transition-all"
              aria-label="User Profile"
            >
              <User className="w-5 h-5 text-white stroke-[1.8]" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    setActiveNav(link);
                    setMobileMenuOpen(false);
                    if (link !== 'Home') openQuickShop(PRODUCTS[0]);
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeNav === link ? 'bg-white text-black' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {link}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* HERO BANNER SECTION WITH SCROLL / IN-VIEW REVEAL */}
      <section className="relative z-10 w-full px-6 md:px-12 pt-6 pb-12 lg:pt-8 lg:pb-16 overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex items-center min-h-[540px]">
          {/* Main Column: Typography, CTAs, Trust Badges */}
          <div className="w-full max-w-3xl flex flex-col justify-center z-10">
            {/* NEW SEASON COLLECTION Kicker with Line animation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="text-white text-xs md:text-sm font-semibold tracking-[0.22em] uppercase whitespace-nowrap">
                NEW SEASON COLLECTION
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
                className="h-[1px] bg-white/30 w-32 md:w-56"
              />
            </motion.div>

            {/* Main Headline with Staggered reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.04] mb-6"
            >
              Elevate Your <br />
              <span>Everyday </span>
              <span className="italic font-light tracking-wide text-white relative inline-block">
                Style.
                {/* Underline Swoop accent in pure white with path draw animation */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-white overflow-visible opacity-90"
                  viewBox="0 0 160 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M3 11C45 4 110 3 157 12"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-white text-base sm:text-lg font-normal leading-relaxed mb-10 max-w-xl"
            >
              Modern fits. Premium fabrics. <br />
              Made to move with you.
            </motion.p>

            {/* CTAs Row */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-6 sm:gap-8 mb-12"
            >
              {/* Primary Action Button: SHOP NOW */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openQuickShop(PRODUCTS[0])}
                className="bg-white text-black font-bold text-sm tracking-wider uppercase px-9 py-4 rounded-full flex items-center gap-3.5 hover:bg-neutral-200 transition-all shadow-[0_0_35px_rgba(255,255,255,0.2)] hover:shadow-[0_0_45px_rgba(255,255,255,0.35)] group"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 stroke-[2.4] group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              {/* Secondary Action Button: Watch Lookbook */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsLookbookOpen(true)}
                className="flex items-center gap-4 group text-left cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
                  <Play className="w-4 h-4 fill-black text-black translate-x-0.5" />
                </div>
                <div>
                  <div className="text-white text-sm font-bold tracking-tight group-hover:text-white/80 transition-colors">
                    Watch Lookbook
                  </div>
                  <div className="text-white/60 text-xs font-normal">
                    Play Video
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* Trust Badges Staggered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-2xl"
            >
              {/* Badge 1: Premium Quality */}
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center shrink-0 bg-white/5">
                  <Leaf className="w-4 h-4 text-white stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">Premium</div>
                  <div className="text-white/70 text-xs leading-tight">Quality</div>
                </div>
              </motion.div>

              {/* Badge 2: Easy Returns */}
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center shrink-0 bg-white/5">
                  <ShieldCheck className="w-4 h-4 text-white stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">Easy Returns</div>
                  <div className="text-white/70 text-xs leading-tight">7 Days</div>
                </div>
              </motion.div>

              {/* Badge 3: Free Shipping */}
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center shrink-0 bg-white/5">
                  <Truck className="w-4 h-4 text-white stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">Free Shipping</div>
                  <div className="text-white/70 text-xs leading-tight">On Orders $50+</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: START SELLING IN MINUTES */}
      <section className="relative z-20 w-full px-6 md:px-12 py-20 lg:py-28 overflow-hidden bg-transparent">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.12]"
          >
            Start selling in minutes
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/80 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-10"
          >
            Create your first checkout, embed it or share the link, and get paid. Free up to $3K in monthly sales.
          </motion.p>

          {/* Action Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-6"
          >
            {/* Primary Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openQuickShop(PRODUCTS[0])}
              className="bg-white text-black font-bold text-sm tracking-wide px-8 py-4 rounded-full hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.35)]"
            >
              Start selling for free
            </motion.button>

            {/* Secondary Link */}
            <motion.button
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => triggerToast('Demo scheduled · A specialist will contact you')}
              className="flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors group cursor-pointer"
            >
              <span>Book a demo</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Footnote */}
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-white/50 text-xs sm:text-sm font-normal"
          >
            Free plan available. No credit card needed.
          </motion.span>
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section className="relative z-20 w-full px-6 md:px-12 pt-[600px] pb-20">
        <div className="max-w-[1440px] mx-auto">
          {/* Header Row: Title, Animated Divider Line, View All */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between gap-6 mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white whitespace-nowrap">
              Shop By Category
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0 }}
              className="h-[1px] bg-white/20 flex-1"
            />
            <button
              onClick={() => openQuickShop(PRODUCTS[0])}
              className="text-xs sm:text-sm font-medium text-white hover:text-white/80 transition-colors whitespace-nowrap underline underline-offset-4 decoration-white/40 hover:decoration-white"
            >
              View All Categories
            </button>
          </motion.div>

          {/* 5 Category Cards Grid with framer-motion scroll reveal */}
          <motion.div
            variants={categoryContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 items-end"
          >
            {/* Card 1: Hoodies */}
            <motion.div
              variants={categoryCardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
              onClick={() => openQuickShop(PRODUCTS[0])}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 relative aspect-[3/4] flex flex-col justify-end p-4 sm:p-5 shadow-lg"
            >
              <img
                src={CATEGORY_HOODIE}
                alt="Hoodies"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">Hoodies</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 group-hover:text-white">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Outerwear */}
            <motion.div
              variants={categoryCardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
              onClick={() => openQuickShop(PRODUCTS[1])}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 relative aspect-[3/4] flex flex-col justify-end p-4 sm:p-5 shadow-lg"
            >
              <img
                src={CATEGORY_OUTERWEAR}
                alt="Outerwear"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">Outerwear</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 group-hover:text-white">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Card 3: Sweatshirts (Center Featured Card - Elevated with Outline Ring) */}
            <motion.div
              variants={categoryCardVariants}
              whileHover={{ y: -10, transition: { duration: 0.25, ease: 'easeOut' } }}
              onClick={() => openQuickShop(PRODUCTS[2])}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border-2 border-white/40 ring-2 ring-white/10 relative aspect-[3/4.2] flex flex-col justify-end p-4 sm:p-5 shadow-2xl z-10 sm:-mb-2"
            >
              <img
                src={CATEGORY_CREWNECK}
                alt="Sweatshirts"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider mb-2 shadow-md"
                >
                  <Sparkles className="w-3 h-3 text-black" />
                  <span>Featured</span>
                </motion.div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">Sweatshirts</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 group-hover:text-white">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Card 4: Bottoms */}
            <motion.div
              variants={categoryCardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
              onClick={() => openQuickShop(PRODUCTS[3])}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 relative aspect-[3/4] flex flex-col justify-end p-4 sm:p-5 shadow-lg"
            >
              <img
                src={CATEGORY_BOTTOMS}
                alt="Bottoms"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">Bottoms</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 group-hover:text-white">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Card 5: Footwear */}
            <motion.div
              variants={categoryCardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
              onClick={() => openQuickShop(PRODUCTS[4])}
              className="group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 relative aspect-[3/4] flex flex-col justify-end p-4 sm:p-5 shadow-lg col-span-2 sm:col-span-1"
            >
              <img
                src={CATEGORY_FOOTWEAR}
                alt="Footwear"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">Footwear</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 group-hover:text-white">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: EDITORIAL SPOTLIGHT ("CRAFTED FOR MOTION") */}
      <section className="relative z-20 w-full px-6 md:px-12 py-20 border-t border-white/10 bg-black/30 backdrop-blur-[2px]">
        <div className="max-w-[1440px] mx-auto">
          {/* Section Sub-header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              01. The Motion Edit
            </span>
            <div className="h-[1px] bg-white/15 flex-1 max-w-xs"></div>
          </motion.div>

          {/* Split Content: Editorial Statement & Interactive Look Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Big Editorial Statement */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-8"
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Clothing designed to live in, <br />
                <span className="italic font-light text-white/90">not just pose in.</span>
              </h3>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl">
                Every seam, drop shoulder, and cuff is calibrated to maintain silhouette rigidity without restricting organic human gesture. Built with 480 GSM pure combed cotton that softens with every cycle.
              </p>

              {/* 3 Metric Pillars with staggered entry */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/15">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="space-y-1"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">480</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/60">GSM Cotton Density</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="space-y-1"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/60">Organic Combed</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="space-y-1"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">0%</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/60">Synthetic Fillers</div>
                </motion.div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsLookbookOpen(true)}
                  className="inline-flex items-center gap-3 text-sm font-bold text-white underline underline-offset-8 decoration-white/40 hover:decoration-white transition-all group"
                >
                  <span>Experience the Full Movement Film</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Right Column: Interactive Look Showcase with Clickable Hotspots */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative aspect-[4/3.8] rounded-3xl overflow-hidden border border-white/20 bg-neutral-950 shadow-2xl"
            >
              <img
                src={HERO_IMAGE}
                alt="Interactive Lookbook Breakdown"
                className="w-full h-full object-cover filter brightness-90 hover:brightness-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

              {/* Hotspot 1: Overshirt Collar */}
              <div className="absolute top-[32%] left-[48%]">
                <button
                  onClick={() => setActiveHotspot(activeHotspot === 1 ? null : 1)}
                  className="relative group p-1"
                  aria-label="Inspect structured collar"
                >
                  <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-lg animate-ping absolute inset-1 opacity-75"></span>
                  <span className="relative w-6 h-6 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shadow-xl">
                    +
                  </span>
                </button>
                {activeHotspot === 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute -top-20 left-8 bg-white text-black p-3 rounded-xl shadow-2xl text-xs font-medium w-48 z-30"
                  >
                    <div className="font-bold">Interlined Notch Collar</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">Retains crisp geometry through countless washes.</div>
                  </motion.div>
                )}
              </div>

              {/* Hotspot 2: Wristwatch / Cuff */}
              <div className="absolute bottom-[28%] left-[52%]">
                <button
                  onClick={() => setActiveHotspot(activeHotspot === 2 ? null : 2)}
                  className="relative group p-1"
                  aria-label="Inspect tailored cuff"
                >
                  <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-lg animate-ping absolute inset-1 opacity-75"></span>
                  <span className="relative w-6 h-6 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shadow-xl">
                    +
                  </span>
                </button>
                {activeHotspot === 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute -top-20 left-8 bg-white text-black p-3 rounded-xl shadow-2xl text-xs font-medium w-48 z-30"
                  >
                    <div className="font-bold">Reinforced Buttoned Cuff</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">Heavy gauge stitching engineered for smooth roll-up.</div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Badge inside showcase */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <span className="text-xs font-bold uppercase tracking-widest text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  Tap Hotspots To Inspect
                </span>
                <span className="text-xs font-medium text-white/70">
                  Autumn / Winter Capsule
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: QUALITY CRAFTSMANSHIP PILLARS */}
      <section className="relative z-20 w-full px-6 md:px-12 py-20 border-t border-white/10 bg-black/30 backdrop-blur-[2px]">
        <div className="max-w-[1440px] mx-auto">
          {/* Header Row */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 block mb-2">
                02. Fabric & Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Engineered Without Compromise
              </h2>
            </div>
            <p className="text-white/70 text-sm max-w-md">
              We eliminated every unnecessary embellishment, focusing all creative energy into pure fabric weight and structural integrity.
            </p>
          </motion.div>

          {/* 3 Pillars Cards Grid with Staggered Scroll Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl border border-white/15 bg-white/5 flex flex-col justify-between shadow-xl group hover:border-white/40 transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Zero-Shrink Milling
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  Pre-shrunk at the yarn stage through controlled steam stabilization to preserve exact millimeter dimensions wash after wash.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>Tolerance: &lt; 0.5%</span>
                <span className="text-white font-bold">Grade A</span>
              </div>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl border border-white/15 bg-white/5 flex flex-col justify-between shadow-xl group hover:border-white/40 transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Ergonomic Shoulder Drop
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  Engineered 3.5cm drop shoulder angle that eliminates bunching in the armpit while creating a clean, structured streetwear posture.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>Pattern: Architectural Cut</span>
                <span className="text-white font-bold">Unisex Fit</span>
              </div>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl border border-white/15 bg-white/5 flex flex-col justify-between shadow-xl group hover:border-white/40 transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Mineral Pigment Dyeing
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  Dyed with natural earth pigments in closed-loop water filtration facilities to yield nuanced, light-absorbing matte blacks and deep forest greens.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>Eco Standard: Oeko-Tex 100</span>
                <span className="text-white font-bold">Zero Bleed</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: VIP ACCESS / NEWSLETTER WITH SCROLL REVEAL */}
      <section className="relative z-20 w-full px-6 md:px-12 py-36 lg:py-40 min-h-[500px] flex items-center border-t border-white/10 bg-transparent">
        <div className="max-w-[1440px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8 relative"
          >

            <div className="relative z-10 max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 block mb-2">
                Priority Dispatch
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
                Join the Atelier Circle
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Receive private access to small-batch drops 48 hours prior to public release, alongside 15% credit on your initial order.
              </p>
            </div>

            <div className="relative z-10 w-full lg:w-auto">
              {newsletterSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 bg-white text-black px-6 py-4 rounded-full font-bold text-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>VIP Access Confirmed · Check Your Inbox</span>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full sm:w-80 px-6 py-4 rounded-full bg-white/10 border border-white/25 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white focus:bg-white/15 transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-lg"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 w-full px-6 md:px-12 py-12 border-t border-white/15 bg-black/60 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold tracking-widest text-white uppercase">
              ELEVATE STUDIO
            </span>
            <span className="text-xs text-white/50">· Autumn / Winter 2026 Collection</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/70">
            <button onClick={() => triggerToast('Terms of Service: Standard Studio Policy')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => triggerToast('Privacy Policy: End-to-end Encrypted')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => triggerToast('Shipping FAQ: Free Global 3-Day Express')} className="hover:text-white transition-colors">Shipping</button>
            <button onClick={() => triggerToast('Sustainability Report: 100% Organic Supply')} className="hover:text-white transition-colors">Sustainability</button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-white hover:text-white/80 transition-colors uppercase tracking-wider group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </footer>

      {/* FLOATING BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white text-black shadow-2xl flex items-center justify-center border border-white/30"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.2]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WATCH LOOKBOOK MODAL */}
      <AnimatePresence>
        {isLookbookOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLookbookOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-4xl bg-black border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                  <h3 className="text-base font-bold text-white">New Season Lookbook · Autumn/Winter</h3>
                </div>
                <button
                  onClick={() => setIsLookbookOpen(false)}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lookbook Content Visual */}
              <div className="relative aspect-video bg-neutral-900 overflow-hidden flex items-center justify-center group">
                <img
                  src={HERO_IMAGE}
                  alt="Lookbook Reel"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                    <Play className="w-7 h-7 fill-black text-black translate-x-0.5" />
                  </div>
                  <h4 className="mt-6 text-2xl md:text-3xl font-bold text-white">
                    Made to Move With You
                  </h4>
                  <p className="mt-2 text-sm text-white/80 max-w-md">
                    Explore modern silhouettes and premium heavyweight cotton tailoring designed for everyday elevation.
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      onClick={() => {
                        setIsLookbookOpen(false);
                        openQuickShop(PRODUCTS[0]);
                      }}
                      className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                    >
                      Shop Featured Fits
                    </button>
                  </div>
                </div>
              </div>

              {/* Lookbook Gallery Strip */}
              <div className="p-6 bg-black border-t border-white/15 grid grid-cols-4 gap-4">
                {PRODUCTS.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsLookbookOpen(false);
                      openQuickShop(item);
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl border border-white/10 hover:border-white/30 cursor-pointer transition-all bg-white/5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-lg"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-white/60">${item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK SHOP / PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {isQuickShopOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickShopOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-2xl bg-black border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/15">
                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                  {selectedProduct.category}
                </span>
                <button
                  onClick={() => setIsQuickShopOpen(false)}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 bg-neutral-900">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between h-full py-2">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedProduct.name}
                    </h3>
                    <div className="text-xl font-bold text-white mb-4">
                      ${selectedProduct.price}
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-6">
                      {selectedProduct.description}
                    </p>

                    {/* Color Info */}
                    <div className="mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/60 block mb-1">
                        Colorway
                      </span>
                      <span className="text-sm font-medium text-white">
                        {selectedProduct.color}
                      </span>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                          Select Size
                        </span>
                        <span className="text-[11px] text-white/60 underline cursor-pointer">
                          Size Guide
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-11 h-11 rounded-xl text-xs font-bold transition-all border ${
                              selectedSize === size
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-white border-white/25 hover:border-white/50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/15">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, selectedSize);
                        setIsQuickShopOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="flex-1 bg-white text-black py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Bag · ${selectedProduct.price}</span>
                    </button>
                    <button
                      onClick={toggleWishlist}
                      className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? 'fill-white text-white' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING BAG DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="w-screen max-w-md bg-black border-l border-white/20 shadow-2xl flex flex-col justify-between"
              >
                {/* Cart Header */}
                <div className="px-6 py-6 border-b border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-bold text-white">Your Bag ({totalItemsCount})</h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center">
                      <ShoppingBag className="w-12 h-12 text-white/30 mb-3" />
                      <p className="text-sm font-semibold text-white">Your shopping bag is empty</p>
                      <p className="text-xs text-white/60 mt-1">Discover new arrivals from the collection</p>
                    </div>
                  ) : (
                    cartItems.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${item.size}-${idx}`}
                        className="flex gap-4 p-4 rounded-2xl border border-white/15 bg-white/5"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-24 object-cover rounded-xl border border-white/10"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-white line-clamp-1">
                                {item.product.name}
                              </h4>
                              <span className="text-sm font-bold text-white ml-2">
                                ${item.product.price * item.quantity}
                              </span>
                            </div>
                            <div className="text-xs text-white/60 mt-1">
                              Size: {item.size} · {item.product.color}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 border border-white/20 rounded-full px-2 py-0.5 bg-black">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, -1)}
                                className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-white w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, 1)}
                                className="w-6 h-6 flex items-center justify-center text-white/70 hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, -item.quantity)}
                              className="text-xs text-white/50 hover:text-white transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Footer */}
                {cartItems.length > 0 && (
                  <div className="p-6 border-t border-white/15 space-y-4 bg-black">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Subtotal</span>
                      <span className="text-base font-bold text-white">${cartSubtotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Shipping</span>
                      <span className="text-sm font-bold text-white">Free</span>
                    </div>
                    <div className="h-[1px] bg-white/15"></div>
                    <div className="flex items-center justify-between text-base font-bold">
                      <span className="text-white">Estimated Total</span>
                      <span className="text-xl text-white">${cartSubtotal}</span>
                    </div>

                    <button
                      onClick={() => {
                        triggerToast('Order confirmed! Tracking details sent to your email.');
                        setIsCartOpen(false);
                      }}
                      className="w-full bg-white text-black py-4 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Checkout</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
