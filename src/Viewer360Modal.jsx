import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Viewer360Modal — matches Flipmark's organic green/white theme.
 * Dot ring is rendered as an SVG circle track ABOVE the image.
 */
export default function Viewer360Modal({ product, onClose, onOrder, formatPrice, fallbackImage }) {
  const [rotation, setRotation]     = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [imgError, setImgError]     = useState(false);

  const dragStartX   = useRef(0);
  const dragStartRot = useRef(0);
  const spinRef      = useRef(null);

  useEffect(() => {
    setRotation(0);
    setImgError(false);
    setIsSpinning(false);
    if (spinRef.current) clearInterval(spinRef.current);
  }, [product?.id]);

  useEffect(() => () => { if (spinRef.current) clearInterval(spinRef.current); }, []);

  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  const startDrag = (x) => {
    setIsDragging(true);
    setIsSpinning(false);
    if (spinRef.current) clearInterval(spinRef.current);
    dragStartX.current   = x;
    dragStartRot.current = rotation;
  };
  const moveDrag = (x) => {
    if (!isDragging) return;
    setRotation(((dragStartRot.current + (x - dragStartX.current) * 0.6) % 360 + 360) % 360);
  };
  const endDrag = () => setIsDragging(false);

  const toggleSpin = () => {
    if (isSpinning) {
      setIsSpinning(false);
      clearInterval(spinRef.current);
    } else {
      setIsSpinning(true);
      spinRef.current = setInterval(() => {
        setRotation((r) => (r + 1.5) % 360);
      }, 16);
    }
  };

  const tiltY  = Math.sin((rotation * Math.PI) / 180) * 15;
  const scaleX = 0.85 + Math.abs(Math.cos((rotation * Math.PI) / 180)) * 0.15;

  const imageSrc = imgError ? fallbackImage : (product.imageUrl || fallbackImage);

  /* ── SVG dot ring ───────────────────────────────────────
     SVG size = 300 × 300, centre = 150, 150
     Image circle radius ≈ 80 px  → ring at radius 128 px
     Dots spread across full 360°, active dots highlighted
  ─────────────────────────────────────────────────────── */
  const SVG   = 300;
  const CX    = 150;
  const CY    = 150;
  const RING  = 128;          // dot orbit radius
  const DOTS  = 24;

  const dotEls = Array.from({ length: DOTS }, (_, i) => {
    const angleDeg = (i / DOTS) * 360 - 90; // start from top
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = CX + Math.cos(angleRad) * RING;
    const y = CY + Math.sin(angleRad) * RING;
    // active = dots close to current rotation pointer
    const diff   = ((i / DOTS) * 360 - rotation + 720) % 360;
    const active = diff < 45 || diff > 315;
    const r      = active ? 5 : 3.5;
    const fill   = active ? '#2b6b2e' : '#b8d4a8';
    const opacity = active ? 1 : 0.7;
    return <circle key={i} cx={x} cy={y} r={r} fill={fill} opacity={opacity} />;
  });

  return createPortal(
    <div
      className="fm360-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`360° view of ${product.name || 'product'}`}
    >
      <div className="fm360-card" onClick={(e) => e.stopPropagation()}>

        {/* close */}
        <button className="fm360-close" onClick={onClose} aria-label="Close">✕</button>

        {/* badge */}
        <div className="fm360-badge">
          <span className="fm360-spin-icon">↻</span>&nbsp;360° View
        </div>

        {/* ── stage: drag zone ── */}
        <div
          className={`fm360-stage${isDragging ? ' dragging' : ''}`}
          onMouseDown={(e) => startDrag(e.clientX)}
          onMouseMove={(e) => moveDrag(e.clientX)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={(e) => { e.preventDefault(); startDrag(e.touches[0].clientX); }}
          onTouchMove={(e) => { e.preventDefault(); moveDrag(e.touches[0].clientX); }}
          onTouchEnd={endDrag}
          style={{ userSelect: 'none', touchAction: 'none' }}
        >
          {/* product image — LAYER 1 (below SVG ring) */}
          <img
            src={imageSrc}
            alt={product.name || 'Product'}
            className="fm360-img"
            draggable="false"
            onError={() => setImgError(true)}
            style={{
              transform: `perspective(700px) rotateY(${tiltY}deg) scaleX(${scaleX})`,
              filter: `drop-shadow(0 10px 20px rgba(12,36,14,0.2)) brightness(${0.92 + scaleX * 0.08})`,
            }}
          />

          {/* SVG dot ring — LAYER 2 (above image, pointer-events none) */}
          <svg
            className="fm360-svg-ring"
            viewBox={`0 0 ${SVG} ${SVG}`}
            width={SVG}
            height={SVG}
            aria-hidden="true"
          >
            {/* faint track circle */}
            <circle
              cx={CX} cy={CY} r={RING}
              fill="none"
              stroke="#d6e8ca"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            {/* rotating dots */}
            {dotEls}
          </svg>

          {/* drag hint */}
          {!isDragging && !isSpinning && (
            <div className="fm360-hint">⟺ Drag to rotate</div>
          )}
        </div>

        {/* spin toggle */}
        <button
          className={`fm360-spin-btn${isSpinning ? ' spinning' : ''}`}
          onClick={toggleSpin}
        >
          {isSpinning ? '⏸ Stop' : '▶ Auto spin'}
        </button>

        {/* product info */}
        <div className="fm360-info">
          <h2 className="fm360-name">{product.name || 'Product'}</h2>
          {product.category && <span className="fm360-cat">{product.category}</span>}
          <p className="fm360-price">{formatPrice(product.price)}</p>
        </div>

        {/* actions */}
        <div className="fm360-actions">
          <button className="fm360-order" onClick={onOrder} id="fm360-order-btn">
            🛒&nbsp;Order Now
          </button>
          <button className="fm360-cancel" onClick={onClose}>Close</button>
        </div>
      </div>

      <style>{`
        /* ── backdrop ── */
        .fm360-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(8,12,10,0.52);
          backdrop-filter: blur(7px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fm360FadeIn 0.2s ease;
        }
        @keyframes fm360FadeIn { from { opacity:0 } to { opacity:1 } }

        /* ── card — matches .trending-card site style ── */
        .fm360-card {
          position: relative;
          background: #fff;
          border: 1px solid #e7e1d7;
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(12,36,14,0.13), 0 4px 14px rgba(12,36,14,0.06);
          padding: 26px 24px 22px;
          width: 100%;
          max-width: 390px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          animation: fm360Up 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes fm360Up {
          from { transform: translateY(32px) scale(0.93); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }

        /* close */
        .fm360-close {
          position: absolute;
          top: 13px; right: 14px;
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 1px solid #e7e1d7;
          background: #faf7f0;
          color: #7a7a6a;
          font-size: 13px;
          line-height: 1;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .fm360-close:hover { background: #fee2c8; color: #c05a0c; }

        /* badge */
        .fm360-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #184323, #2b6b2e);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          padding: 4px 14px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(24,67,35,0.24);
        }
        .fm360-spin-icon {
          display: inline-block;
          animation: fm360Rot 2.2s linear infinite;
        }
        @keyframes fm360Rot { to { transform: rotate(360deg); } }

        /* ── stage ── */
        .fm360-stage {
          position: relative;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 44%, #f4f9ef 55%, #e4f0dc);
          border: 2px solid #d6e8ca;
          box-shadow: inset 0 0 28px rgba(43,107,46,0.06), 0 6px 18px rgba(12,36,14,0.07);
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .fm360-stage.dragging { cursor: grabbing; }

        /* product image — sits in the centre, below SVG ring */
        .fm360-img {
          position: absolute;
          width: 166px;
          height: 166px;
          object-fit: contain;
          border-radius: 14px;
          pointer-events: none;
          z-index: 1;
        }

        /* SVG ring — stretched over the full stage, above the image */
        .fm360-svg-ring {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* drag hint */
        .fm360-hint {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(24,67,35,0.75);
          color: #e4f0dc;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 12px;
          border-radius: 999px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 3;
          animation: fm360HintFade 1.8s ease 1.5s forwards;
        }
        @keyframes fm360HintFade { to { opacity: 0; } }

        /* spin btn */
        .fm360-spin-btn {
          background: #faf7f0;
          border: 1.5px solid #b8d4a8;
          color: #2b6b2e;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 20px;
          border-radius: 999px;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: background 0.18s, box-shadow 0.18s;
        }
        .fm360-spin-btn:hover {
          background: #e8f3e2;
          box-shadow: 0 4px 10px rgba(43,107,46,0.16);
        }
        .fm360-spin-btn.spinning {
          background: #fff4ec;
          border-color: #f4b06a;
          color: #c05a0c;
        }

        /* info */
        .fm360-info { text-align: center; }

        .fm360-name {
          margin: 0 0 5px;
          font-size: 21px;
          font-weight: 700;
          color: #184323;
          font-family: 'Cormorant Garamond', serif;
          letter-spacing: -0.2px;
        }
        .fm360-cat {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          color: #4c7f2b;
          background: #eef4df;
          padding: 2px 10px;
          border-radius: 999px;
          border: 1px solid #d6e8ca;
          margin-bottom: 4px;
        }
        .fm360-price {
          margin: 5px 0 0;
          font-size: 22px;
          font-weight: 800;
          color: #d97706;
          letter-spacing: -0.4px;
        }

        /* actions */
        .fm360-actions {
          display: flex;
          gap: 10px;
          width: 100%;
        }
        .fm360-order {
          flex: 1;
          background: linear-gradient(180deg, #ff9f1c, #f07f13);
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 13px 0;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(240,127,19,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .fm360-order:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(240,127,19,0.42);
        }
        .fm360-order:active { transform: translateY(0); }

        .fm360-cancel {
          background: #faf7f0;
          border: 1px solid #e7e1d7;
          color: #7a7a6a;
          border-radius: 999px;
          padding: 13px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .fm360-cancel:hover { background: #f0ebe0; color: #1f281d; }

        @media (max-width: 440px) {
          .fm360-card  { padding: 18px 12px 16px; }
          .fm360-stage { width: 250px; height: 250px; }
          .fm360-img   { width: 138px; height: 138px; }
        }
      `}</style>
    </div>,
    document.body
  );
}
