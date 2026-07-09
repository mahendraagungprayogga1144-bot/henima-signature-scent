const CATALOG_TYPO_FIXES: Array<[RegExp, string]> = [
  [/Brave Man Itense/gi, "Brave Man Intense"],
  [/terisnpirasi/gi, "terinspirasi"],
];

export function fixCatalogText(text: string | undefined | null): string {
  if (!text) return "";
  return CATALOG_TYPO_FIXES.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    text
  );
}
