import { Compass } from 'lucide-react';

interface ThemeToggleButtonProps {
  theme: 'default' | 'sc';
  onToggle: () => void;
}

export function ThemeToggleButton({ theme, onToggle }: ThemeToggleButtonProps) {
  const isActive = theme === 'sc';

  return (
    <button
      onClick={onToggle}
      title="Security Compass Mode"
      className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:brightness-125"
      style={{
        borderColor: isActive ? 'var(--theme-cyan)' : 'var(--theme-border)',
        backgroundColor: isActive ? 'var(--theme-accent-15)' : 'var(--theme-card-bg)',
        color: isActive ? 'var(--theme-cyan)' : 'var(--theme-text-secondary)',
      }}
    >
      <Compass size={14} />
      SC Mode
    </button>
  );
}
