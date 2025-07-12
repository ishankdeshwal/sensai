import { getResume } from '@/actions/resume'
import React from 'react'
import Resumebuilder from './_components/Resumebuilder'
const Resume =async () => {
    const resume=await getResume()
  return (
    <div className='container mx-auto py-6'>
        <Resumebuilder initialContent={resume?.content} />
    </div>
  )
}

export default Resume