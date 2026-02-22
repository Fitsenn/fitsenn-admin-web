import type { HTMLChakraProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Switch } from '@chakra-ui/react';
import { useController } from 'react-hook-form';

import { FieldWrapperRHF } from './field-wrapper';

export type SwitchRHFProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: ReactNode;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  containerSx?: HTMLChakraProps<'div'>;
};

const SwitchRHF = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  helperText,
  disabled,
  required,
  containerSx = {},
}: SwitchRHFProps<TFieldValues>) => {
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
      <Switch.Root
        checked={!!value}
        onCheckedChange={(e) => onChange(!!e.checked)}
        disabled={disabled}
        ref={ref}>
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        {label && <Switch.Label>{label}</Switch.Label>}
      </Switch.Root>
    </FieldWrapperRHF>
  );
};

export { SwitchRHF };
