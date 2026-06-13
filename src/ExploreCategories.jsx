import React from 'react';

const CATEGORY_SECTIONS = [
  {
    id: 'fruit',
    badge: 'Fresh & Seasonal',
    title: 'Fruits',
    description:
      'Hand-picked fresh fruits sourced directly from farms. From juicy mangoes to crisp apples — nature\'s sweetest gifts delivered to your door every day.',
    features: ['100% Farm Fresh', 'Seasonal Variety', 'Rich in Vitamins', 'No Preservatives'],
    price: '₹25',
    ctaLabel: 'Shop Fruits',
    url: 'https://i.pinimg.com/736x/a3/7b/25/a37b25af9a2af9456f4d0b47853b931b.jpg',
    items: ['Mango', 'Apple', 'Banana', 'Grapes', 'Papaya', 'Watermelon'],
  },
  {
    id: 'vegetable',
    badge: 'Farm to Table',
    title: 'Vegetables',
    description:
      'Crisp, fresh vegetables straight from the garden. We carry everything from leafy greens to root vegetables — all washed, sorted and ready to cook.',
    features: ['Daily Fresh Stock', 'Organic Options', 'Zero Chemicals', 'Local Farmers'],
    price: '₹15',
    ctaLabel: 'Shop Vegetables',
    url: ' https://i.pinimg.com/736x/b3/37/2d/b3372d4bd8515bfeb7cfe8fc203fed74.jpg',
    items: ['Tomato', 'Spinach', 'Carrot', 'Onion', 'Capsicum', 'Brinjal'],
  },
  {
    id: 'juice',
    badge: 'Cold Pressed & Fresh',
    title: 'Juices',
    description:
      'Refreshing cold-pressed juices and natural blends made without added sugar. Perfect for a healthy start or a midday pick-me-up.',
    features: ['No Added Sugar', 'Cold Pressed', '100% Natural', 'Vitamin Boost'],
    price: '₹40',
    ctaLabel: 'Shop Juices',
    url: ' https://i.pinimg.com/1200x/2f/9e/e5/2f9ee5c9c9d47aafffc1db69c86fa8e5.jpg',
    items: ['Mango', 'Orange', 'Pomegranate', 'Sugarcane', 'Lemon Mint', 'Mixed Fruit'],
  },
  {
    id: 'pulse',
    badge: 'Protein Powerhouse',
    title: 'Pulses',
    description:
      'Premium quality dals and pulses that form the backbone of Indian cooking. Rich in protein and essential nutrients for a wholesome meal every day.',
    features: ['High Protein', 'Stone Free', 'Premium Grade', 'Long Shelf Life'],
    price: '₹60',
    ctaLabel: 'Shop Pulses',
    url: 'https://i.pinimg.com/1200x/88/d4/39/88d439dfcaa41793784fe26ef09eaefe.jpg',
    items: ['Toor Dal', 'Moong Dal', 'Chana Dal', 'Masoor Dal', 'Urad Dal', 'Rajma'],
  },
  {
    id: 'cereal',
    badge: 'Whole Grain Goodness',
    title: 'Cereals',
    description:
      'Wholesome cereals and grains for everyday nutrition. From basmati rice to whole wheat — the staples every Indian kitchen needs stocked up.',
    features: ['Whole Grain', 'Fortified Options', 'High Fibre', 'No Additives'],
    price: '₹30',
    ctaLabel: 'Shop Cereals',
    url: 'https://i.pinimg.com/1200x/02/6e/2c/026e2c0b975b3314eb1513814762f85a.jpg',
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
    url: 'https://i1-e.pinimg.com/736x/2c/e7/11/2ce711058a94302de93350453d712ce4.jpg',
    items: ['Full Cream Milk', 'Paneer', 'Curd', 'Butter', 'Ghee', 'Cheese'],
  },
  {
    id: 'snack',
    badge: 'Munch Time Favourites',
    title: 'Snacks',
    description:
      'Crunchy, savory and sweet snacks for every craving. From classic namkeen to modern baked bites — your snack shelf sorted for the whole week.',
    features: ['Baked Options', 'No Trans Fat', 'Guilt-Free Picks', '100+ Varieties'],
    price: '₹15',
    ctaLabel: 'Shop Snacks',
    url: 'https://i.pinimg.com/1200x/b4/26/35/b42635a68a577c2f57386e21ac67a573.jpg',
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
    url: 'https://i.pinimg.com/736x/ae/aa/c8/aeaac82c8f2327dbe9b21d71ab360387.jpg',
    items: ['Turmeric', 'Red Chilli', 'Coriander', 'Cumin', 'Garam Masala', 'Pepper'],
  },
  {
    id: 'dryfruits&nuts',
    badge: 'Premium Healthy Snacking',
    title: 'Dry Fruits & Nuts',
    description:
      'Handpicked premium dry fruits and nuts sourced from the finest farms in Kashmir, California and the Middle East. Nutrient-dense and delicious.',
    features: ['Premium Grade', 'Handpicked', 'Rich in Omega-3', 'No Artificial Color'],
    price: '₹80',
    ctaLabel: 'Shop Dry Fruits',
    url: 'https://i.pinimg.com/736x/84/0f/e2/840fe266401fe8cafcc879a8b4793ca3.jpg',
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
    url: 'https://i.pinimg.com/1200x/f2/2c/39/f22c394f7968d4c8c9544424c90b8908.jpg',
    items: ['Mango Pickle', 'Lemon Pickle', 'Mixed Pickle', 'Garlic Pickle', 'Chilli Pickle', 'Amla Pickle'],
  },
  {
    id: 'icecream',
    badge: 'Cool & Creamy',
    title: 'icecream',
    description:
      'Indulgent ice creams and frozen desserts in dozens of flavors. From classic vanilla to exotic kulfi — cool down in the most delicious way possible.',
    features: ['Real Dairy Cream', '50+ Flavours', 'Sugar-Free Options', 'No Artificial Color'],
    price: '₹30',
    ctaLabel: 'Shop Ice Cream',
    url: 'https://i.pinimg.com/1200x/92/84/51/928451721d9d5e8bc9729793a095532f.jpg',
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
    url: 'https://i.pinimg.com/1200x/bd/16/95/bd169527a3bcb9cdae6a229bee5eb2e3.jpg',
    items: ['Black Forest', 'Choco Truffle', 'Pineapple', 'Red Velvet', 'Croissant', 'Muffins'],
  },
  {
    id: 'fastfood',
    badge: 'Quick & Delicious',
    title: 'Fast Food',
    description:
      'Your favorite fast food items — burgers, fries, nuggets and more — made fresh and delivered hot. Quick bites that never compromise on taste.',
    features: ['Made Fresh', 'Hot Delivery', 'Family Packs', 'Combo Deals'],
    price: '₹30',
    ctaLabel: 'Shop Fast Food',
    url: 'https://i.pinimg.com/736x/c8/3c/11/c83c1130b43e4518992e9cb318fc8671.jpg',
    items: ['Burger', 'French Fries', 'Nuggets', 'Pizza', 'Garlic Bread', 'Wraps'],
  },
  {
    id: 'streetfood',
    badge: 'Authentic Street Flavours',
    title: 'Street Food',
    description:
      'The bold, spicy and tangy flavors of Indian street food brought straight to you. Authentic recipes, real ingredients — your favorite chaat, now at home.',
    features: ['Authentic Recipes', 'Fresh Every Day', 'Chef Curated', 'Hygiene Certified'],
    price: '₹25',
    ctaLabel: 'Shop Street Food',
    url: 'https://i.pinimg.com/736x/a6/b5/c0/a6b5c0f8a90b6290ed12c5ba4635508b.jpg',
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

                <button type="button" className="primary-cta explore-shop-btn" onClick={() => onJumpToProducts?.(section.id)}>
                  {section.ctaLabel} →
                </button>
              </div>

              <div className="explore-category-visual" aria-label={`${section.title} preview`}>
                <img src={section.url} alt={section.title} className="explore-category-cover-img" />
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