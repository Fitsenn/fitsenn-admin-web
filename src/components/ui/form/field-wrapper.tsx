import type { HTMLChakraProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import { Field as ChakraField } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

type FieldWrapperRHFProps<TFieldValues extends FieldValues> = {
  label?: ReactNode;
  name: FieldPath<TFieldValues>;
  helperText?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  containerSx?: HTMLChakraProps<'div'>;
  children: ReactNode;
};

const FieldWrapperRHF = <TFieldValues extends FieldValues>({
  label,
  helperText,
  disabled,
  required,
  containerSx,
  name,
  children,
}: FieldWrapperRHFProps<TFieldValues>) => {
  const {
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = errors[name];
  const isInvalid = !!error;
  const errorMessage = error?.message as string | undefined;

  return (
    <ChakraField.Root invalid={isInvalid} required={required} disabled={disabled} gap="0.5" mb="2" {...containerSx}>
      {label && <ChakraField.Label>{label}</ChakraField.Label>}
      {children}
      {helperText && !isInvalid && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
      {isInvalid && errorMessage && <ChakraField.ErrorText>{errorMessage}</ChakraField.ErrorText>}
    </ChakraField.Root>
  );
};
export { FieldWrapperRHF };
