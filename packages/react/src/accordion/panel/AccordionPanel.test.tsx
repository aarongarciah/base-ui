import { expect } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { Accordion } from '@base-ui/react/accordion';
import { createRenderer, describeConformance } from '#test-utils';

const PANEL_CONTENT = 'This is panel content';

describe('<Accordion.Panel />', () => {
  const { render } = createRenderer();

  describeConformance(<Accordion.Panel />, () => ({
    render: (node) =>
      render(
        <Accordion.Root>
          <Accordion.Item>{node}</Accordion.Item>
        </Accordion.Root>,
      ),
    refInstanceof: window.HTMLDivElement,
  }));

  it('stays mounted while the item is closed', async () => {
    await render(
      <Accordion.Root>
        <Accordion.Item value={0}>
          <Accordion.Trigger>Trigger</Accordion.Trigger>
          <Accordion.Panel>{PANEL_CONTENT}</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const panel = screen.getByText(PANEL_CONTENT);

    expect(panel).toBeInTheDocument();
    expect(panel).not.toHaveAttribute('data-open');
  });

  it('reflects the open state through data attributes', async () => {
    const { user } = await render(
      <Accordion.Root>
        <Accordion.Item value={0}>
          <Accordion.Trigger>Trigger</Accordion.Trigger>
          <Accordion.Panel>{PANEL_CONTENT}</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    await user.click(screen.getByText('Trigger'));

    expect(screen.getByText(PANEL_CONTENT)).toHaveAttribute('data-open');
  });
});
