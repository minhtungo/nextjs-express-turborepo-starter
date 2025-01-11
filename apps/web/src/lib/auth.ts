import { apiPaths } from '@/config/paths';
import { api } from '@/lib/api';
import { SessionUser } from '@repo/validation/user';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const getUser = async (): Promise<SessionUser> => {
  const result = await api.get<SessionUser>(apiPaths.user.getCurrentUser);

  return result.data;
};

export const userQueryKey = ['user'] as const;

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });
};

export const useUser = () => useQuery(getUserQueryOptions());

// export const useAuth = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { data: user, isLoading, isError } = useUser();

//   useEffect(() => {
//     if (!isLoading && !user && isError) {
//       router.push(paths.auth.signIn.getHref(pathname));
//     }
//   }, [user, isLoading, isError, pathname]);

//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//   };
// };
