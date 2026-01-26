import type { ResourceType } from '@/types/resource'

import { queryOptions, useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

// Types
type GetResourceParams = {
  resourceId: string
}

// API function (private)
const getResource = async ({ resourceId }: GetResourceParams): Promise<ResourceType> => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .single()

  if (error) throw error
  return data
}

// Query options (exported for prefetching)
export const getResourceQueryOptions = (resourceId: string) => {
  return queryOptions({
    queryKey: ['resources', resourceId],
    queryFn: () => getResource({ resourceId }),
  })
}

// Hook (main export)
export const useResource = (resourceId: string) => {
  return useQuery(getResourceQueryOptions(resourceId))
}
