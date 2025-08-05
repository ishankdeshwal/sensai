import { useState } from "react"
import { toast } from "sonner"

const userFetch=(cb)=>{
const [data,setData]=useState(null)
const [loading,setLoading]=useState(undefined)
const [error,setError]=useState(undefined)
const fn=async(...args)=>{
setLoading(true);
setError(null)
try {
    const res=await cb(...args);
    setData(res)
    setError(null)

} catch (error) {
    console.error("userFetch error:", error);
    setError(error)
    // Only show toast for client-side errors, not server component errors
    if (typeof window !== 'undefined') {
        toast.error(error.message || "An error occurred")
    }
}finally{
    setLoading(false)
}

}
return {data,loading,error,fn,setData};
}
export default userFetch