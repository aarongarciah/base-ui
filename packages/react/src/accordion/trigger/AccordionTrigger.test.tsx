import { expect } from 'vitest';
import { Accordion } from '@base-ui/react/accordion';
import { screen } from '@mui/internal-test-utils';
import { describeConformance, createRenderer } from '#test-utils';

describe('<Accordion.Trigger />', () => {
  const { render } = createRenderer();

  describeConformance(<Accordion.Trigger />, () => ({
    refInstanceof: window.HTMLElement,
    render: (node) =>
      render(
        <Accordion.Root>
          <Accordion.Item>{node}</Accordion.Item>
        </Accordion.Root>,
      ),
  }));

  it('renders a native <summary> element', async () => {
    await render(
      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Trigger>Trigger</Accordion.Trigger>
          <Accordion.Panel>Panel</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    expect(screen.getByText('Trigger').tagName).toBe('SUMMARY');
  });

  it('exposes aria-disabled and stays focusable when disabled', async () => {
    await render(
      <Accordion.Root disabled>
        <Accordion.Item>
          <Accordion.Trigger>Trigger</Accordion.Trigger>
          <Accordion.Panel>Panel</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = screen.getByText('Trigger');

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).not.toHaveAttribute('disabled');

    trigger.focus();
    expect(trigger).toHaveFocus();
  });
});
