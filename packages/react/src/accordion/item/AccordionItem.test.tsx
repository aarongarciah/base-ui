import { expect } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { Accordion } from '@base-ui/react/accordion';
import { describeConformance, createRenderer } from '#test-utils';

describe('<Accordion.Item />', () => {
  const { render } = createRenderer();

  describeConformance(<Accordion.Item />, () => ({
    render: (node) => {
      return render(<Accordion.Root>{node}</Accordion.Root>);
    },
    refInstanceof: window.HTMLDetailsElement,
  }));

  it('renders a <details> element that reflects the open state', async () => {
    const { user } = await render(
      <Accordion.Root>
        <Accordion.Item data-testid="item">
          <Accordion.Trigger>Trigger</Accordion.Trigger>
          <Accordion.Panel>Panel</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const item = screen.getByTestId('item');

    expect(item.tagName).toBe('DETAILS');
    expect(item).not.toHaveAttribute('open');
    expect(item).not.toHaveAttribute('data-open');

    await user.click(screen.getByText('Trigger'));

    expect(item).toHaveAttribute('open');
    expect(item).toHaveAttribute('data-open');
  });
});
