export type CompanySettings = {
  id: string;
  name: string;
  code: string;
  logo_url: string | null;
};

export type CompanyUser = {
  user_id: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  };
  roles: string[];
  joined_at: string;
};

export type InviteUserResult = {
  status: 'added' | 'not_found' | 'already_member';
  user_id?: string;
  message?: string;
};
