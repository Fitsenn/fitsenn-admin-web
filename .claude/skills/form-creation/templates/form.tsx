import { Button, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormRHF } from '@/components/form/form'
import { InputRHF } from '@/components/form/input'

import { formSchema, type FormData } from './form-name.schema'

type FormNameProps = {
  defaultValues?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<void>
}

const FormName = ({ defaultValues, onSubmit }: FormNameProps) => {
  const { t } = useTranslation()

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      ...defaultValues,
    },
  })

  const {
    formState: { isSubmitting },
  } = methods

  const handleSubmit = async (data: FormData) => {
    await onSubmit(data)
  }

  return (
    <FormRHF methods={methods} onSubmit={handleSubmit}>
      <Stack gap={4}>
        <InputRHF
          name="name"
          label={t('form.name')}
          placeholder={t('form.namePlaceholder')}
        />

        <InputRHF
          name="email"
          label={t('form.email')}
          type="email"
          placeholder={t('form.emailPlaceholder')}
        />

        <Button
          type="submit"
          colorPalette="brand"
          loading={isSubmitting}
          loadingText={t('common.saving')}
        >
          {t('common.save')}
        </Button>
      </Stack>
    </FormRHF>
  )
}

export { FormName }
