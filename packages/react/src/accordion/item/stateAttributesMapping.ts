import type { StateAttributesMapping } from '../../internals/getStateAttributesProps';
import {
  collapsibleOpenStateMapping,
  triggerOpenStateMapping,
} from '../../utils/collapsibleOpenStateMapping';
import type { AccordionItemState } from './AccordionItem';
import { AccordionItemDataAttributes } from './AccordionItemDataAttributes';

/**
 * Maps the shared item state onto data attributes for the `<details>` panel
 * parts (`data-open` / `data-closed`, `data-index`, `data-disabled`).
 */
export const accordionItemStateAttributesMapping: StateAttributesMapping<AccordionItemState> = {
  ...collapsibleOpenStateMapping,
  index: (value) => {
    return Number.isInteger(value) ? { [AccordionItemDataAttributes.index]: String(value) } : null;
  },
};

/**
 * Maps the shared item state onto the trigger's data attributes. The trigger
 * uses `data-panel-open` (rather than `data-open`) and omits `data-index`.
 */
export const accordionTriggerStateAttributesMapping: StateAttributesMapping<AccordionItemState> = {
  ...triggerOpenStateMapping,
  index: () => null,
};
