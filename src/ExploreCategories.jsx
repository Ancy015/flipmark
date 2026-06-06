import React from 'react';

const CATEGORY_SECTIONS = [
  {
    id: 'fruits',
    badge: 'Fresh & Seasonal',
    title: 'Fruits',
    description:
      'Hand-picked fresh fruits sourced directly from farms. From juicy mangoes to crisp apples — nature\'s sweetest gifts delivered to your door every day.',
    features: ['100% Farm Fresh', 'Seasonal Variety', 'Rich in Vitamins', 'No Preservatives'],
    price: '₹25',
    ctaLabel: 'Shop Fruits',
    url: 'https://i.pinimg.com/736x/3c/0d/e3/3c0de391cc7481d46823ce2c7783e46f.jpg',
    items: ['Mango', 'Apple', 'Banana', 'Grapes', 'Papaya', 'Watermelon'],
  },
  {
    id: 'vegetables',
    badge: 'Farm to Table',
    title: 'Vegetables',
    description:
      'Crisp, fresh vegetables straight from the garden. We carry everything from leafy greens to root vegetables — all washed, sorted and ready to cook.',
    features: ['Daily Fresh Stock', 'Organic Options', 'Zero Chemicals', 'Local Farmers'],
    price: '₹15',
    ctaLabel: 'Shop Vegetables',
    icon: '🥦',
    items: ['Tomato', 'Spinach', 'Carrot', 'Onion', 'Capsicum', 'Brinjal'],
  },
  {
    id: 'juices',
    badge: 'Cold Pressed & Fresh',
    title: 'Juices',
    description:
      'Refreshing cold-pressed juices and natural blends made without added sugar. Perfect for a healthy start or a midday pick-me-up.',
    features: ['No Added Sugar', 'Cold Pressed', '100% Natural', 'Vitamin Boost'],
    price: '₹40',
    ctaLabel: 'Shop Juices',
    icon: '🥤',
    items: ['Mango', 'Orange', 'Pomegranate', 'Sugarcane', 'Lemon Mint', 'Mixed Fruit'],
  },
  {
    id: 'pulses',
    badge: 'Protein Powerhouse',
    title: 'Pulses',
    description:
      'Premium quality dals and pulses that form the backbone of Indian cooking. Rich in protein and essential nutrients for a wholesome meal every day.',
    features: ['High Protein', 'Stone Free', 'Premium Grade', 'Long Shelf Life'],
    price: '₹60',
    ctaLabel: 'Shop Pulses',
    icon: '🫘',
    items: ['Toor Dal', 'Moong Dal', 'Chana Dal', 'Masoor Dal', 'Urad Dal', 'Rajma'],
  },
  {
    id: 'cereals',
    badge: 'Whole Grain Goodness',
    title: 'Cereals',
    description:
      'Wholesome cereals and grains for everyday nutrition. From basmati rice to whole wheat — the staples every Indian kitchen needs stocked up.',
    features: ['Whole Grain', 'Fortified Options', 'High Fibre', 'No Additives'],
    price: '₹30',
    ctaLabel: 'Shop Cereals',
    icon: '🌾',
    items: ['Basmati Rice', 'Wheat Flour', 'Oats', 'Poha', 'Semolina', 'Cornflakes'],
  },
  {
    id: 'dairy',
    badge: 'Pure & Pasteurised',
    title: 'Dairy',
    description:
      'Fresh dairy products sourced from trusted dairies every morning. Pure milk, creamy paneer, thick curd — the freshest dairy delivered to your doorstep.',
    features: ['Daily Fresh', 'Pasteurised', 'A2 Milk Options', 'Farm Sourced'],
    price: '₹20',
    ctaLabel: 'Shop Dairy',
    icon: '🥛',
    items: ['Full Cream Milk', 'Paneer', 'Curd', 'Butter', 'Ghee', 'Cheese'],
  },
  {
    id: 'snacks',
    badge: 'Munch Time Favourites',
    title: 'Snacks',
    description:
      'Crunchy, savory and sweet snacks for every craving. From classic namkeen to modern baked bites — your snack shelf sorted for the whole week.',
    features: ['Baked Options', 'No Trans Fat', 'Guilt-Free Picks', '100+ Varieties'],
    price: '₹15',
    ctaLabel: 'Shop Snacks',
    icon: '🥨',
    items: ['Potato Chips', 'Bhujia', 'Popcorn', 'Biscuits', 'Namkeen', 'Crackers'],
  },
  {
    id: 'masala',
    badge: 'Soul of Indian Cooking',
    title: 'Masala & Spices',
    description:
      'Authentic whole spices and ground masalas that bring the true flavor of Indian cuisine to your kitchen. Sourced from spice farms across India.',
    features: ['Stone Ground', 'No Fillers', 'Farm Sourced', 'Aroma Sealed'],
    price: '₹20',
    ctaLabel: 'Shop Masala',
    icon: '🌶️',
    items: ['Turmeric', 'Red Chilli', 'Coriander', 'Cumin', 'Garam Masala', 'Pepper'],
  },
  {
    id: 'dry-fruits',
    badge: 'Premium Healthy Snacking',
    title: 'Dry Fruits & Nuts',
    description:
      'Handpicked premium dry fruits and nuts sourced from the finest farms in Kashmir, California and the Middle East. Nutrient-dense and delicious.',
    features: ['Premium Grade', 'Handpicked', 'Rich in Omega-3', 'No Artificial Color'],
    price: '₹80',
    ctaLabel: 'Shop Dry Fruits',
    icon: '🥜',
    items: ['Cashews', 'Almonds', 'Pistachios', 'Walnuts', 'Raisins', 'Dates'],
  },
  {
    id: 'pickles',
    badge: 'Traditional Homestyle',
    title: 'Pickles',
    description:
      'Authentic homestyle pickles made with traditional recipes, pure mustard oil and fresh ingredients. The perfect sidekick for every Indian meal.',
    features: ['No Preservatives', 'Traditional Recipe', 'Pure Mustard Oil', 'Homestyle'],
    price: '₹45',
    ctaLabel: 'Shop Pickles',
    icon: '🫙',
    items: ['Mango Pickle', 'Lemon Pickle', 'Mixed Pickle', 'Garlic Pickle', 'Chilli Pickle', 'Amla Pickle'],
  },
  {
    id: 'ice-cream',
    badge: 'Cool & Creamy',
    title: 'Ice Cream',
    description:
      'Indulgent ice creams and frozen desserts in dozens of flavors. From classic vanilla to exotic kulfi — cool down in the most delicious way possible.',
    features: ['Real Dairy Cream', '50+ Flavours', 'Sugar-Free Options', 'No Artificial Color'],
    price: '₹30',
    ctaLabel: 'Shop Ice Cream',
    icon: '🍦',
    items: ['Vanilla', 'Chocolate', 'Strawberry', 'Kulfi', 'Mango Sorbet', 'Butterscotch'],
  },
  {
    id: 'cakes',
    badge: 'Freshly Baked Daily',
    title: 'Cakes & Bakery',
    description:
      'Decadent cakes, pastries and freshly baked goods made with love every morning. Whether it\'s a birthday or just a Tuesday — celebrate with something sweet.',
    features: ['Baked Fresh Daily', 'Eggless Options', 'Custom Orders', 'Premium Ingredients'],
    price: '₹60',
    ctaLabel: 'Shop Cakes',
    icon: '🎂',
    items: ['Black Forest', 'Choco Truffle', 'Pineapple', 'Red Velvet', 'Croissant', 'Muffins'],
  },
  {
    id: 'fast-food',
    badge: 'Quick & Delicious',
    title: 'Fast Food',
    description:
      'Your favorite fast food items — burgers, fries, nuggets and more — made fresh and delivered hot. Quick bites that never compromise on taste.',
    features: ['Made Fresh', 'Hot Delivery', 'Family Packs', 'Combo Deals'],
    price: '₹30',
    ctaLabel: 'Shop Fast Food',
    icon: '🍔',
    items: ['Burger', 'French Fries', 'Nuggets', 'Pizza', 'Garlic Bread', 'Wraps'],
  },
  {
    id: 'street-food',
    badge: 'Authentic Street Flavours',
    title: 'Street Food',
    description:
      'The bold, spicy and tangy flavors of Indian street food brought straight to you. Authentic recipes, real ingredients — your favorite chaat, now at home.',
    features: ['Authentic Recipes', 'Fresh Every Day', 'Chef Curated', 'Hygiene Certified'],
    price: '₹25',
    ctaLabel: 'Shop Street Food',
    icon: '🌯',
    items: ['Pani Puri', 'Kathi Roll', 'Vada Pav', 'Samosa', 'Pakoras', 'Chaat'],
  },
];

const CATEGORY_SPOTLIGHTS = ['🍎', '🥦', '🥤', '🫘', '🥛', '🌶️', '🎂', '🍦'];

function scrollToSection(sectionId) {
  if (typeof document === 'undefined') {
    return;
  }

  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ExploreCategories({ onNavigateHome, onNavigateProducts, onNavigateHistory, onNavigateContact, onJumpToProducts }) {
  return (
    <>
      <header className="hero explore-hero" id="explore-categories">
        <div className="hero-overlay" />

        <div className="container nav-row explore-nav-row">
          <div className="brand">
            <div className="brand-text">
              <span>FLIP</span>
              <strong>MARK</strong>
            </div>
          </div>

          <nav className="main-nav" aria-label="Primary navigation">
            <button type="button" className="nav-link-button" onClick={onNavigateHome}>
              Home
            </button>
            <button type="button" className="nav-link-button" onClick={onNavigateProducts}>
              Products
            </button>
            <button type="button" className="nav-link-button active" aria-current="page">
              Explore Categories
            </button>
            <button type="button" className="nav-link-button" onClick={onNavigateHistory}>
              History
            </button>
            <button type="button" className="nav-link-button" onClick={onNavigateContact}>
              Contact
            </button>
          </nav>
        </div>

        <div className="container explore-hero-grid">
          <div className="explore-hero-copy">
            <p className="eyebrow">Explore Everything</p>
            <h1>Every Category, One Place.</h1>
            <p>
              From farm-fresh fruits to indulgent ice creams — 14 curated categories, hundreds of products, delivered
              fresh daily.
            </p>

            <div className="explore-stats" aria-label="Category highlights">
              <div>
                <strong>14</strong>
                <span>Categories</span>
              </div>
              <div>
                <strong>100+</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>24h</strong>
                <span>Fresh Dispatch</span>
              </div>
              <div>
                <strong>4.9★</strong>
                <span>Rating</span>
              </div>
            </div>

            {/* Spotlights removed as requested */}
          </div>
        </div>
      </header>

      <main className="explore-page">
        {/* Category jump strip removed as requested */}

        <div className="container explore-sections">
          {CATEGORY_SECTIONS.map((section, index) => (
            <article
              className={`explore-category-section${index % 2 === 1 ? ' explore-category-section--reverse' : ''}`}
              id={section.id}
              key={section.id}
            >
              <div className="explore-category-copy">
                <p className="eyebrow">{section.badge}</p>
                <h2>{section.title}</h2>
                <p>{section.description}</p>

                <ul className="explore-feature-list" aria-label={`${section.title} features`}>
                  {section.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                <div className="explore-price-row">
                  <span>Starting from</span>
                  <strong>{section.price}</strong>
                </div>

                <button type="button" className="primary-cta explore-shop-btn" onClick={() => onJumpToProducts?.(section.title)}>
                  {section.ctaLabel} →
                </button>
              </div>

              <div className="explore-category-visual" aria-label={`${section.title} preview`}>
                <div className="explore-category-icon">{section.icon}</div>
                <div className="explore-category-items">
                  {section.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="explore-final-cta container">
          <h2>Ready to Shop?</h2>
          <p>All 14 categories, fresh stock every day. Start filling your cart now.</p>
          <button type="button" className="primary-cta" onClick={() => onJumpToProducts?.('All')}>
            Browse All Products →
          </button>
        </section>
      </main>
    </>
  );
}

export default ExploreCategories;