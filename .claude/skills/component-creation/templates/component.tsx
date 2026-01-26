import { Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type ComponentNameProps = {
  // Required props
  title: string
  // Optional props
  description?: string
  // Event handlers
  onClick?: () => void
}

const ComponentName = ({ title, description, onClick }: ComponentNameProps) => {
  const { t } = useTranslation()

  // Hooks

  // Queries/Mutations

  // Event handlers
  const handleClick = () => {
    onClick?.()
  }

  // Early returns
  // if (!data) return null

  // Main render
  return (
    <Box onClick={handleClick}>
      {/* Component content */}
    </Box>
  )
}

export { ComponentName }
