/** Shared auth UI — Futura / Kenzo tokens, red CTA, no cream-gold look */
export const AUTH_STYLES = `
  .auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    background: #FFFFFF;
    color: #212529;
    font-family: var(--font-futura-nav), FuturaBT-Medium, Futura, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
  .auth-visual {
    position: relative;
    min-height: 100vh;
    background: #111;
    overflow: hidden;
  }
  .auth-visual-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%);
  }
  .auth-visual-fallback p {
    font-size: 14px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin: 0;
  }
  .auth-visual-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 100%);
    z-index: 1;
  }
  .auth-visual-copy {
    position: absolute;
    left: 48px;
    right: 48px;
    bottom: 48px;
    z-index: 2;
    color: #fff;
  }
  .auth-visual-title {
    margin: 0;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 500;
    letter-spacing: 0.02em;
    line-height: 1.2;
    color: #fff;
  }
  .auth-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 56px;
    background: #FFFFFF;
  }
  .auth-panel-inner {
    width: 100%;
    max-width: 400px;
  }
  .auth-logo {
    display: block;
    width: 148px;
    height: auto;
    margin: 0 0 36px;
  }
  .auth-eyebrow {
    margin: 0 0 12px;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #868e96;
    font-weight: 400;
  }
  .auth-title {
    margin: 0 0 10px;
    font-size: clamp(26px, 3.2vw, 34px);
    font-weight: 500;
    letter-spacing: 0.02em;
    color: #212529;
    line-height: 1.2;
  }
  .auth-subtitle {
    margin: 0 0 32px;
    font-size: 15px;
    line-height: 1.7;
    color: #495057;
  }
  .auth-error {
    background: #fff5f5;
    border: 1px solid #ffc5c5;
    padding: 12px 16px;
    font-size: 13px;
    color: #A30116;
    margin-bottom: 24px;
  }
  .auth-footer-link {
    text-align: center;
    font-size: 13px;
    color: #495057;
    margin-top: 28px;
  }
  .auth-footer-link a {
    color: #212529;
    font-weight: 500;
    text-decoration: none;
    border-bottom: 1px solid rgba(33,37,41,0.25);
  }
  .auth-footer-link a:hover { border-color: #212529; }
  .auth-home {
    display: inline-block;
    margin-top: 36px;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #868e96;
    text-decoration: none;
  }
  .auth-home:hover { color: #212529; }

  /* hide site chrome on auth (injected as global <style>) */
  footer,
  .henima-chat-btn { display: none !important; }

  @media (max-width: 900px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-visual { min-height: 32vh; }
    .auth-visual-copy { left: 24px; right: 24px; bottom: 24px; }
    .auth-panel { padding: 36px 24px 56px; align-items: flex-start; }
    .auth-logo { width: 128px; margin-bottom: 28px; }
  }
`;
