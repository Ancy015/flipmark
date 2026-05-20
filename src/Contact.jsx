import { useState } from 'react';
import emailjs from "@emailjs/browser";
const sendEmail = (e) => {
  e.preventDefault();

  emailjs
    .sendForm(
      " 4moni4x",
      "vnea3gb",
      e.target,
      "FjyRvRu910frF64F9"
    )
    .then(() => {
      setStatusMessage(
        "Thanks for reaching out. Our team will get back to you shortly."
      );
    })
    .catch((error) => {
      console.log(error);

      setStatusMessage(
        "Failed to send message. Please try again."
      );
    });
};
const CONTACT_CHANNELS = [
  {
    label: 'Head Office',
    value: 'Flipmark Warehouse, Green Avenue',
    note: 'Kanniya Kumari, Tamilnadu 400001',
  },
  {
    label: 'Email',
    value: 'support@flipmark.com',
    note: 'sales@flipmark.com',
  },
  {
    label: 'Call',
    value: '+91 22-4567-8901',
    note: 'Mon-Sat, 1:00 AM to 12:00 PM',
  },
];

function Contact({ onNavigateHome }) {
  const [statusMessage, setStatusMessage] = useState('');

  

  return (
    <>
      <header className="hero" id="contact">
        <div className="hero-overlay" />

        <div className="container nav-row">
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
            <a href="#products">Products</a>
            <a href="#history">History</a>
            <button type="button" className="nav-link-button active" aria-current="page">
              Contact
            </button>
          </nav>

          <div className="header-actions">
            <button type="button" className="auth-link-button" onClick={onNavigateHome}>
              Back to shop
            </button>
          </div>
        </div>

        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">Contact Flipmark</p>
            <h1>Fresh produce delivered with premium service and reliable support.</h1>
            <p>Reach out for bulk orders, delivery questions, product availability, or wholesale partnerships.</p>
          </div>
        </div>
      </header>

      <main>
        <section className="products-section container">
          <div className="offer-banner" role="status" aria-live="polite">
            Simple contact details and a clean message form
          </div>

          <div className="products-toolbar">
            <p>Everything is kept in two clear boxes with space between them.</p>
          </div>

          <form className="trending-card contact-box contact-message-box" onSubmit={sendEmail}>
            <div className="contact-form-grid contact-form-grid-two">
              <label>
                Name
                <input type="text" name="name" placeholder="Name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="Email" required />
              </label>
              <label className="contact-message-field contact-message-span">
                Subject
                <input type="text" name="subject" placeholder="Subject" required />
              </label>
              <label className="contact-message-field contact-message-span">
                Message
                <textarea name="message" rows="6" placeholder="Message" required />
              </label>
            </div>

            <div className="product-card-actions">
              <button type="submit" className="primary-cta small-cta">
                Send
              </button>
            </div>

            {statusMessage ? <p className="contact-status-message">{statusMessage}</p> : null}
          </form>

          <div className="categories-section-spacer">
            <h3>Office info</h3>
          </div>

          <div className="trust-grid contact-office-grid">
            <div className="trust-card">
              <h3>Head Office</h3>
              <p>Flipmark Warehouse, Green Avenue</p>
              <p>Kanniya Kumari, Tamilnadu 400001</p>
            </div>
            <div className="trust-card">
              <h3>Email</h3>
              <p>support@flipmark.com</p>
              <p>sales@flipmark.com</p>
            </div>
            <div className="trust-card">
              <h3>Call</h3>
              <p>+91 22-4567-8901</p>
              <p>Mon-Sat, 1:00 AM to 12:00 PM</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contact;
