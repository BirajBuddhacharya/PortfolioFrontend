'use client';

export function TickerSection({ items }: { items: string[] }) {
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-t border-b border-white/[0.07] py-[18px]"
      style={{ background: '#0C0C0F' }}
    >
      <div className="marquee-track flex w-max">
        {[...doubled, ...doubled].map((t, i) => (
          <span
            key={i}
            className="text-[13px] tracking-[0.04em] whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: '#6E6E78',
              paddingRight: '44px',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
