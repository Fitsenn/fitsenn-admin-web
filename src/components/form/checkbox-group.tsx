import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { CheckboxOption } from './checkbox';

import { Checkbox, Stack } from '@chakra-ui/react';
import { useController } from 'react-hook-form';

import { FieldsetWrapperRHF } from './fieldset-wrapper';

export type CheckboxGroupRHFProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  options: CheckboxOption[];
  label?: ReactNode;
  helperText?: ReactNode;
  disabled?: boolean;
};

const CheckboxGroupRHF = <TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  helperText,
  disabled,
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
    <FieldsetWrapperRHF name={name} label={label} helperText={helperText} disabled={disabled}>
      <Stack gap={2} mt={0.5}>
        {options.map((option) => (
          <Checkbox.Root
            key={option.value}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(e) => handleToggle(option.value, !!e.checked)}
            disabled={disabled}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{option.label}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Stack>
    </FieldsetWrapperRHF>
  );
};

export { CheckboxGroupRHF };
