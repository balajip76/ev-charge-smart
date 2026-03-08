import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { USMap } from '../../src/components/USMap/USMap';
import type { CostComparison, CostEstimate } from '../../src/types';

function makeCostEstimate(monthly: number): CostEstimate {
  return {
    monthlyCost: monthly,
    annualCost: monthly * 12,
    rateUsed: 0.15,
    efficiencyUsed: 30,
    monthlyMiles: 1000,
  };
}

function makeComparison(
  abbr: string,
  name: string,
  evMonthly: number,
  gasMonthly: number,
): CostComparison {
  return {
    stateAbbr: abbr,
    stateName: name,
    evCost: makeCostEstimate(evMonthly),
    gasCost: makeCostEstimate(gasMonthly),
    monthlyDifference: evMonthly - gasMonthly,
    annualDifference: (evMonthly - gasMonthly) * 12,
  };
}

// Build a minimal costsByState with a few states for testing
// CA: monthlyDifference = -45 (best savings / min)
// TX: monthlyDifference = -20 (worst savings / max)
// NY: monthlyDifference = -20 (tied worst)
const mockCostsByState: Record<string, CostComparison> = {
  CA: makeComparison('CA', 'California', 45.0, 90.0),
  TX: makeComparison('TX', 'Texas', 35.0, 55.0),
  NY: makeComparison('NY', 'New York', 60.0, 80.0),
};

const mockMinDiff = -45;
const mockMaxDiff = -20;

describe('USMap', () => {
  it('renders an SVG element with role img', () => {
    render(
      <USMap
        costsByState={mockCostsByState}
        minDiff={mockMinDiff}
        maxDiff={mockMaxDiff}
        onStateHover={vi.fn()}
        onStateClick={vi.fn()}
      />,
    );

    const svg = screen.getByRole('img', {
      name: /US map showing EV vs gas cost comparison/,
    });
    expect(svg).toBeInTheDocument();
    expect(svg.tagName).toBe('svg');
  });

  it('renders path elements for states', () => {
    const { container } = render(
      <USMap
        costsByState={mockCostsByState}
        minDiff={mockMinDiff}
        maxDiff={mockMaxDiff}
        onStateHover={vi.fn()}
        onStateClick={vi.fn()}
      />,
    );

    const paths = container.querySelectorAll('path[data-state]');
    // Should render 51 states (50 + DC)
    expect(paths.length).toBe(51);
  });

  it('applies deepest green to state with minimum difference and deepest red to maximum', () => {
    const { container } = render(
      <USMap
        costsByState={mockCostsByState}
        minDiff={mockMinDiff}
        maxDiff={mockMaxDiff}
        onStateHover={vi.fn()}
        onStateClick={vi.fn()}
      />,
    );

    // CA has the best EV savings (-45, minimum) → deepest green
    const caPath = container.querySelector('path[data-state="CA"]');
    expect(caPath?.getAttribute('fill')).toBe('#22c55e');

    // TX has the worst savings (-20, maximum) → deepest red
    const txPath = container.querySelector('path[data-state="TX"]');
    expect(txPath?.getAttribute('fill')).toBe('#ef4444');
  });

  it('applies color based on cost difference', () => {
    const { container } = render(
      <USMap
        costsByState={mockCostsByState}
        minDiff={mockMinDiff}
        maxDiff={mockMaxDiff}
        onStateHover={vi.fn()}
        onStateClick={vi.fn()}
      />,
    );

    const caPath = container.querySelector('path[data-state="CA"]');
    expect(caPath).toBeInTheDocument();
    // CA has the minimum difference (best EV savings), so fill should not be the no-data color
    const fill = caPath?.getAttribute('fill');
    expect(fill).toBeTruthy();
    expect(fill).not.toBe('#e2e8f0'); // Not the "no data" color
  });

  it('calls onStateHover on mouseenter and mouseleave', async () => {
    const user = userEvent.setup();
    const onHover = vi.fn();
    const { container } = render(
      <USMap
        costsByState={mockCostsByState}
        minDiff={mockMinDiff}
        maxDiff={mockMaxDiff}
        onStateHover={onHover}
        onStateClick={vi.fn()}
      />,
    );

    const caPath = container.querySelector('path[data-state="CA"]');
    expect(caPath).toBeInTheDocument();

    await user.hover(caPath!);
    expect(onHover).toHaveBeenCalledWith('CA', expect.any(Object));

    await user.unhover(caPath!);
    expect(onHover).toHaveBeenCalledWith(null, expect.any(Object));
  });

  it('calls onStateClick on click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <USMap
        costsByState={mockCostsByState}
        minDiff={mockMinDiff}
        maxDiff={mockMaxDiff}
        onStateHover={vi.fn()}
        onStateClick={onClick}
      />,
    );

    const caPath = container.querySelector('path[data-state="CA"]');
    expect(caPath).toBeInTheDocument();

    await user.click(caPath!);
    expect(onClick).toHaveBeenCalledWith('CA');
  });

  it('uses fallback color for states without cost data', () => {
    const { container } = render(
      <USMap
        costsByState={{}} // No data at all
        minDiff={-100}
        maxDiff={100}
        onStateHover={vi.fn()}
        onStateClick={vi.fn()}
      />,
    );

    const paths = container.querySelectorAll('path[data-state]');
    paths.forEach((path) => {
      expect(path.getAttribute('fill')).toBe('#e2e8f0');
    });
  });
});
