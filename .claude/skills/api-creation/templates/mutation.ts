import type { ResourceType } from '@/types/resource'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

// Types
type UpdateResourceParams = {
  resourceId: string
  data: Partial<ResourceType>
}

// API function (private)
const updateResource = async ({ resourceId, data }: UpdateResourceParams): Promise<ResourceType> => {
  const { data: resource, error } = await supabase
    .from('resources')
    .update(data)
    .eq('id', resourceId)
    .select()
    .single()

  if (error) throw error
  return resource
}

// Hook (main export)
export const useUpdateResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateResource,
    onSuccess: (resource) => {
      // Invalidate detail query
      queryClient.invalidateQueries({ queryKey: ['resources', resource.id] })
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['resources', 'list'] })
    },
  })
}
