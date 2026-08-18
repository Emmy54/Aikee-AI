import logoPlusText from '../assets/branding/logo-plus-text.svg';

/**
 * Aikee AI wordmark + icon lockup.
 *
 * Renders the brand SVG (src/assets/branding/logo-plus-text.svg) as an <img>, so
 * headers show real branding instead of the old plain-text "Aikee AI". `height`
 * drives the size; width auto-scales to preserve the ~5.8:1 aspect ratio. Any
 * `className`/`style` is merged so each header can position it as before.
 *
 * When the logo is the only content of a link that already has an aria-label,
 * pass alt="" to avoid the name being announced twice.
 */
export default function BrandLogo({ height = 28, className = '', style = {}, alt = 'Aikee AI' }) {
  return (
    <img
      src={logoPlusText}
      alt={alt}
      className={className}
      style={{ height, width: 'auto', display: 'block', ...style }}
    />
  );
}
