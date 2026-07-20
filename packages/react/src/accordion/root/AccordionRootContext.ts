'use client';
import * as React from 'react';
import type { AccordionRoot } from './AccordionRoot';

export interface AccordionRootContext<Value = any> {
  disabled: boolean;
  handleValueChange: (
    newValue: AccordionRoot.Value<Value>[number],
    nextOpen: boolean,
    eventDetails: AccordionRoot.ChangeEventDetails,
  ) => void;
  /**
   * Whether multiple items can be open at the same time.
   */
  multiple: boolean;
  /**
   * A shared `name` applied to each item's `<details>` element so the browser
   * enforces a single open item natively. `undefined` when `multiple` is `true`.
   */
  name: string | undefined;
  state: AccordionRoot.State<Value>;
  value: AccordionRoot.Value<Value>;
}

export const AccordionRootContext = React.createContext<AccordionRootContext<any> | undefined>(
  undefined,
);

export function useAccordionRootContext<Value = any>() {
  const context = React.useContext<AccordionRootContext<Value> | undefined>(AccordionRootContext);
  if (context === undefined) {
    throw new Error(
      'Base UI: AccordionRootContext is missing. Accordion parts must be placed within <Accordion.Root>.',
    );
  }
  return context;
}
