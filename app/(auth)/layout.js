import React from 'react'
import ChatBot from '@/components/ChatBot'

const layout = ({children}) => {
  return (
    <div className='flex justify-center pt-40'>
      {children}
      <ChatBot />
    </div>
  )
}

export default layout