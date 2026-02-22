import type { HTMLChakraProps, InputProps } from '@chakra-ui/react';
import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Input } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { FieldWrapperRHF } from './field-wrapper';

export type InputRHFProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: ReactNode;
  helperText?: ReactNode;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  required?: boolean;
  containerSx?: HTMLChakraProps<'div'>;
} & InputProps;

const InputRHF = <TFieldValues extends FieldValues>({
  name,
  label,
  helperText,
  placeholder,
  type = 'text',
  disabled,
  required,
  containerSx = {},
  ...inputProps
}: InputRHFProps<TFieldValues>) => {
  const { register } = useFormContext<TFieldValues>();

  return (
    <FieldWrapperRHF
      required={required}
      disabled={disabled}
      helperText={helperText}
      label={label}
      name={name}
      {...containerSx}>
      <Input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          ...(type === 'number' && {
            setValueAs: (v: string) => (v === '' ? undefined : Number(v)),
          }),
        })}
        {...inputProps}
      />
    </FieldWrapperRHF>
  );
};

export { InputRHF };
