import type { HTMLChakraProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { useMemo } from 'react';

import { Select, createListCollection } from '@chakra-ui/react';
import { useController } from 'react-hook-form';

import { FieldWrapperRHF } from './field-wrapper';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectRHFProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  label?: ReactNode;
  helperText?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  options: SelectOption[];
  containerSx?: HTMLChakraProps<'div'>;
  showClearIcon?: boolean;
};

const SelectRHF = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  helperText,
  placeholder,
  disabled,
  required,
  multiple,
  options,
  containerSx = {},
  showClearIcon = false,
}: SelectRHFProps<TFieldValues>) => {
  const {
    field: { value, onChange, ref },
  } = useController({ name, control });

  const collection = useMemo(() => createListCollection({ items: options }), [options]);

  return (
    <FieldWrapperRHF
      required={required}
      disabled={disabled}
      helperText={helperText}
      label={label}
      name={name}
      {...containerSx}>
      <Select.Root
        collection={collection}
        multiple={multiple}
        value={multiple ? (value ?? []) : value ? [value] : []}
        onValueChange={(details) => onChange(multiple ? details.value : details.value[0])}
        disabled={disabled}>
        <Select.HiddenSelect ref={ref} />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder={placeholder} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            {showClearIcon && <Select.ClearTrigger />}
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </FieldWrapperRHF>
  );
};

export { SelectRHF };
