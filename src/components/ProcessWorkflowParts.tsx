import { useState, useEffect, type ReactNode, type CSSProperties } from "react";
import { colors } from "./processWorkflowData";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}

const FadeIn = ({ children, delay = 0, style = {} }: FadeInProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
        transition: "opacity 300ms cubic-bezier(0.23, 1, 0.32, 1), transform 300ms cubic-bezier(0.23, 1, 0.32, 1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface ArrowProps {
  from?: string;
  to?: string;
  color?: string;
  label?: string;
  dashed?: boolean;
}

const Arrow = ({ color = colors.muted, label = "", dashed = false }: ArrowProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "2px 0" }}>
      <div
        style={{
          flex: 1,
          height: dashed ? 0 : 2,
          borderTop: dashed ? `2px dashed ${color}40` : `2px solid ${color}40`,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: 12,
            color: color,
            padding: "2px 8px",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: `8px solid ${color}80`,
        }}
      />
    </div>
  );
};

interface FlowArrowProps {
  color?: string;
  label?: string;
  direction?: "down" | "up";
}

const FlowArrow = ({ color = colors.muted, label = "", direction = "down" }: FlowArrowProps) => {
  const isDown = direction === "down";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "4px 0",
      }}
    >
      <div style={{ width: 2, height: 20, background: `${color}40` }} />
      {label && (
        <span
          style={{
            fontSize: 12,
            color: `${color}99`,
            padding: "2px 6px",
            letterSpacing: 0.5,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {label}
        </span>
      )}
      {label && <div style={{ width: 2, height: 10, background: `${color}40` }} />}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          ...(isDown
            ? { borderTop: `8px solid ${color}80` }
            : { borderBottom: `8px solid ${color}80` }),
        }}
      />
    </div>
  );
};

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  color: string;
  items: string[];
  dimColor: string;
  hoveredRole: string | null;
  setHoveredRole: (role: string | null) => void;
  id: string;
}

const RoleCard = ({
  icon,
  title,
  subtitle,
  color,
  items,
  dimColor,
  hoveredRole,
  setHoveredRole,
  id,
}: RoleCardProps) => {
  const isHovered = hoveredRole === id;
  return (
    <div
      role="group"
      onMouseEnter={() => setHoveredRole(id)}
      onMouseLeave={() => setHoveredRole(null)}
      style={{
        background: isHovered ? dimColor : colors.cardBg,
        border: `1px solid ${isHovered ? color + "60" : colors.border}`,
        borderRadius: 12,
        padding: "20px 22px",
        flex: 1,
        minWidth: 200,
        transition: "background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), border-color 200ms cubic-bezier(0.23, 1, 0.32, 1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, ${color}00)`,
          opacity: isHovered ? 1 : 0.4,
          transition: "opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: color, letterSpacing: 0.3 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: colors.muted, letterSpacing: 0.5 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: 12,
              color: colors.slate,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: `${color}80`, fontSize: 8, marginTop: 5, flexShrink: 0 }}>●</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

interface StepNumberProps {
  n: number;
  color: string;
}

const StepNumber = ({ n, color }: StepNumberProps) => (
  <div
    style={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      border: `1.5px solid ${color}60`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
      color: color,
      fontFamily: "'JetBrains Mono', monospace",
      flexShrink: 0,
    }}
  >
    {n}
  </div>
);

interface WorkflowStepProps {
  number: number;
  text: string;
  color: string;
  tool?: string;
}

const WorkflowStep = ({ number, text, color, tool }: WorkflowStepProps) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
    <StepNumber n={number} color={color} />
    <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.5, flex: 1 }}>{text}</div>
    {tool && (
      <span
        style={{
          fontSize: 12,
          color: color,
          background: `${color}15`,
          padding: "3px 8px",
          borderRadius: 4,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: 0.5,
          whiteSpace: "nowrap",
        }}
      >
        {tool}
      </span>
    )}
  </div>
);

interface DocCardProps {
  title: string;
  description: string;
  color: string;
}

const DocCard = ({ title, description, color }: DocCardProps) => (
  <div
    style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: "12px 16px",
      flex: 1,
      minWidth: 160,
    }}
  >
    <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.5 }}>{description}</div>
  </div>
);

interface PatternCardProps {
  number: number;
  title: string;
  description: string;
}

const PatternCard = ({ number, title, description }: PatternCardProps) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      padding: "10px 0",
      borderBottom: `1px solid ${colors.border}`,
    }}
  >
    <span
      style={{
        fontSize: 12,
        color: colors.amber,
        fontFamily: "'JetBrains Mono', monospace",
        marginTop: 2,
        flexShrink: 0,
      }}
    >
      {String(number).padStart(2, "0")}
    </span>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.5 }}>{description}</div>
    </div>
  </div>
);

interface TabItem {
  id: string;
  label: string;
}


export { FadeIn, Arrow, FlowArrow, RoleCard, StepNumber, WorkflowStep, DocCard, PatternCard };
export type { TabItem };
