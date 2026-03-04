import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip } from '../../src/components/Tooltip/Tooltip';
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

const mockComparison: CostComparison = {
  stateAbbr: 'CA',
  stateName: 'California',
  evCost: makeCostEstimate(45.0),
  gasCost: makeCostEstimate(90.0),
  monthlyDifference: -45.0,
  annualDifference: -540.0,
};

describe('Tooltip', () => {
  it('renders nothing when comparison is null', () => {
    const { container } = render(
      <Tooltip comparison={null} x={100} y={100} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows state name when comparison is provided', () => {
    render(<Tooltip comparison={mockComparison} x={100} y={100} />);
    expect(screen.getByText('California')).toBeInTheDocument();
  });

  it('shows EV cost formatted as currency', () => {
    render(<Tooltip comparison={mockComparison} x={100} y={100} />);
    expect(screen.getByText('$45.00/mo')).toBeInTheDocument();
  });

  it('shows gas cost formatted as currency', () => {
    render(<Tooltip comparison={mockComparison} x={100} y={100} />);
    expect(screen.getByText('$90.00/mo')).toBeInTheDocument();
  });

  it('shows difference with sign', () => {
    render(<Tooltip comparison={mockComparison} x={100} y={100} />);
    // -45.00 difference means EV is cheaper
    expect(screen.getByText('-$45.00/mo')).toBeInTheDocument();
  });

  it('renders with left/top inline positioning', () => {
    render(<Tooltip comparison={mockComparison} x={200} y={300} />);
    const tooltip = screen.getByTestId('cost-tooltip');
    // position: fixed comes from CSS module; check inline left/top
    expect(tooltip.style.left).toBeTruthy();
    expect(tooltip.style.top).toBeTruthy();
  });

  it('has tooltip role for accessibility', () => {
    render(<Tooltip comparison={mockComparison} x={200} y={300} />);
    const tooltip = screen.getByTestId('cost-tooltip');
    expect(tooltip).toHaveAttribute('role', 'tooltip');
  });

  it('shows positive difference with + sign when EV is more expensive', () => {
    const expensiveEv: CostComparison = {
      ...mockComparison,
      evCost: makeCostEstimate(100.0),
      gasCost: makeCostEstimate(60.0),
      monthlyDifference: 40.0,
      annualDifference: 480.0,
    };
    render(<Tooltip comparison={expensiveEv} x={100} y={100} />);
    expect(screen.getByText('+$40.00/mo')).toBeInTheDocument();
  });
});
