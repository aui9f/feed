import { InputHTMLAttributes } from "react";

export type FormOption = {
  id: string;
  label: string;
};

// 체크박스, 라디오 버튼, 셀렉트 등 여러 값을 선택하는 컴포넌트의 공통 프롭
export interface FormMultiProp {
  name: string;
  options: FormOption[];
  selected: string[] | string;
  className?: string;
  disabled?: boolean;
}

// 텍스트 입력 필드나 단일 선택 컴포넌트의 공통 프롭
export interface FormSingleProp {
  name: string;
  value: string | number;
  className?: string;
  error?: string;
}

export interface FormRadio extends FormMultiProp {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface FormSelectbox extends FormMultiProp {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
export interface FormCheckbox extends FormMultiProp {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FormTextarea
  extends Omit<FormSingleProp, "name" | "value">,
    InputHTMLAttributes<HTMLTextAreaElement> {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface FormInput
  extends Omit<FormSingleProp, "name" | "value">,
    InputHTMLAttributes<HTMLInputElement> {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
