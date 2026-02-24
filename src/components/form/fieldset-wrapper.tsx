import type { ReactNode } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';

import { Fieldset } from '@chakra-ui/react';
import { get, useFormContext } from 'react-hook-form';

type FieldsetWrapperRHFProps<TFieldValues extends FieldValues> = {
  label?: ReactNode;
  name: FieldPath<TFieldValues>;
  helperText?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
};

const FieldsetWrapperRHF = <TFieldValues extends FieldValues>({
  label,
  helperText,
  disabled,
  name,
  children,
}: FieldsetWrapperRHFProps<TFieldValues>) => {
  const {
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = get(errors, name);
  const isInvalid = !!error;
  const errorMessage = error?.message as string | undefined;

  return (
    <Fieldset.Root invalid={isInvalid} disabled={disabled} gap="0.5" mb="2">
      {label && (
        <Fieldset.Legend textStyle="sm" mb="1.5">
          {label}
        </Fieldset.Legend>
      )}
      {children}
      {helperText && !isInvalid && <Fieldset.HelperText>{helperText}</Fieldset.HelperText>}
      {isInvalid && errorMessage && <Fieldset.ErrorText>{errorMessage}</Fieldset.ErrorText>}
    </Fieldset.Root>
  );
};

export { FieldsetWrapperRHF };
