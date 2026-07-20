'use client';
import * as React from 'react';
import { useControlled } from '@base-ui/utils/useControlled';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { BaseUIComponentProps } from '../../internals/types';
import { CompositeList } from '../../internals/composite/list/CompositeList';
import { AccordionRootContext } from './AccordionRootContext';
import { useRenderElement } from '../../internals/useRenderElement';
import { useBaseUiId } from '../../internals/useBaseUiId';
import { type BaseUIChangeEventDetails } from '../../internals/createBaseUIEventDetails';
import { REASONS } from '../../internals/reasons';

const rootStateAttributesMapping = {
  value: () => null,
};

/**
 * Groups all parts of the accordion.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */
export const AccordionRoot = React.forwardRef(function AccordionRoot<Value = any>(
  componentProps: AccordionRoot.Props<Value>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    render,
    className,
    disabled = false,
    onValueChange,
    multiple = false,
    value: valueProp,
    defaultValue: defaultValueProp,
    style,
    ...elementProps
  } = componentProps;

  // memoized to allow omitting both defaultValue and value
  // which would otherwise trigger a warning in useControlled
  const defaultValue = React.useMemo(() => {
    if (valueProp === undefined) {
      return defaultValueProp ?? [];
    }

    return undefined;
  }, [valueProp, defaultValueProp]);

  const accordionItemRefs = React.useRef<(HTMLElement | null)[]>([]);

  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'Accordion',
    state: 'value',
  });

  const handleValueChange = useStableCallback(
    (
      newValue: AccordionRoot.Value<Value>[number],
      nextOpen: boolean,
      details: AccordionRoot.ChangeEventDetails,
    ) => {
      let nextValue: AccordionRoot.Value<Value>;

      if (!multiple) {
        // The native `<details name>` grouping keeps siblings closed, so a single
        // open value is all the state needs to track.
        nextValue = nextOpen ? [newValue] : [];
      } else if (nextOpen) {
        nextValue = value.concat(newValue);
      } else {
        nextValue = value.filter((v) => v !== newValue);
      }

      onValueChange?.(nextValue, details);

      if (details.isCanceled) {
        return;
      }

      setValue(nextValue);
    },
  );

  const state: AccordionRoot.State<Value> = React.useMemo(
    () => ({
      value,
      disabled,
    }),
    [value, disabled],
  );

  // A stable, shared name that groups the items' `<details>` elements so the
  // browser enforces exclusivity when `multiple` is `false`.
  const exclusiveName = useBaseUiId();

  const contextValue: AccordionRootContext<Value> = React.useMemo(
    () => ({
      disabled,
      handleValueChange,
      multiple,
      name: multiple ? undefined : exclusiveName,
      state,
      value,
    }),
    [disabled, handleValueChange, multiple, exclusiveName, state, value],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: elementProps,
    stateAttributesMapping: rootStateAttributesMapping,
  });

  return (
    <AccordionRootContext.Provider value={contextValue}>
      <CompositeList elementsRef={accordionItemRefs}>{element}</CompositeList>
    </AccordionRootContext.Provider>
  );
}) as {
  <Value = any>(props: AccordionRoot.Props<Value>): React.JSX.Element;
};

export type AccordionValue<Value = any> = Value[];

export interface AccordionRootState<Value = any> {
  /**
   * The current value.
   */
  value: AccordionValue<Value>;
  /**
   * Whether the component should ignore user interaction.
   */
  disabled: boolean;
}

export interface AccordionRootProps<Value = any> extends BaseUIComponentProps<
  'div',
  AccordionRoot.State<Value>
> {
  /**
   * The controlled value of the item(s) that should be expanded.
   *
   * To render an uncontrolled accordion, use the `defaultValue` prop instead.
   */
  value?: AccordionValue<Value> | undefined;
  /**
   * The uncontrolled value of the item(s) that should be initially expanded.
   *
   * To render a controlled accordion, use the `value` prop instead.
   */
  defaultValue?: AccordionValue<Value> | undefined;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * Event handler called when an accordion item is expanded or collapsed.
   * Provides the new value as an argument.
   */
  onValueChange?:
    | ((value: AccordionValue<Value>, eventDetails: AccordionRootChangeEventDetails) => void)
    | undefined;
  /**
   * Whether multiple items can be open at the same time.
   * @default false
   */
  multiple?: boolean | undefined;
}

export type AccordionRootChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none;

export type AccordionRootChangeEventDetails =
  BaseUIChangeEventDetails<AccordionRoot.ChangeEventReason>;

export namespace AccordionRoot {
  export type Value<TValue = any> = AccordionValue<TValue>;
  export type State<TValue = any> = AccordionRootState<TValue>;
  export type Props<TValue = any> = AccordionRootProps<TValue>;
  export type ChangeEventReason = AccordionRootChangeEventReason;
  export type ChangeEventDetails = AccordionRootChangeEventDetails;
}
