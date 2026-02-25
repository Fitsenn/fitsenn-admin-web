import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type DeleteUserMembershipInput = {
  membershipId: string;
  userId: string;
  companyId: string;
};

const deleteUserMembership = async ({ membershipId }: DeleteUserMembershipInput) => {
  const { error } = await supabase
    .from('user_memberships')
    .delete()
    .eq('id', membershipId);

  if (error) throw error;
};

export const useDeleteUserMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserMembership,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['user-memberships', variables.userId, variables.companyId],
      });
    },
  });
};
