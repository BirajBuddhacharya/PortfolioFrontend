import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const SITE_DOMAIN = 'birajbuddhacharya.com.np';

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    // Old UA → Google Fonts returns TTF (format('truetype')), which Satori supports.
    // Modern UA returns WOFF2 which Satori rejects with "Unsupported OpenType signature wOF2".
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700',
      { headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0)' } }
    ).then((r) => r.text());
    const match = css.match(/src: url\(([^)]+)\) format\('truetype'\)/);
    if (!match?.[1]) return null;
    return fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

interface OgProps {
  title: string;
  description?: string;
  label?: string;
  tags?: string[];
}

function OgTemplate({ title, description, label, tags = [] }: OgProps) {
  const fontSize = title.length > 60 ? 52 : title.length > 40 ? 60 : 68;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#09090B',
        padding: '56px 72px 56px 80px',
        position: 'relative',
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Dot grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Accent glow — top right */}
      <div
        style={{
          position: 'absolute',
          top: -160,
          right: -160,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,107,107,0.18) 0%, transparent 68%)',
        }}
      />

      {/* Accent glow — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: -120,
          left: -80,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,107,107,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 72,
          bottom: 72,
          width: 5,
          background: 'linear-gradient(180deg, #FF6B6B 0%, rgba(255,107,107,0.3) 100%)',
          borderRadius: '0 3px 3px 0',
        }}
      />

      {/* Top row: label + domain */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {label ? (
          <span
            style={{
              background: 'rgba(255,107,107,0.12)',
              border: '1px solid rgba(255,107,107,0.3)',
              color: '#FF6B6B',
              fontSize: 14,
              fontWeight: 700,
              padding: '5px 14px',
              borderRadius: 20,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        ) : (
          <span />
        )}
        <span style={{ color: '#6E6E78', fontSize: 16, letterSpacing: '0.02em' }}>
          {SITE_DOMAIN}
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: 8,
          position: 'relative',
        }}
      >
        <div
          style={{
            color: '#EDEDEF',
            fontSize,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            maxWidth: 960,
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              color: '#A1A1AA',
              fontSize: 22,
              marginTop: 24,
              lineHeight: 1.5,
              maxWidth: 840,
              fontWeight: 400,
            }}
          >
            {description.length > 130
              ? description.slice(0, 130).replace(/\s+\S*$/, '') + '…'
              : description}
          </div>
        )}
      </div>

      {/* Bottom tags */}
      {tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 32,
            position: 'relative',
          }}
        >
          {tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              style={{
                background: '#131317',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#8A8A93',
                fontSize: 15,
                padding: '6px 16px',
                borderRadius: 6,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export async function buildOgImage(props: OgProps): Promise<ImageResponse> {
  const fontData = await loadFont();
  return new ImageResponse(<OgTemplate {...props} />, {
    ...OG_SIZE,
    fonts: fontData
      ? [{ name: 'Space Grotesk', data: fontData, weight: 700 as const }]
      : [],
  });
}
