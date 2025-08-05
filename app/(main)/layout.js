import React from 'react'
import ChatBot from '@/components/ChatBot'

const MainLayout = ({children}) => {
    // Redirect to onBoarding

  return (
    <div className='container mx-auto mt-24 mb-20'>
      {children}
      <ChatBot />
    </div>
  )
}

export default MainLayout