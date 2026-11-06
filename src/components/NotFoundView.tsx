import Link from 'next/link';

const mono = 'var(--font-jetbrains-mono), monospace';
const heading = 'var(--font-space-grotesk), sans-serif';

export function NotFoundView({ withHeader = false }: { withHeader?: boolean }) {
  return (
    <div
      style={{
        background: '#09090B',
        color: '#EDEDEF',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {withHeader && (
        <header className="max-w-[1180px] w-full mx-auto px-7 pt-[34px]">
          <Link
            href="/"
            className="text-[15px] font-semibold"
            style={{ fontFamily: heading, letterSpacing: '-0.03em' }}
          >
            Biraj Buddhacharya<span style={{ color: '#FF6B6B' }}>.</span>
          </Link>
        </header>
      )}

      <main className="flex-1 flex flex-col justify-center max-w-[1180px] w-full mx-auto px-7 py-[80px]">
        <div
          className="text-[12px] uppercase tracking-[0.14em] mb-4"
          style={{ fontFamily: mono, color: '#FF6B6B' }}
        >
          404
        </div>
        <h1
          className="m-0 max-w-[16ch]"
          style={{
            fontFamily: heading,
            fontSize: 'clamp(38px, 6.4vw, 78px)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            fontWeight: 600,
          }}
        >
          This page took a different route
          <span style={{ color: '#FF6B6B' }}>.</span>
        </h1>
        <p
          className="mt-[22px] mb-0 max-w-[52ch] text-[16px] leading-[1.7]"
          style={{ color: '#8A8A93' }}
        >
          The link may be old, or the thing you were looking for has moved.
          Pick a way back below.
        </p>

        <div className="flex flex-wrap gap-[10px] mt-[34px]">
          <Link
            href="/"
            className="px-5 py-[12px] rounded-[10px] text-[12.5px] font-semibold"
            style={{ background: '#FF6B6B', color: '#12080A', fontFamily: mono }}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="px-5 py-[12px] rounded-[10px] text-[12.5px] border border-white/[0.14]"
            style={{ color: '#EDEDEF', fontFamily: mono }}
          >
            Back to work
          </Link>
          <Link
            href="/contact"
            className="px-5 py-[12px] rounded-[10px] text-[12.5px] border border-white/[0.14]"
            style={{ color: '#EDEDEF', fontFamily: mono }}
          >
            Contact
          </Link>
        </div>
      </main>
    </div>
  );
}
