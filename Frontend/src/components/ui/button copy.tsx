import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import  type {VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import  { buttonVariants } from "./button-varioant";


interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      // disabled={loading || props.disabled}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button };
