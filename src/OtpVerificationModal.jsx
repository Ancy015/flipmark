import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const OTP_LENGTH = 6;
const OTP_COUNTDOWN = 30;

function createOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function sanitizeEmail(value) {
  return value.trim();
}

export default function OtpVerificationModal({ open, onClose, onVerified }) {
  const [step, setStep] = useState('phone');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(Array.from({ length: OTP_LENGTH }, () => ''));
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [countdown, setCountdown] = useState(OTP_COUNTDOWN);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputRefs = useRef([]);

  const resetFlow = () => {
    setStep('phone');
    setEmail('');
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setGeneratedOtp('');
    setCountdown(OTP_COUNTDOWN);
    setErrorMessage('');
    setIsVerifying(false);
  };

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    resetFlow();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open || step !== 'otp') {
      return undefined;
    }

    if (typeof window === 'undefined') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCountdown((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [open, step]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && step === 'otp') {
      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 0);
    }
  }, [open, step]);

  if (!open) {
    return null;
  }

  const emailTrimmed = sanitizeEmail(email);
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);
  const otpValue = otpDigits.join('');
  const otpIsComplete = otpValue.length === OTP_LENGTH;

  const sendOtp = async () => {
    if (!emailIsValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const nextOtp = createOtpCode();
    try {
      await emailjs.send(
        'service_4moni4x',
        'template_2vmdbio',
        {
          email: emailTrimmed,
          otp: nextOtp,
        },
        'hGiC5zokhc026_JXQ'
      );

      setGeneratedOtp(nextOtp);
      setStep('otp');
      setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
      setCountdown(OTP_COUNTDOWN);
      setErrorMessage('');

      window.setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 0);
    } catch (error) {
      setErrorMessage('Failed to send OTP email.');
      console.log(error);
    }

  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    setOtpDigits((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    setErrorMessage('');

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);

    if (!pastedValue) {
      return;
    }

    event.preventDefault();

    setOtpDigits(Array.from({ length: OTP_LENGTH }, (_, index) => pastedValue[index] || ''));

    const focusIndex = Math.min(pastedValue.length, OTP_LENGTH - 1);
    window.setTimeout(() => {
      otpInputRefs.current[focusIndex]?.focus();
    }, 0);
  };

  // STEP 3 — VERIFY OTP
  const verifyOtp = async () => {
    if (!otpIsComplete) {
      setErrorMessage('Enter the full 6-digit OTP.');
      return;
    }

    if (generatedOtp && otpValue !== generatedOtp) {
      setErrorMessage('The OTP you entered is incorrect.');
      return;
    }

    setIsVerifying(true);

    try {
      await onVerified?.({ email: emailTrimmed, otp: otpValue });
      resetFlow();
      onClose();
    } catch (verificationError) {
      setErrorMessage(verificationError?.message || 'Unable to verify OTP right now.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0) {
      return;
    }

    const nextOtp = createOtpCode();
    setGeneratedOtp(nextOtp);
    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setCountdown(OTP_COUNTDOWN);
    setErrorMessage('');

    window.setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 0);

    void nextOtp;
  };

  const canVerify = otpIsComplete && !isVerifying;

  return (
    <div className="otp-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="otp-modal"
        role="dialog"
        aria-modal="true"
        aria-label="OTP verification"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="otp-modal-header">
          <div>
            <p className="otp-eyebrow">Secure checkout</p>
            <h2>{step === 'phone' ? 'Verify Your Order' : 'Enter OTP'}</h2>
            <p className="otp-subtitle">
              {step === 'phone'
                ? 'Enter your email to continue order confirmation.'
                : 'We have sent a 6-digit verification code to your email.'}
            </p>
          </div>
          <button type="button" className="otp-close-btn" onClick={onClose} aria-label="Close OTP modal">
            Close
          </button>
        </div>

        {step === 'phone' ? (
          <div className="otp-panel-body">
            <div className="otp-field-group">
              <label className="otp-field-label" htmlFor="otp-email">
                Email address
              </label>
              <input
                id="otp-email"
                type="email"
                autoComplete="email"
                className="otp-phone-input"
                placeholder="Email address"
                value={email}
                onChange={(event) => {
                  setEmail(sanitizeEmail(event.target.value));
                  setErrorMessage('');
                }}
              />
            </div>

            {errorMessage ? <p className="otp-error-message">{errorMessage}</p> : null}

            <button type="button" className="otp-primary-btn" onClick={sendOtp}>
              Send OTP
            </button>
          </div>
        ) : (
          <div className="otp-panel-body">
            <div className="otp-otp-grid" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={`${index}-${generatedOtp || 'otp'}`}
                  ref={(element) => {
                    otpInputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-digit-input"
                  aria-label={`OTP digit ${index + 1}`}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                />
              ))}
            </div>

            {errorMessage ? <p className="otp-error-message">{errorMessage}</p> : null}

            <div className="otp-actions">
              <button type="button" className="otp-primary-btn" onClick={verifyOtp} disabled={!canVerify}>
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="otp-secondary-row">
                <button type="button" className="otp-text-btn" onClick={handleResendOtp} disabled={countdown > 0}>
                  Resend OTP
                </button>
                <span className="otp-countdown">{countdown > 0 ? `Resend available in ${countdown}s` : 'You can resend now'}</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
