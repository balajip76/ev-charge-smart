import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('US1: Hover flow integration', () => {
  it('renders the app with title and map', () => {
    render(<App />);
    expect(screen.getByText('EVChargeSmart')).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /US map showing EV vs gas cost comparison/,
      }),
    ).toBeInTheDocument();
  });

  it('renders 51 state paths on the map', () => {
    const { container } = render(<App />);
    const paths = container.querySelectorAll('path[data-state]');
    expect(paths.length).toBe(51);
  });

  it('shows tooltip on state hover and hides on leave', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    // Initially no tooltip
    expect(screen.queryByTestId('cost-tooltip')).not.toBeInTheDocument();

    // Hover over California
    const caPath = container.querySelector('path[data-state="CA"]');
    expect(caPath).toBeInTheDocument();

    await user.hover(caPath!);

    // Tooltip should appear with California's data
    const tooltip = screen.getByTestId('cost-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText('California')).toBeInTheDocument();
    // Should show EV Cost and Gas Cost labels
    expect(screen.getByText('EV Cost')).toBeInTheDocument();
    expect(screen.getByText('Gas Cost')).toBeInTheDocument();
    expect(screen.getByText('Difference')).toBeInTheDocument();

    // Leave the state
    await user.unhover(caPath!);

    // Tooltip should disappear
    expect(screen.queryByTestId('cost-tooltip')).not.toBeInTheDocument();
  });

  it('updates tooltip when hovering different states', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    // Hover California
    const caPath = container.querySelector('path[data-state="CA"]');
    await user.hover(caPath!);
    expect(screen.getByText('California')).toBeInTheDocument();

    // Move to Texas
    await user.unhover(caPath!);
    const txPath = container.querySelector('path[data-state="TX"]');
    await user.hover(txPath!);
    expect(screen.getByText('Texas')).toBeInTheDocument();
    expect(screen.queryByText('California')).not.toBeInTheDocument();
  });

  it('states have colored fills based on cost data', () => {
    const { container } = render(<App />);

    const paths = container.querySelectorAll('path[data-state]');
    let hasColoredPath = false;

    paths.forEach((path) => {
      const fill = path.getAttribute('fill');
      if (fill && fill !== '#e2e8f0') {
        hasColoredPath = true;
      }
    });

    expect(hasColoredPath).toBe(true);
  });

  it('renders the legend with savings labels', () => {
    render(<App />);
    expect(screen.getByLabelText('Cost comparison color legend')).toBeInTheDocument();
    expect(screen.queryByText('Break-even')).not.toBeInTheDocument();
  });
});
