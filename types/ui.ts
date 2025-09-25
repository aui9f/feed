import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export type FormOption = {
  id: string;
  label: string;
};

// 체크박스, 라디오 버튼, 셀렉트 등 여러 값을 선택하는 컴포넌트의 공통 프롭
export interface FormMultiProp<T = string[] | string> {
  name: string;
  options: FormOption[];
  selected: T;
  className?: string;
  disabled?: boolean;
}

// 텍스트 입력 필드나 단일 선택 컴포넌트의 공통 프롭
export interface FormSingleProp {
  //name, value => 중복되서 삭제
  className?: string;
  error?: string;
}

// 내부적으론 type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void; 이렇게 작성되어있지만,
// 직관적이게 보기 위해 아래와 같은 타입별로 나눔
export interface FormRadio extends FormMultiProp<string> {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export interface FormCheckbox extends FormMultiProp<string[]> {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export interface FormSelectbox extends FormMultiProp<string> {
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

export interface FormTextarea
  extends FormSingleProp,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export interface FormInput
  extends FormSingleProp,
    InputHTMLAttributes<HTMLInputElement> {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
