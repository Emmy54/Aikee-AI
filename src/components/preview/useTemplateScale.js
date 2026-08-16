// useTemplateScale.js
// Scales a fixed-width CV template down to fit its container.
// Templates are authored at a fixed pixel width (720 for most, 700 for the rest),
// so the preview panes shrink them with `zoom` where supported and `transform: scale`
// as a fallback.

import { useEffect, useRef, useState } from 'react';

const BASE_WIDTH = 720;

/**
 * @param {object}  options
 * @param {boolean} options.enabled   False while the pane is display:none. A hidden element
 *                                    reports clientWidth 0 and ResizeObserver never fires for
 *                                    it, so the scale must be recomputed when it comes back.
 * @param {Array}   options.deps      Extra values that should trigger a re-measure
 *                                    (view mode, selected template, …).
 * @param {number}  options.baseWidth Authored template width. Defaults to 720.
 */
export default function useTemplateScale({ enabled = true, deps = [], baseWidth = BASE_WIDTH } = {}) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const [supportsZoom, setSupportsZoom] = useState(false);

  useEffect(() => {
    setSupportsZoom(typeof CSS !== 'undefined' && !!CSS.supports && CSS.supports('zoom', '1'));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;

    const updateScale = () => {
      const containerWidth = element.clientWidth;
      // Hidden or not yet laid out — keep the previous scale rather than writing a garbage one.
      if (!containerWidth) return;
      const available = Math.max(containerWidth - 16, 260);
      const nextScale = Math.min(1, available / baseWidth);
      setScale(Number(nextScale.toFixed(3)));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, baseWidth, ...deps]);

  // Ready-to-spread style for the scaling wrapper.
  const scaleStyle = supportsZoom
    ? { zoom: scale }
    : { transform: `scale(${scale})`, transformOrigin: 'top center' };

  return { ref, scale, supportsZoom, scaleStyle };
}
