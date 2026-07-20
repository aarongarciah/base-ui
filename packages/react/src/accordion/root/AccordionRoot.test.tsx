import { expect, vi } from 'vitest';
import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { Accordion } from '@base-ui/react/accordion';
import { createRenderer, describeConformance } from '#test-utils';
import { REASONS } from '../../internals/reasons';

const PANEL_CONTENT_1 = 'Panel contents 1';
const PANEL_CONTENT_2 = 'Panel contents 2';

function getItem(triggerName: string) {
  return screen.getByText(triggerName).closest('details') as HTMLDetailsElement;
}

describe('<Accordion.Root />', () => {
  const { render } = createRenderer();

  describeConformance(<Accordion.Root />, () => ({
    render,
    refInstanceof: window.HTMLDivElement,
  }));

  describe('native structure', () => {
    it('renders a <details> per item and a <summary> trigger', async () => {
      await render(
        <Accordion.Root defaultValue={[0]}>
          <Accordion.Item value={0}>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const trigger = screen.getByText('Trigger 1');
      const item = trigger.closest('details');

      expect(trigger.tagName).toBe('SUMMARY');
      expect(item?.tagName).toBe('DETAILS');
      expect(item).toHaveAttribute('open');
    });

    it('does not add aria-expanded, aria-controls, or role attributes', async () => {
      await render(
        <Accordion.Root defaultValue={[0]}>
          <Accordion.Item value={0}>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const trigger = screen.getByText('Trigger 1');
      const panel = screen.getByText(PANEL_CONTENT_1);

      expect(trigger).not.toHaveAttribute('aria-expanded');
      expect(trigger).not.toHaveAttribute('aria-controls');
      expect(panel).not.toHaveAttribute('role');
    });
  });

  describe('uncontrolled', () => {
    it('open state', async () => {
      const { user } = await render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const trigger = screen.getByText('Trigger 1');
      const item = trigger.closest('details') as HTMLDetailsElement;

      expect(item).not.toHaveAttribute('open');
      expect(trigger).not.toHaveAttribute('data-panel-open');

      await user.click(trigger);

      expect(item).toHaveAttribute('open');
      expect(trigger).toHaveAttribute('data-panel-open');
      expect(screen.getByText(PANEL_CONTENT_1)).toHaveAttribute('data-open');

      await user.click(trigger);

      expect(item).not.toHaveAttribute('open');
      expect(trigger).not.toHaveAttribute('data-panel-open');
    });

    it('prop: defaultValue with a custom item value', async () => {
      await render(
        <Accordion.Root defaultValue={['first']}>
          <Accordion.Item value="first">
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="second">
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_2}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(getItem('Trigger 1')).toHaveAttribute('open');
      expect(getItem('Trigger 2')).not.toHaveAttribute('open');
    });
  });

  describe('controlled', () => {
    it('open state', async () => {
      const { setProps } = await render(
        <Accordion.Root value={[]}>
          <Accordion.Item value={0}>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const item = getItem('Trigger 1');

      expect(item).not.toHaveAttribute('open');

      await setProps({ value: [0] });

      expect(item).toHaveAttribute('open');

      await setProps({ value: [] });

      expect(item).not.toHaveAttribute('open');
    });

    it('prop: value with a custom item value', async () => {
      await render(
        <Accordion.Root value={['one']}>
          <Accordion.Item value="one">
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="second">
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_2}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(getItem('Trigger 1')).toHaveAttribute('open');
      expect(getItem('Trigger 2')).not.toHaveAttribute('open');
    });
  });

  describe('prop: disabled', () => {
    it('can disable the whole accordion', async () => {
      await render(
        <Accordion.Root defaultValue={[0]} disabled>
          <Accordion.Item data-testid="item1" value={0}>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item data-testid="item2" value={1}>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_2}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const item1 = screen.getByTestId('item1');
      const item2 = screen.getByTestId('item2');
      const trigger1 = screen.getByText('Trigger 1');
      const trigger2 = screen.getByText('Trigger 2');
      const panel1 = screen.getByText(PANEL_CONTENT_1);

      [item1, trigger1, panel1, item2, trigger2].forEach((element) => {
        expect(element).toHaveAttribute('data-disabled');
      });

      expect(trigger1).toHaveAttribute('aria-disabled', 'true');
    });

    it('can disable one accordion item', async () => {
      await render(
        <Accordion.Root defaultValue={[0]}>
          <Accordion.Item data-testid="item1" value={0} disabled>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item data-testid="item2" value={1}>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_2}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const item1 = screen.getByTestId('item1');
      const item2 = screen.getByTestId('item2');
      const trigger1 = screen.getByText('Trigger 1');
      const trigger2 = screen.getByText('Trigger 2');

      expect(item1).toHaveAttribute('data-disabled');
      expect(trigger1).toHaveAttribute('data-disabled');
      expect(item2).not.toHaveAttribute('data-disabled');
      expect(trigger2).not.toHaveAttribute('data-disabled');
    });

    it.each(['root', 'item'] as const)(
      'does not toggle or fire callbacks when the %s is disabled',
      async (disabledPart) => {
        const onValueChange = vi.fn();
        const onOpenChange = vi.fn();

        const { user } = await render(
          <Accordion.Root disabled={disabledPart === 'root'} onValueChange={onValueChange}>
            <Accordion.Item
              value={0}
              disabled={disabledPart === 'item'}
              onOpenChange={onOpenChange}
            >
              <Accordion.Trigger>Trigger 1</Accordion.Trigger>
              <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>,
        );

        const trigger1 = screen.getByText('Trigger 1');

        await user.click(trigger1);
        trigger1.focus();
        await user.keyboard('[Enter]');

        expect(getItem('Trigger 1')).not.toHaveAttribute('open');
        expect(onValueChange).toHaveBeenCalledTimes(0);
        expect(onOpenChange).toHaveBeenCalledTimes(0);
      },
    );
  });

  describe('BaseUIChangeEventDetails', () => {
    it('onOpenChange cancel() prevents opening while uncontrolled', async () => {
      const onValueChange = vi.fn();

      await render(
        <Accordion.Root onValueChange={onValueChange}>
          <Accordion.Item
            value={0}
            onOpenChange={(nextOpen, eventDetails) => {
              if (nextOpen) {
                eventDetails.cancel();
              }
            }}
          >
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      fireEvent.click(screen.getByText('Trigger 1'));

      expect(getItem('Trigger 1')).not.toHaveAttribute('open');
      expect(onValueChange).toHaveBeenCalledTimes(0);
    });

    it('onValueChange cancel() prevents opening while uncontrolled', async () => {
      const onValueChange = vi.fn((_value, eventDetails) => {
        eventDetails.cancel();
      });

      await render(
        <Accordion.Root onValueChange={onValueChange}>
          <Accordion.Item value={0}>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      fireEvent.click(screen.getByText('Trigger 1'));

      expect(getItem('Trigger 1')).not.toHaveAttribute('open');
      expect(onValueChange).toHaveBeenCalledTimes(1);
    });

    it('onValueChange cancel() prevents closing while multiple', async () => {
      const onValueChange = vi.fn((_value, eventDetails) => {
        eventDetails.cancel();
      });

      await render(
        <Accordion.Root defaultValue={[0]} multiple onValueChange={onValueChange}>
          <Accordion.Item value={0}>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      fireEvent.click(screen.getByText('Trigger 1'));

      expect(getItem('Trigger 1')).toHaveAttribute('open');
      expect(onValueChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: multiple', () => {
    it('multiple items can be open when `multiple = true`', async () => {
      const { user } = await render(
        <Accordion.Root multiple>
          <Accordion.Item>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_2}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      await user.click(screen.getByText('Trigger 1'));
      await user.click(screen.getByText('Trigger 2'));

      expect(getItem('Trigger 1')).toHaveAttribute('open');
      expect(getItem('Trigger 2')).toHaveAttribute('open');
    });

    it('does not set a shared `name` on items when `multiple = true`', async () => {
      await render(
        <Accordion.Root multiple>
          <Accordion.Item>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(getItem('Trigger 1')).not.toHaveAttribute('name');
    });

    it('only one item can be open when `multiple = false`', async () => {
      const { user } = await render(
        <Accordion.Root multiple={false}>
          <Accordion.Item>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_2}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      await user.click(screen.getByText('Trigger 1'));

      expect(getItem('Trigger 1')).toHaveAttribute('open');

      await user.click(screen.getByText('Trigger 2'));

      expect(getItem('Trigger 2')).toHaveAttribute('open');
      expect(getItem('Trigger 1')).not.toHaveAttribute('open');
    });

    it('sets a shared `name` on all items when `multiple = false`', async () => {
      await render(
        <Accordion.Root multiple={false}>
          <Accordion.Item>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_1}</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>{PANEL_CONTENT_2}</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const name1 = getItem('Trigger 1').getAttribute('name');
      const name2 = getItem('Trigger 2').getAttribute('name');

      expect(name1).toBeTruthy();
      expect(name1).toBe(name2);
    });
  });

  describe('prop: onValueChange', () => {
    it('multiple items', async () => {
      const onValueChange = vi.fn();

      const { user } = await render(
        <Accordion.Root onValueChange={onValueChange} multiple>
          <Accordion.Item value={0}>
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value={1}>
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>2</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      await user.click(screen.getByText('Trigger 1'));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.lastCall?.[0]).toEqual([0]);
      expect(onValueChange.mock.lastCall?.[1].reason).toBe(REASONS.triggerPress);

      await user.click(screen.getByText('Trigger 2'));

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange.mock.lastCall?.[0]).toEqual([0, 1]);
    });

    it('`multiple` is false', async () => {
      const onValueChange = vi.fn();

      const { user } = await render(
        <Accordion.Root onValueChange={onValueChange} multiple={false}>
          <Accordion.Item value="one">
            <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            <Accordion.Panel>1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="two">
            <Accordion.Trigger>Trigger 2</Accordion.Trigger>
            <Accordion.Panel>2</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );

      await user.click(screen.getByText('Trigger 1'));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange.mock.calls[0][0]).toEqual(['one']);

      await user.click(screen.getByText('Trigger 2'));

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange.mock.calls[1][0]).toEqual(['two']);
    });
  });
});
