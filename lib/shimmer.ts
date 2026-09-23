// Placeholder animado para next/image: se muestra de fondo mientras la foto carga y Next lo quita al terminar.
// SVG inline (< 1 KB), sin JavaScript extra. Con "reducir movimiento" queda quieto.

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
<defs><linearGradient id="g"><stop offset="0" stop-color="#E2F1EE"/><stop offset=".5" stop-color="#F5FBFA"/><stop offset="1" stop-color="#E2F1EE"/></linearGradient></defs>
<style>.s{animation:m 1.3s ease-in-out infinite}@keyframes m{from{transform:translateX(-100px)}to{transform:translateX(100px)}}@media (prefers-reduced-motion:reduce){.s{animation:none}}</style>
<rect width="100" height="100" fill="#E2F1EE"/><rect class="s" width="100" height="100" fill="url(#g)"/></svg>`;

export const SHIMMER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\n/g, ""))}` as const;
