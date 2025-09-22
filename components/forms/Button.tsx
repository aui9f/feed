export enum variantEnum {
  primary = "primary",
  secondary = "secondary",
  success = "success",
  danger = "danger",
  warning = "warning",
  info = "info",
  light = "light",
  dark = "dark",
}

interface IButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: variantEnum;
}

export default function Button({
  type = "button",
  disabled = false,
  children,
  onClick,
  variant = variantEnum.light,
}: IButtonProps) {
  const baseStyle = "h-10 rounded-sm p-2";
  const variants = {
    primary: "bg-brand-primary bg-blue-400 text-white ",
    secondary: "bg-gray-300 text-black ",
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white ",
    warning: "bg-yellow-400 text-black ",
    info: "bg-sky-400 text-white",
    light: "bg-white text-black border",
    dark: "bg-gray-900 text-white ",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} disabled:bg-gray-400 disabled:text-white`}
    >
      {children}
    </button>
  );
}
