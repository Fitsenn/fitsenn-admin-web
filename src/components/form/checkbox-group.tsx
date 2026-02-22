import type { HTMLChakraProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Checkbox, Stack } from '@chakra-ui/react';
import { useController } from 'react-hook-form';

import type { CheckboxOption } from './checkbox';

import { FieldWrapperRHF } from './field-wrapper';

export type CheckboxGroupRHFProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  options: CheckboxOption[];
  label?: ReactNode;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  containerSx?: HTMLChakraProps<'div'>;
};

const CheckboxGroupRHF = <TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  helperText,
  disabled,
  required,
  containerSx = {},
}: CheckboxGroupRHFProps<TFieldValues>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const selectedValues = (value as string[]) ?? [];

  const handleToggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, optionValue]);
    } else {
      onChange(selectedValues.filter((v) => v !== optionValue));
    }
  };

  return (
    <FieldWrapperRHF
      required={required}
      disabled={disabled}
      helperText={helperText}
      label={label}
      name={name}
      {...containerSx}>
      <Stack gap={2}>
        {options.map((option) => (
          <Checkbox.Root
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(e) => handleToggle(option.value, !!e.checked)}
            disabled={disabled}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{option.label}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Stack>
    </FieldWrapperRHF>
  );
};

export { CheckboxGroupRHF };
