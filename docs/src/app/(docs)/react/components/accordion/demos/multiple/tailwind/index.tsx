import * as React from 'react';
import { Accordion } from '@base-ui/react/accordion';

export default function ExampleAccordion() {
  return (
    <Accordion.Root
      multiple
      className="flex w-full max-w-80 flex-col border border-neutral-950 text-neutral-950 [interpolate-size:allow-keywords] dark:border-white dark:text-white"
    >
      <Accordion.Item className="[&::details-content]:[block-size:0] [&::details-content]:overflow-hidden [&::details-content]:[transition:block-size_150ms_ease-out,content-visibility_150ms_ease-out_allow-discrete] [&[open]::details-content]:[block-size:auto]">
        <Accordion.Trigger className="group flex w-full cursor-pointer list-none items-center justify-between gap-4 bg-transparent px-3 py-2 text-start text-sm font-normal text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-neutral-950 data-disabled:cursor-not-allowed dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:focus-visible:outline-white [&::-webkit-details-marker]:hidden">
          What is Base UI?
          <PlusIcon className="shrink-0 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-45" />
        </Accordion.Trigger>
        <Accordion.Panel className="text-sm">
          <div className="px-3 py-2">
            Base UI is a library of high-quality unstyled React components for design systems and
            web apps.
          </div>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item className="border-t border-neutral-950 [&::details-content]:[block-size:0] [&::details-content]:overflow-hidden [&::details-content]:[transition:block-size_150ms_ease-out,content-visibility_150ms_ease-out_allow-discrete] [&[open]::details-content]:[block-size:auto] dark:border-white">
        <Accordion.Trigger className="group flex w-full cursor-pointer list-none items-center justify-between gap-4 bg-transparent px-3 py-2 text-start text-sm font-normal text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-neutral-950 data-disabled:cursor-not-allowed dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:focus-visible:outline-white [&::-webkit-details-marker]:hidden">
          How do I get started?
          <PlusIcon className="shrink-0 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-45" />
        </Accordion.Trigger>
        <Accordion.Panel className="text-sm">
          <div className="px-3 py-2">
            Head to the “Quick start” guide in the docs. If you’ve used unstyled libraries before,
            you’ll feel at home.
          </div>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item className="border-t border-neutral-950 [&::details-content]:[block-size:0] [&::details-content]:overflow-hidden [&::details-content]:[transition:block-size_150ms_ease-out,content-visibility_150ms_ease-out_allow-discrete] [&[open]::details-content]:[block-size:auto] dark:border-white">
        <Accordion.Trigger className="group flex w-full cursor-pointer list-none items-center justify-between gap-4 bg-transparent px-3 py-2 text-start text-sm font-normal text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 focus-visible:relative focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-neutral-950 data-disabled:cursor-not-allowed dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:focus-visible:outline-white [&::-webkit-details-marker]:hidden">
          Can I use it for my project?
          <PlusIcon className="shrink-0 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-45" />
        </Accordion.Trigger>
        <Accordion.Panel className="text-sm">
          <div className="px-3 py-2">Of course! Base UI is free and open source.</div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      {...props}
      style={{ display: 'block', ...props.style }}
    >
      <path d="M1.5 8h13M8 14.5v-13" />
    </svg>
  );
}
