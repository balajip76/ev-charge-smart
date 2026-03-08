import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Legend } from '../../src/components/Legend/Legend';

describe('Legend component', () => {
  it('renders mileage assumption label', () => {
    render(<Legend minDiff={-80} maxDiff={30} monthlyMiles={1000} />);
    expect(screen.getByText(/1,000 miles\/month/)).toBeInTheDocument();
  });

  it('renders left label for EV savings', () => {
    render(<Legend minDiff={-80} maxDiff={30} monthlyMiles={1000} />);
    expect(screen.getByText('EV saves $80/mo')).toBeInTheDocument();
  });

  it('renders right label as "EV saves" when maxDiff is negative (EV cheaper everywhere)', () => {
    render(<Legend minDiff={-80} maxDiff={-20} monthlyMiles={1000} />);
    expect(screen.getByText('EV saves $20/mo')).toBeInTheDocument();
  });

  it('renders right label as "Gas saves" when maxDiff is positive (gas cheaper in worst state)', () => {
    render(<Legend minDiff={-80} maxDiff={30} monthlyMiles={1000} />);
    expect(screen.getByText('Gas saves $30/mo')).toBeInTheDocument();
  });

  it('renders right label as "Break even" when maxDiff is zero', () => {
    render(<Legend minDiff={-80} maxDiff={0} monthlyMiles={1000} />);
    expect(screen.getByText('Break even')).toBeInTheDocument();
  });
});
