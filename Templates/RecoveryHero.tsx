import {
  IconMailFilled,
  IconLockFilled,
  IconShieldHalfFilled,
} from "@tabler/icons-react";
export default function RecoveryHero() {
  return (
    <div className="recovery-hero">
      <div className="recovery-art" aria-hidden="true">
        <i className="bubble" />
        <i className="bubble two" />
        <i className="bubble three" />
        <div className="recovery-art-icons">
          <span>
            <IconMailFilled size={24} />
          </span>
          <span className="lock">
            <IconLockFilled size={40} />
          </span>
          <span>
            <IconShieldHalfFilled size={24} />
          </span>
        </div>
        <div className="recovery-dots">
          <i />
          <i />
          <i />
        </div>
      </div>
      <h2>Reset Your Password</h2>
      <p>
        Don't worry, it happens to the best of us. We'll help you get back into
        your account in no time.
      </p>
      <div className="recovery-badges">
        <span>
          <IconMailFilled size={16} />
          Email Verification
        </span>
        <span>
          <IconShieldHalfFilled size={16} />
          Secure Reset
        </span>
        <span>
          <IconLockFilled size={16} />
          Encrypted
        </span>
      </div>
    </div>
  );
}
