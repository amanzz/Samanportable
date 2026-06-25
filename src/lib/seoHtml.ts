export function demoteHtmlH1ToH2(html: string): string {
  if (!html) return html;

  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>');
}
