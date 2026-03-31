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

const categoryStyles: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'New' },
  improved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Improved' },
  updated: { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'Updated' },
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
      <div className="max-w-2xl mx-auto px-6 py-12 text-center text-slate-400">
        <h1 className="text-2xl font-semibold text-slate-100 mb-4">Changelog</h1>
        <p>No entries yet. Check back after the next release.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button
        onClick={onClose}
        className="text-xs text-slate-400 hover:text-slate-200 transition-colors mb-4 flex items-center gap-1"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-semibold text-slate-100 mb-8">Changelog</h1>
      {groups.map((group) => (
        <div key={group.date} className="mb-8">
          <h2 className="text-sm font-medium text-slate-400 mb-3 pb-2 border-b border-slate-700">
            {formatDate(group.date)}
          </h2>
          <div className="space-y-3 pl-3">
            {group.entries.map((entry, i) => {
              const style = categoryStyles[entry.category] || categoryStyles.updated;
              return (
                <div key={`${group.date}-${i}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                    <span className="text-sm font-medium text-slate-200">{entry.title}</span>
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
