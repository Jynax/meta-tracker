import changelog from '../../CHANGELOG.json';

interface ChangelogEntry {
  category: 'new' | 'improved' | 'updated';
  title: string;
  description: string;
}

interface ChangelogDateGroup {
  date: string;
  entries: ChangelogEntry[];
}

const categoryStyles: Record<string, { color: string; bg: string; label: string }> = {
  new:      { color: '#6CE0D4', bg: 'rgba(108,224,212,0.10)', label: 'New' },
  improved: { color: '#5BD6A0', bg: 'rgba(91,214,160,0.10)',  label: 'Improved' },
  updated:  { color: '#6B7A88', bg: 'rgba(107,122,136,0.12)', label: 'Updated' },
  fixed:    { color: '#5BD6A0', bg: 'rgba(91,214,160,0.10)',  label: 'Fixed' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface ChangelogPageProps {
  onClose: () => void;
}

export default function ChangelogPage({ onClose }: ChangelogPageProps) {
  const groups = changelog as ChangelogDateGroup[];

  if (groups.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center" style={{ color: 'var(--theme-text-secondary)' }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--con-font-display)', color: 'var(--theme-text-primary)' }}>Changelog</h1>
        <p>No entries yet. Check back after the next release.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button
        onClick={onClose}
        className="text-xs transition-colors mb-6 flex items-center gap-1 hover:brightness-125"
        style={{ color: 'var(--theme-cyan)', fontFamily: 'var(--con-font-mono)' }}
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--con-font-display)', color: 'var(--theme-text-primary)' }}>Changelog</h1>
      {groups.map((group) => (
        <div key={group.date} className="mb-8">
          <h2
            className="text-xs mb-3 pb-2"
            style={{
              fontFamily: 'var(--con-font-mono)',
              color: 'var(--theme-text-secondary)',
              borderBottom: '1px solid var(--theme-border)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {formatDate(group.date)}
          </h2>
          <div className="space-y-3 pl-3">
            {group.entries.map((entry, i) => {
              const s = categoryStyles[entry.category] ?? categoryStyles.updated;
              return (
                <div key={`${group.date}-${i}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: s.color, backgroundColor: s.bg }}
                    >
                      {s.label}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--theme-text-primary)', fontFamily: 'var(--con-font-sans)' }}>{entry.title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
