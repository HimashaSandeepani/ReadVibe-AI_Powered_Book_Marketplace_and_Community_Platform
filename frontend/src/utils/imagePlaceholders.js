// SVG placeholder generators for missing book cover artwork.
const createBookCoverPlaceholder = (label = "Book Cover", width = 200, height = 300) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#DBEAFE" />
          <stop offset="100%" stop-color="#E0E7FF" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="18" fill="url(#bg)" />
      <rect x="22" y="22" width="156" height="216" rx="14" fill="#FFFFFF" fill-opacity="0.65" />
      <path d="M58 70h84M58 98h84M58 126h60" stroke="#1E3A5F" stroke-width="10" stroke-linecap="round" opacity="0.25" />
      <circle cx="100" cy="194" r="26" fill="#1E3A5F" fill-opacity="0.14" />
      <path d="M88 194l8 8 16-18" stroke="#1E3A5F" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.5" />
      <text x="100" y="272" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#1E3A5F">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default createBookCoverPlaceholder;