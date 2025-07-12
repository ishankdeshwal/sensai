import { useFormState } from "react-hook-form"
import { toast } from "sonner"

const { useState } = require("react")

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
    setError(error)
    toast.error(error.message)
}finally{
    setLoading(false)
}

}
return {data,loading,error,fn,setData};
}
export default userFetch