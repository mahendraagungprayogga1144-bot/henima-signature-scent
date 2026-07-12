export const AUTH_STYLES = `
  .auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #FAF8F4;
    color: #1C1917;
    font-family: var(--font-jost);
  }
  .auth-visual {
    position: relative;
    min-height: 100vh;
    background: #F0EBE3;
  }
  .auth-visual-fallback {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, #F0EBE3, #E8E0D5);
  }
  .auth-visual-fallback p {
    font-family: var(--font-cormorant);
    font-size: 48px;
    letter-spacing: 8px;
    text-transform: uppercase;
    color: rgba(28,25,23,0.25);
  }
  .auth-visual-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0.1) 50%, transparent 100%);
    z-index: 1;
  }
  .auth-visual-copy {
    position: absolute;
    left: 48px;
    bottom: 48px;
    z-index: 2;
    color: #F5F0E8;
  }
  .auth-visual-title {
    font-family: var(--font-cormorant);
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 300;
    font-style: italic;
    line-height: 1.05;
    margin: 0;
  }
  .auth-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 6vw;
    background: #FAF8F4;
  }
  .auth-panel-inner {
    width: 100%;
    max-width: 400px;
  }
  .auth-eyebrow {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #B5935A;
    margin-bottom: 16px;
    font-weight: 500;
  }
  .auth-title {
    font-family: var(--font-cormorant);
    font-size: clamp(32px, 4vw, 44px);
    font-weight: 400;
    color: #1C1917;
    margin: 0 0 10px;
    line-height: 1.1;
  }
  .auth-subtitle {
    font-size: 14px;
    color: #6B6560;
    line-height: 1.7;
    margin: 0 0 36px;
    font-weight: 300;
  }
  .auth-error {
    background: #fff5f5;
    border: 1px solid #ffc5c5;
    padding: 12px 16px;
    font-size: 13px;
    color: #cc0000;
    margin-bottom: 24px;
  }
  .auth-footer-link {
    text-align: center;
    font-size: 13px;
    color: #6B6560;
    margin-top: 28px;
  }
  .auth-footer-link a {
    color: #1C1917;
    font-weight: 600;
    text-decoration: none;
  }
  @media (max-width: 900px) {
    .auth-page { grid-template-columns: 1fr; }
    .auth-visual { min-height: 36vh; }
    .auth-visual-copy { left: 24px; bottom: 24px; }
    .auth-panel { padding: 40px 24px 64px; }
  }
`;
