"use client";

import { FormSelectbox } from "@/types/ui";
import React from "react";

export default function SelectBox({
  options,
  selected,
  onChange,
  className,
  disabled,
}: FormSelectbox) {
  return (
    <div
      className={`relative inline-block rounded  border shadow p-2 border-gray-400 hover:border-gray-500 h-10  
        ${className || "min-w-32"} ${disabled ? "bg-gray-200" : ""}`}
    >
      <select
        value={selected}
        onChange={onChange}
        disabled={disabled}
        className="block appearance-none w-full bg-whitepl-1  pr-8 h-full  leading-tight focus:outline-none focus:shadow-outline text-gray-700 "
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.05 6.884 4.636 8.293l4.657 4.657z" />
        </svg>
      </div>
    </div>
  );
}
