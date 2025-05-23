import { useQuery } from "react-query"
import { toast } from "react-toastify";
import { getUserDetail } from "../api";


const useUser = ()=>{
    const {data,isLoading,isError,refetch} = useQuery(
        "user",
        async()=>{
            try {
                const userDetail = await getUserDetail();
                return userDetail;
            } catch (error) {
                if(!error.message.includes('not authenticated')){
                    toast("Something went wrong");
                }
            }
        },
        {refetchOnWindowFocus: "always"}
    );
    return {data,isLoading,isError,refetch};
};
export default useUser;