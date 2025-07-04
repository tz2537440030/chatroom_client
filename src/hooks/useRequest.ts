import { useCallback, useEffect, useState } from "react";

interface RequestOptions<TParams, TData> {
  manual?: boolean;
  defaultParams?: TParams;
  onSuccess?: (data: TData) => void;
  onError?: (error: any) => void;
}

const useRequest = <TParams, TData>(
  service: (params: TParams) => Promise<TData>,
  options: RequestOptions<TParams, TData>,
) => {
  const [data, setData] = useState<TData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  const run = useCallback(
    async (params: TParams) => {
      setLoading(true);
      try {
        const result: TData = await service(
          (params ?? options.defaultParams) as TParams,
        );
        setData(result);
        options.onSuccess?.(result);
      } catch (error) {
        setError(error);
        options.onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [options, service],
  );

  useEffect(() => {
    if (!options.manual) {
      run(options.defaultParams as TParams);
    }
  }, [run, options.manual, options.defaultParams]);

  return { data, loading, error, run };
};

export default useRequest;
