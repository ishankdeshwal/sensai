import React, { Suspense } from 'react'
import {BarLoader} from "react-spinners"
const Layout = ({children}) => {
  return (
    <div className='md:px-15'>
        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color="gray" />}>
            {children}
        </Suspense>
    </div>
  )
}

export default Layout