/** Local character image fallbacks when no DB expression images exist */
const CHARACTER_IMAGES: Record<string, string> = {
  Kaede: "/img/character/Kaede/pcs1.png",
};

export function getCharacterImageFallback(
  characterName: string,
  expressions: Record<string, string>
): Record<string, string> {
  if (Object.keys(expressions).length > 0) return expressions;
  const fallback = CHARACTER_IMAGES[characterName];
  if (!fallback) return expressions;
  return { neutral: fallback };
}

export { CHARACTER_IMAGES };
