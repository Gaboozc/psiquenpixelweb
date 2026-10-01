// Pure saga label helpers — safe to import from client components.

// "INTRO + 3 PARTES", "2 PARTES", "1 PARTE", or "INTRODUCCIÓN" (intro only).
export function sagaCountLabel({ intro, totalParts }) {
  if (!totalParts) return intro ? 'INTRODUCCIÓN' : '0 PARTES';
  return `${intro ? 'INTRO + ' : ''}${totalParts} ${totalParts === 1 ? 'PARTE' : 'PARTES'}`;
}
