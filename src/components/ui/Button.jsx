import { cn } from "../../lib/cn.js";

const variants = {
  primary: "bg-primary text-primary-fg shadow-sm hover:brightness-110",
  outline: "border border-line-strong bg-surface text-fg hover:bg-surface-2",
  ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
};

const sizes = {
  sm: "h-9 px-3 text-sm pointer-coarse:h-11 pointer-coarse:min-w-11",
  md: "h-10 px-4 text-sm pointer-coarse:h-11",
  icon: "size-9 pointer-coarse:size-11",
};

export const buttonClass = ({ variant = "primary", size = "md" } = {}, className) =>
  cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-[background-color,color,filter,border-color] duration-200 disabled:pointer-events-none disabled:opacity-55 [&_svg]:size-4 [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
    className
  );

const Button = ({ variant, size, className, type = "button", ...props }) => (
  <button className={buttonClass({ variant, size }, className)} type={type} {...props} />
);

export default Button;
