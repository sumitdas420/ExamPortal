// components/ui/combobox.tsx
'use client';

import * as React from "react";

// Import any @radix-ui/react-popover or primitive as needed.

export function Combobox(props: {
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
  options: { label: string; value: string }[];
  multiple?: boolean;
  placeholder?: string;
  className?: string;
}) {
  // Simplified render: render a <select> for now (customize/extend as needed)
  return (
    <select
      multiple={props.multiple}
      value={props.value}
      onChange={e => {
        if (props.multiple) {
          const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
          props.onValueChange(selected);
        } else {
          props.onValueChange(e.target.value);
        }
      }}
      className={props.className}
    >
      <option value="">{props.placeholder || "Select..."}</option>
      {props.options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
