import type { ChartProps } from './chartProps';
import { TimelineChart } from './TimelineChart';
import { VelocityChart } from './VelocityChart';
import { DriverChart } from './DriverChart';
import { WorkMixChart } from './WorkMixChart';
import { BugLifecycleChart } from './BugLifecycleChart';
import { MultiplierChart } from './MultiplierChart';
import { VelocityQualityChart } from './VelocityQualityChart';
import { TestingImpactChart } from './TestingImpactChart';
import { ToolTransitionChart } from './ToolTransitionChart';
import { LifecyclePhasesChart } from './LifecyclePhasesChart';

export function ChartRenderer({ chartKey, data, setTooltip }: ChartProps & { chartKey: string }) {
  switch (chartKey) {
    case 'projectTimeline': return <TimelineChart data={data} setTooltip={setTooltip} />;
    case 'locPerHour': return <VelocityChart data={data} setTooltip={setTooltip} />;
    case 'driverBreakdown': return <DriverChart data={data} setTooltip={setTooltip} />;
    case 'workMix': return <WorkMixChart data={data} setTooltip={setTooltip} />;
    case 'bugLifecycle': return <BugLifecycleChart data={data} setTooltip={setTooltip} />;
    case 'realMultiplier': return <MultiplierChart data={data} setTooltip={setTooltip} />;
    case 'velocityVsQuality': return <VelocityQualityChart data={data} setTooltip={setTooltip} />;
    case 'testingImpact': return <TestingImpactChart data={data} setTooltip={setTooltip} />;
    case 'toolTransitionBugs': return <ToolTransitionChart data={data} setTooltip={setTooltip} />;
    case 'lifecyclePhases': return <LifecyclePhasesChart data={data} setTooltip={setTooltip} />;
    default: return null;
  }
}
