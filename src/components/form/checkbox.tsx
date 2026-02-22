import type { HTMLChakraProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Checkbox } from '@chakra-ui/react';
import { useController } from 'react-hook-form';

import { FieldWrapperRHF } from './field-wrapper';

export type CheckboxOption = {
  value: string;
  label: string;
};

export type CheckboxRHFProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: ReactNode;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  containerSx?: HTMLChakraProps<'div'>;
};

const CheckboxRHF = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  helperText,
  disabled,
  required,
  containerSx = {},
}: CheckboxRHFProps<TFieldValues>) => {
  const {
    field: { value, onChange, ref },
  } = useController({ name, control });

  return (
    <FieldWrapperRHF
      required={required}
      disabled={disabled}
      helperText={helperText}
      name={name}
      {...containerSx}>
      <Checkbox.Root
        checked={!!value}
        onCheckedChange={(e) => onChange(!!e.checked)}
        disabled={disabled}
        ref={ref}>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        {label && <Checkbox.Label>{label}</Checkbox.Label>}
      </Checkbox.Root>
    </FieldWrapperRHF>
  );
};

export { CheckboxRHF };
