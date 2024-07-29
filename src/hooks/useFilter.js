import { useQuery } from "react-query";

const useFilter = ()=>{
    const{ data, isLoading, isError, refetch} = useQuery(
        "globalFilter",
        ()=> ({searchTerm:""}),
        {refetchOnWindowFocus:false,
        initialData: { searchTerm: "" }
        }
    );
    return { data, isLoading, isError, refetch};
};
export default useFilter;