"use client";
import { FormRadio } from "@/types/ui";

export default function Radio({
  name,
  options,
  selected,
  onChange,
  disabled,
}: FormRadio) {
  return (
    <>
      {options.map((option) => (
        <label key={option.id} className="flex items-center gap-2">
          <div className="relative flex items-center cursor-pointer">
            <input
              name={name}
              type="radio"
              value={option.id}
              className={`w-6 h-6 transition-all border rounded shadow appearance-none cursor-pointer peer hover:shadow-md border-sky-600 checked:bg-sky-600 checked:border-sky-600 disabled:bg-gray-200 disabled:border-gray-200`}
              checked={selected === option.id}
              onChange={onChange}
              disabled={disabled}
            />
            <span className="absolute text-white transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </div>
          <p className="">{option.label}</p>
        </label>
      ))}
    </>
  );
}
