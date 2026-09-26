export interface Heading {
  level: number;
  text: string;
  slug: string;
  /** Character offset of the heading line in the raw markdown. */
  offset: number;
}

/** GitHub-style slug, matching what rehype-slug generates for rendered output. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

/** Pulls ATX headings out of markdown, skipping anything inside a fenced code block. */
export function parseHeadings(markdown: string): Heading[] {
  const out: Heading[] = [];
  const seen = new Map<string, number>();
  let offset = 0;
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    else if (!inFence) {
      const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
      if (m) {
        const text = m[2].replace(/[*_`]/g, '').trim();
        const base = slugify(text);
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        out.push({
          level: m[1].length,
          text,
          slug: n ? `${base}-${n}` : base,
          offset,
        });
      }
    }
    offset += line.length + 1;
  }
  return out;
}
