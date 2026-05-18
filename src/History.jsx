import React from 'react';

function formatPrice(value) {
  const numericValue = Number(value || 0);
  return `₹${numericValue.toLocaleString('en-IN')}`;
}

function getUnitForCategory(category) {
  if (!category) return 'kg';
  const cat = String(category).toLowerCase();
  if (cat.includes('water') || cat.includes('juice')) return 'L';
  return 'kg';
}


function formatQuantity(quantity, category) {
  const numericQuantity = Number(quantity || 0);
  const unit = getUnitForCategory(category);
  const cat = String(category || '').toLowerCase();
  const fmt = Number.isInteger(numericQuantity) ? String(numericQuantity) : String(parseFloat(numericQuantity.toFixed(3)));
  if (cat.includes('dairy') || cat.includes('milk')) {
    return fmt;
  }
  return `${fmt} ${unit}`;
}

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function History({ orders = [], onNavigateHome, onRemoveHistoryItem }) {
  return (
    <>
      <header className="hero" id="history">
        <div className="hero-overlay" />

        <div className="container nav-row">
          <div className="brand">
            <div className="brand-text">
              <span>FLIP</span>
              <strong>MARK</strong>
            </div>
          </div>

          <nav className="main-nav" aria-label="Primary navigation">
            <a href="#home" onClick={() => onNavigateHome?.()}>Home</a>
            <a href="#products">Products</a>
            <button type="button" className="nav-link-button active" aria-current="page">History</button>
            <button type="button" className="nav-link-button" onClick={() => onNavigateHome?.()}>Contact</button>
          </nav>

          <div className="header-actions">
            <button type="button" className="auth-link-button">Account</button>
          </div>
        </div>

        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">Previous purchases</p>
            <h1>Your order history</h1>
            <p>Review items you've ordered on Flipmark. Tap any order to view its items.</p>
          </div>
        </div>
      </header>

      <main>
        <section className="products-section container">
          <div className="offer-banner" role="status" aria-live="polite">
            {orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
          </div>

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
                    <span>{order.trackingCode || 'Order'}</span>
                    <strong>{order.status || ''}</strong>
                  </div>
                  <p>{`${order.items.reduce((total, item) => total + Number(item.quantity || 0), 0)} item${order.items.reduce((total, item) => total + Number(item.quantity || 0), 0) === 1 ? '' : 's'}`} • {order.paymentMethod || 'Saved purchase'}</p>
                  <div className="history-items">
                    {order.items.map((item) => (
                      <div className="history-item-row" key={item.historyId || item.id}>
                        <span className="history-item-desc">
                          {item.name} • {formatQuantity(item.quantity, item.category)} • {formatPrice(item.price)}
                        </span>
                        <button
                          type="button"
                          className="place-order-btn history-remove-btn"
                          onClick={() => onRemoveHistoryItem?.(item.historyId || item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="delivery-total-line">Total: {formatPrice(order.total)}</p>
                  <p className="history-meta">{formatDate(order.createdAt)}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default History;
