'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../internals/types';
import type { AccordionItemState } from '../item/AccordionItem';
import { useAccordionItemContext } from '../item/AccordionItemContext';
import { accordionTriggerStateAttributesMapping } from '../item/stateAttributesMapping';
import { useRenderElement } from '../../internals/useRenderElement';

/**
 * A summary that labels and toggles the corresponding panel.
 * Renders a `<summary>` element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */
export const AccordionTrigger = React.forwardRef(function AccordionTrigger(
  componentProps: AccordionTrigger.Props,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const { className, render, style, ...elementProps } = componentProps;

  const { state, disabled, handleTrigger } = useAccordionItemContext();

  const props = {
    'aria-disabled': disabled || undefined,
    onClick(event: React.MouseEvent) {
      // Drive the `<details>` open state through Base UI rather than the native
      // toggle so controlled state, cancellation, and callbacks stay authoritative.
      event.preventDefault();
      handleTrigger(event);
    },
  };

  const element = useRenderElement('summary', componentProps, {
    state,
    ref: forwardedRef,
    props: [props, elementProps],
    stateAttributesMapping: accordionTriggerStateAttributesMapping,
  });

  return element;
});

export interface AccordionTriggerState extends AccordionItemState {}

export interface AccordionTriggerProps extends BaseUIComponentProps<
  'summary',
  AccordionTriggerState
> {}

export namespace AccordionTrigger {
  export type State = AccordionTriggerState;
  export type Props = AccordionTriggerProps;
}
