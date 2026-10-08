"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";

type FormFieldProps<T extends FieldValues> = ControllerProps<T> & {
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  options?: string[];
  hint?: string;
  error?: string;
  className?: string;
};

export function FormField<T extends FieldValues>({
  name,
  label,
  type = "text",
  options,
  hint,
  error,
  className,
  control,
  rules,
  ...props
}: FormFieldProps<T> & { control: any }) {
  const errorMessage = error;

  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={name as string} className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2 block">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value, ref }, fieldState: { invalid, isTouched } }) => {
          const showError = invalid && isTouched;
          const ariaInvalid = showError;
          const describedBy = showError ? `${name}-error` : hint ? `${name}-hint` : undefined;

          if (type === "select" && options) {
            return (
              <>
                <Select
                  onValueChange={onChange as (v: string) => void}
                  defaultValue={value as string}
                >
                  <SelectTrigger
                    ref={ref as any}
                    className={cn(
                      "bg-night border-line text-frost placeholder:text-mist/40 focus:border-steel data-[error]:border-red",
                      ariaInvalid && "border-red"
                    )}
                    aria-invalid={ariaInvalid}
                    aria-describedby={describedBy}
                    {...props}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showError && (
                  <p id={`${name}-error`} className="mt-1.5 text-sm text-red" role="alert">
                    {errorMessage}
                  </p>
                )}
                {hint && !showError && (
                  <p id={`${name}-hint`} className="mt-1.5 text-sm text-mist/50">
                    {hint}
                  </p>
                )}
              </>
            );
          }

          if (type === "textarea") {
            return (
              <>
                <Textarea
                  ref={ref as any}
                  id={name as string}
                  value={value as string}
                  onChange={onChange as any}
                  onBlur={onBlur}
                  className={cn(
                    "bg-night border-line text-frost placeholder:text-mist/40 focus:border-steel",
                    ariaInvalid && "border-red"
                  )}
                  aria-invalid={ariaInvalid}
                  aria-describedby={describedBy}
                  rows={5}
                  {...props}
                />
                {showError && (
                  <p id={`${name}-error`} className="mt-1.5 text-sm text-red" role="alert">
                    {errorMessage}
                  </p>
                )}
                {hint && !showError && (
                  <p id={`${name}-hint`} className="mt-1.5 text-sm text-mist/50">
                    {hint}
                  </p>
                )}
              </>
            );
          }

          return (
            <>
              <Input
                ref={ref as any}
                id={name as string}
                type={type}
                value={value as string}
                onChange={onChange as any}
                onBlur={onBlur}
                className={cn(
                  "bg-night border-line text-frost placeholder:text-mist/40 focus:border-steel",
                  ariaInvalid && "border-red"
                )}
                aria-invalid={ariaInvalid}
                aria-describedby={describedBy}
                {...props}
              />
              {showError && (
                <p id={`${name}-error`} className="mt-1.5 text-sm text-red" role="alert">
                  {errorMessage}
                </p>
              )}
              {hint && !showError && (
                <p id={`${name}-hint`} className="mt-1.5 text-sm text-mist/50">
                  {hint}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}