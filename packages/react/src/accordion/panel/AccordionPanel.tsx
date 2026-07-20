'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../internals/types';
import type { AccordionItemState } from '../item/AccordionItem';
import { useAccordionItemContext } from '../item/AccordionItemContext';
import { accordionItemStateAttributesMapping } from '../item/stateAttributesMapping';
import { useRenderElement } from '../../internals/useRenderElement';

/**
 * The collapsible panel with the accordion item contents.
 * Renders a `<div>` element.
 *
 * The panel is the `<details>` content, so it stays mounted while closed and
 * can be animated with modern CSS via the `::details-content` pseudo-element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */
export const AccordionPanel = React.forwardRef(function AccordionPanel(
  componentProps: AccordionPanel.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, style, ...elementProps } = componentProps;

  const { state } = useAccordionItemContext();

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: elementProps,
    stateAttributesMapping: accordionItemStateAttributesMapping,
  });

  return element;
});

export interface AccordionPanelState extends AccordionItemState {}

export interface AccordionPanelProps extends BaseUIComponentProps<'div', AccordionPanelState> {}

export namespace AccordionPanel {
  export type State = AccordionPanelState;
  export type Props = AccordionPanelProps;
}
