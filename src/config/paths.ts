export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  app: {
    dashboard: {
      getHref: () => '/dashboard',
    },
    users: {
      getHref: () => '/users',
    },
  },
} as const;
