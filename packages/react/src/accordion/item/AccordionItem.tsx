'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { BaseUIComponentProps } from '../../internals/types';
import { useBaseUiId } from '../../internals/useBaseUiId';
import { useCompositeListItem } from '../../internals/composite/list/useCompositeListItem';
import { useAccordionRootContext } from '../root/AccordionRootContext';
import { AccordionItemContext } from './AccordionItemContext';
import { accordionItemStateAttributesMapping } from './stateAttributesMapping';
import { useRenderElement } from '../../internals/useRenderElement';
import {
  createChangeEventDetails,
  type BaseUIChangeEventDetails,
} from '../../internals/createBaseUIEventDetails';
import { REASONS } from '../../internals/reasons';

/**
 * Groups an accordion trigger with the corresponding panel.
 * Renders a `<details>` element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */
export const AccordionItem = React.forwardRef(function AccordionItem(
  componentProps: AccordionItem.Props,
  forwardedRef: React.ForwardedRef<HTMLDetailsElement>,
) {
  const {
    className,
    disabled: disabledProp = false,
    onOpenChange: onOpenChangeProp,
    render,
    value: valueProp,
    style,
    ...elementProps
  } = componentProps;

  const { ref: listItemRef, index } = useCompositeListItem();
  const mergedRef = useMergedRefs(forwardedRef, listItemRef);

  const {
    disabled: contextDisabled,
    handleValueChange,
    name,
    value: openValues,
  } = useAccordionRootContext();

  const fallbackValue = useBaseUiId();

  const value = valueProp ?? fallbackValue;

  const disabled = disabledProp || contextDisabled;

  const isOpen = React.useMemo(() => {
    if (!openValues) {
      return false;
    }

    for (let i = 0; i < openValues.length; i += 1) {
      if (openValues[i] === value) {
        return true;
      }
    }

    return false;
  }, [openValues, value]);

  // Read the latest open state from stable event handlers without re-subscribing.
  const isOpenRef = React.useRef(isOpen);
  isOpenRef.current = isOpen;

  // Fired when the trigger is activated by pointer or keyboard. The native
  // `<details>` toggle is prevented on the `<summary>`, so open state is driven
  // entirely through Base UI state here.
  const handleTrigger = useStableCallback((event: React.MouseEvent) => {
    if (disabled) {
      return;
    }

    const nextOpen = !isOpenRef.current;
    const eventDetails = createChangeEventDetails(REASONS.triggerPress, event.nativeEvent);

    onOpenChangeProp?.(nextOpen, eventDetails);

    if (eventDetails.isCanceled) {
      return;
    }

    handleValueChange(value, nextOpen, eventDetails);
  });

  // Fired when the browser toggles the panel on its own (e.g. find-in-page
  // reveals content inside a closed item). Keeps controlled state in sync.
  const handleToggle = useStableCallback((event: React.SyntheticEvent<HTMLDetailsElement>) => {
    const detailsElement = event.currentTarget;
    const nextOpen = detailsElement.open;

    if (nextOpen === isOpenRef.current) {
      return;
    }

    const eventDetails = createChangeEventDetails(REASONS.none, event.nativeEvent);

    onOpenChangeProp?.(nextOpen, eventDetails);

    if (eventDetails.isCanceled) {
      detailsElement.open = isOpenRef.current;
      return;
    }

    handleValueChange(value, nextOpen, eventDetails);
  });

  const state: AccordionItemState = React.useMemo(
    () => ({
      index,
      disabled,
      open: isOpen,
    }),
    [disabled, index, isOpen],
  );

  const accordionItemContext: AccordionItemContext = React.useMemo(
    () => ({
      open: isOpen,
      disabled,
      handleTrigger,
      state,
    }),
    [isOpen, disabled, handleTrigger, state],
  );

  const element = useRenderElement('details', componentProps, {
    state,
    ref: mergedRef,
    props: [
      {
        open: isOpen,
        name,
        onToggle: handleToggle,
      },
      elementProps,
    ],
    stateAttributesMapping: accordionItemStateAttributesMapping,
  });

  return (
    <AccordionItemContext.Provider value={accordionItemContext}>
      {element}
    </AccordionItemContext.Provider>
  );
});

export interface AccordionItemState {
  /**
   * The item index.
   */
  index: number;
  /**
   * Whether the component should ignore user interaction.
   */
  disabled: boolean;
  /**
   * Whether the component is open.
   */
  open: boolean;
}

export interface AccordionItemProps extends BaseUIComponentProps<'details', AccordionItemState> {
  /**
   * A unique value that identifies this accordion item.
   * If no value is provided, a unique ID will be generated automatically.
   * Use when controlling the accordion programmatically, or to set an initial
   * open state.
   * @example
   * ```tsx
   * <Accordion.Root value={['a']}>
   *   <Accordion.Item value="a" /> // initially open
   *   <Accordion.Item value="b" /> // initially closed
   * </Accordion.Root>
   * ```
   */
  value?: any;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * Event handler called when the panel is opened or closed.
   */
  onOpenChange?:
    | ((open: boolean, eventDetails: AccordionItem.ChangeEventDetails) => void)
    | undefined;
}

export type AccordionItemChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none;

export type AccordionItemChangeEventDetails =
  BaseUIChangeEventDetails<AccordionItem.ChangeEventReason>;

export namespace AccordionItem {
  export type State = AccordionItemState;
  export type Props = AccordionItemProps;
  export type ChangeEventReason = AccordionItemChangeEventReason;
  export type ChangeEventDetails = AccordionItemChangeEventDetails;
}
