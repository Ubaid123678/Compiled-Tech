"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller, ControllerRenderProps, Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

type FormFieldProps<T extends FieldValues> = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  options?: readonly string[];
  hint?: string;
  error?: string;
  className?: string;
  placeholder?: string;
  /** Declarative WebMCP hint for agents reading the raw markup. */
  toolDescription?: string;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
};

function renderInput<T extends FieldValues>({
  field,
  name,
  type,
  placeholder,
  errorMessage,
  showError,
  ariaInvalid,
  describedBy,
  toolDescription,
}: {
  field: ControllerRenderProps<T>;
  name: string;
  type: string;
  placeholder?: string;
  errorMessage: string | undefined;
  showError: boolean;
  ariaInvalid: boolean;
  describedBy: string | undefined;
  toolDescription?: string;
}) {
  return (
    <>
      <Input
        ref={field.ref}
        id={name}
        type={type}
        toolparamdescription={toolDescription}
        value={field.value ?? ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
        className={cn(
          "bg-night border-line text-frost placeholder:text-mist/40 focus:border-steel",
          ariaInvalid && "border-red"
        )}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
      />
      {showError && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red" role="alert">
          {errorMessage}
        </p>
      )}
    </>
  );
}

function renderTextarea<T extends FieldValues>({
  field,
  name,
  placeholder,
  errorMessage,
  showError,
  ariaInvalid,
  describedBy,
  toolDescription,
}: {
  field: ControllerRenderProps<T>;
  name: string;
  placeholder?: string;
  errorMessage: string | undefined;
  showError: boolean;
  ariaInvalid: boolean;
  describedBy: string | undefined;
  toolDescription?: string;
}) {
  return (
    <>
      <Textarea
        ref={field.ref}
        id={name}
        toolparamdescription={toolDescription}
        value={field.value ?? ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder={placeholder}
        className={cn(
          "bg-night border-line text-frost placeholder:text-mist/40 focus:border-steel",
          ariaInvalid && "border-red"
        )}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        rows={5}
      />
      {showError && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red" role="alert">
          {errorMessage}
        </p>
      )}
    </>
  );
}

function renderSelect<T extends FieldValues>({
  field,
  name,
  options,
  errorMessage,
  showError,
  ariaInvalid,
  describedBy,
  toolDescription,
}: {
  field: ControllerRenderProps<T>;
  name: string;
  options: readonly string[];
  errorMessage: string | undefined;
  showError: boolean;
  ariaInvalid: boolean;
  describedBy: string | undefined;
  toolDescription?: string;
}) {
  return (
    <>
      {/* Radix renders a <button> trigger, which cannot carry tool* attributes
          meaningfully, so the hint lives on the field wrapper where a static
          parser still finds it next to the control. */}
      <div toolparamdescription={toolDescription}>
      <Select
        onValueChange={field.onChange as (v: string) => void}
        defaultValue={field.value ?? ""}
      >
        <SelectTrigger
          ref={field.ref}
          className={cn(
            "bg-night border-line text-frost placeholder:text-mist/40 focus:border-steel",
            ariaInvalid && "border-red"
          )}
          aria-invalid={ariaInvalid}
          aria-describedby={describedBy}
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
      </div>
      {showError && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red" role="alert">
          {errorMessage}
        </p>
      )}
    </>
  );
}

export function FormField<T extends FieldValues>({
  name,
  label,
  type = "text",
  options,
  hint,
  error,
  className,
  placeholder,
  toolDescription,
  control,
  rules,
}: FormFieldProps<T>) {
  const errorMessage = error;

  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={name} className="mb-2 block font-display text-[0.78rem] uppercase tracking-widest text-steel">
        {label}
      </Label>
      <Controller
        name={name as Path<T>}
        control={control}
        rules={rules}
        render={({ field, fieldState }: { field: ControllerRenderProps<T>; fieldState: { invalid: boolean; isTouched: boolean } }) => {
          const showError = fieldState.invalid && fieldState.isTouched;
          const ariaInvalid = showError;
          const describedBy = showError ? `${name}-error` : hint ? `${name}-hint` : undefined;

          if (type === "select" && options) {
            return renderSelect({ field, name, options, errorMessage, showError, ariaInvalid, describedBy, toolDescription });
          }

          if (type === "textarea") {
            return renderTextarea({ field, name, placeholder, errorMessage, showError, ariaInvalid, describedBy, toolDescription });
          }

          return renderInput({ field, name, type, placeholder, errorMessage, showError, ariaInvalid, describedBy, toolDescription });
        }}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-sm text-mist/50">
          {hint}
        </p>
      )}
    </div>
  );
}