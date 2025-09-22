import { FormInput } from "@/types/ui";

export default function Input({
  name,
  onChange,
  value,
  className,
  ...rest //  기본 스타일 외에 필요한 모든 HTML 속성 사용
}: FormInput) {
  return (
    <>
      <input
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
        className={`rounded-sm border border-gray-400 h-10 px-1 w-full ${className}`}
      />
    </>
  );
}
