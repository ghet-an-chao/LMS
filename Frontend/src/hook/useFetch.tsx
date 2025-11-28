// src/hooks/useFetch.tsx
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/http";

type UseFetchOptions<T> = Omit<
  UseQueryOptions<T, unknown, T, any[]>,
  "queryKey" | "queryFn"
>;

interface UseFetchParams<T> {
  key: any[];      // queryKey, ví dụ ["courses"] hoặc ["course", id]
  url: string;     // endpoint, ví dụ "/courses" hoặc `/courses/${id}`
  options?: UseFetchOptions<T>;
}

/**
 * Hook GET dùng chung:
 * const { data, isLoading, error } = useFetch<Course[]>({
 *   key: ["courses"],
 *   url: "/courses",
 * });
 */
export function useFetch<T = unknown>({ key, url, options }: UseFetchParams<T>) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const res = await api.get(url);
      return res.data as T;
    },
    ...(options as any),
  });
}
