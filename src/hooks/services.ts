import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import defu from "defu";

type TReactQueryOptions = { staleTime?: number; cacheTime?: number };

type TUseFetchDataParams<TQuery> = {
    url: string;
    queryKey: string;
    queryParams?: TQuery;
    axiosOptions?: AxiosRequestConfig;
    reactQueryOptions?: TReactQueryOptions;
};

export function useFetchData<TQuery = undefined, TResponse = undefined>({
    url,
    queryKey,
    queryParams,
    axiosOptions,
    reactQueryOptions,
}: TUseFetchDataParams<TQuery>) {
    const defaultAxiosOptions: AxiosRequestConfig = {
        baseURL: "/api",
        headers: {
            "Content-Type": "application/json",
        },
    };
    const defaultReactQueryOptions: TReactQueryOptions = {
        staleTime: 5000,
    };

    const axiosConfig = defu(axiosOptions, defaultAxiosOptions);
    const reactQueryConfig = defu(reactQueryOptions, defaultReactQueryOptions);

    const fetchData = async (): Promise<TResponse> => {
        const response = await axios.get<TResponse>(url, {
            ...axiosConfig,
            params: queryParams,
        });
        return response.data as TResponse;
    };

    return useQuery({
        queryKey: [queryKey],
        queryFn: fetchData,
        ...reactQueryConfig,
    });
}

// usage
export function useSomeFunction() {
    const fetchResponse = useFetchData<null, { message: string }>({
        url: "some url",
        queryKey: "some query key",
    });

    fetchResponse.data?.message;
}
