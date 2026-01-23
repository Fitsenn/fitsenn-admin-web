import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { ZodType, z } from 'zod';

import { FormProvider } from 'react-hook-form';

type FormProps<TFormValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  methods: UseFormReturn<TFormValues>;
  children: ReactNode;
};

const FormRHF = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Schema extends ZodType<any, any, any>,
  TFormValues extends FieldValues = z.infer<Schema>,
>({
  onSubmit,
  children,
  methods,
}: FormProps<TFormValues>) => {
  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
};

export { FormRHF };
