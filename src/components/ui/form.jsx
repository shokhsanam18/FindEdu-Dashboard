import React, { createContext, useContext } from "react";
import { Controller, FormProvider, useFormContext, useFormState } from "react-hook-form";
import { Slot } from "@radix-ui/react-slot";
import { Label } from "../../components/ui/label";

const Form = FormProvider;
const FormFieldContext = createContext({});
const FormItemContext = createContext({});

const FormField = ({ ...props }) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) throw new Error("useFormField must be used within <FormField>");

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItem = ({ className, ...props }) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={`grid gap-2 ${className}`} {...props} />
    </FormItemContext.Provider>
  );
};

const FormLabel = ({ className, ...props }) => {
  const { error, formItemId } = useFormField();

  return (
    <Label htmlFor={formItemId} className={`text-gray-700 ${error ? "text-red-500" : ""} ${className}`} {...props} />
  );
};

const FormControl = ({ ...props }) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
};

const FormDescription = ({ className, ...props }) => {
  const { formDescriptionId } = useFormField();

  return <p id={formDescriptionId} className={`text-sm text-gray-500 ${className}`} {...props} />;
};

const FormMessage = ({ className, ...props }) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : props.children;

  return body ? <p id={formMessageId} className={`text-sm text-red-500 ${className}`} {...props}>{body}</p> : null;
};

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField };
