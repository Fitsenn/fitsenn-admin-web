import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { ZodType, z } from 'zod';

import { FormProvider } from 'react-hook-form';

type FormProps<TFormValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  methods: UseFormReturn<TFormValues>;
  children: ReactNode;
  id?: string;
};

const FormRHF = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Schema extends ZodType<any, any, any>,
  TFormValues extends FieldValues = z.infer<Schema>,
>({
  onSubmit,
  children,
  methods,
  id,
}: FormProps<TFormValues>) => {
  return (
    <FormProvider {...methods}>
      <form id={id} noValidate onSubmit={methods.handleSubmit(onSubmit)} style={{ height: '100%', overflow: 'auto' }}>
        {children}
      </form>
    </FormProvider>
  );
};

export { FormRHF };
