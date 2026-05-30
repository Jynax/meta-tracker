import { JynaxxWordmark } from './brand/Wordmark';

const MONO = 'var(--con-font-mono)';

const channels = [
  { label: 'email',   value: 'jynaxx@gmail.com' },
  { label: 'github',  value: 'github.com/Jynax' },
  { label: 'bluesky', value: '@mrchartrand.bsky.social' },
];

const signoff = [
  '© 2024–2026 jynaxx · all rights reversed',
  'designed by michael · built with claude & claude code',
  'made in canada',
];

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '4rem',
        borderTop: '1px solid var(--theme-border)',
        padding: '2.5rem 0 2rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <JynaxxWordmark size={18} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {channels.map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: '1.5rem', fontFamily: MONO, fontSize: 11 }}>
                <span style={{ color: 'var(--theme-text-muted)', minWidth: '4rem' }}>{label}</span>
                <span style={{ color: 'var(--theme-text-secondary)' }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
            {signoff.map((line) => (
              <span key={line} style={{ fontFamily: MONO, fontSize: 10, color: 'var(--theme-text-muted)' }}>
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
