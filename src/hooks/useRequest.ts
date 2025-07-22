import { useCallback, useState } from "react";

interface RequestOptions<TData, TParams> {
  onSuccess?: (data: TData, params?: TParams) => void;
  onError?: (error: any) => void;
}

const useRequest = <TParams, TData>(
  service: (params: TParams, options?: any) => Promise<TData>,
  options?: RequestOptions<TData, TParams>,
) => {
  const [data, setData] = useState<TData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  const run = useCallback(
    async (params?: TParams, option?: any) => {
      setLoading(true);
      try {
        const result: TData = await service((params || {}) as TParams, option);
        setData(result);
        options?.onSuccess?.(result, params);
      } catch (error) {
        setError(error);
        options?.onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [options, service],
  );

  return { data, loading, error, run };
};

export default useRequest;
