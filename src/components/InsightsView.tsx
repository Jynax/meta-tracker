import { useMemo, useState, type ReactNode } from 'react';
import { C } from './MetricsCard';
import { computeInsights } from '../utils/insightsData';
import { chapters, PORTFOLIO_HEADLINE, type ChapterId } from '../utils/insightsNarrative';
import { ALL_BUNDLES } from './insights/bundles';
import { ChartRenderer } from './insights/ChartRenderer';

const CHAPTER_ORDER: ChapterId[] = ['theStory', 'whatWeLearned', 'byTheNumbers', 'forTeams', 'fromTheAI'];

// Converts **bold** markers in narrative prose into <strong> nodes.
function renderProse(prose: string): ReactNode[] {
  const parts = prose.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: C.white }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

interface InsightsViewProps {
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

export default function InsightsView({ setTooltip }: InsightsViewProps) {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('theStory');
  const data = useMemo(() => computeInsights(ALL_BUNDLES), []);
  const chapter = chapters[activeChapter];

  return (
    <div className="space-y-4">
      {/* Narrative headline */}
      <div className="text-center py-3">
        <p className="text-base font-medium" style={{ color: C.white }}>{PORTFOLIO_HEADLINE}</p>
      </div>

      {/* Compact stat row */}
      <div className="flex justify-center gap-6 text-sm" style={{ color: C.muted }}>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalProjects}</strong> projects</span>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalLoc.toLocaleString()}</strong> LOC</span>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalHours}</strong> hours</span>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalPrs}</strong> PRs</span>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalBlocks}</strong> blocks</span>
      </div>

      {/* Chapter tabs — pill buttons */}
      <div className="flex gap-2 flex-wrap">
        {CHAPTER_ORDER.map(id => {
          const ch = chapters[id];
          const isActive = activeChapter === id;
          return (
            <button
              key={id}
              onClick={() => setActiveChapter(id)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition"
              style={{
                backgroundColor: isActive ? 'var(--theme-cyan)' : C.cardBg,
                color: isActive ? '#0E1419' : C.muted,
                border: `1px solid ${isActive ? 'var(--theme-cyan)' : C.border}`,
              }}
            >
              {ch.title}
            </button>
          );
        })}
      </div>

      {/* Chapter content */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        {chapter.intro && (
          <p className="text-base mb-6" style={{ color: C.muted, lineHeight: 1.7 }}>{chapter.intro}</p>
        )}

        <div className="space-y-8">
          {chapter.sections.map(section => (
            <div key={section.id}>
              <h3 className="text-base font-semibold mb-2" style={{ color: C.white }}>{section.heading}</h3>
              <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: C.muted, lineHeight: 1.8 }}>
                {renderProse(section.prose)}
              </div>
              {section.disclaimer && (
                <div className="mt-2 text-xs italic px-3 py-2 rounded" style={{ color: C.muted, backgroundColor: C.bg, borderLeft: '3px solid var(--theme-amber)' }}>
                  {section.disclaimer}
                </div>
              )}
              {section.sources && section.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {section.sources.map((src, i) => {
                    const content = <>{src.label}{src.note ? ` — ${src.note}` : ''}</>;
                    return src.url ? (
                      <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 rounded-full inline-flex items-center gap-1 hover:brightness-125 transition" style={{ backgroundColor: C.bg, color: 'var(--theme-cyan)', textDecoration: 'none' }}>
                        {content} <span aria-hidden="true">&#8599;</span>
                      </a>
                    ) : (
                      <span key={i} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: C.bg, color: C.muted }}>
                        {content}
                      </span>
                    );
                  })}
                </div>
              )}
              {section.chartKey && (
                <div className="mt-4">
                  <ChartRenderer chartKey={section.chartKey} data={data} setTooltip={setTooltip} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
