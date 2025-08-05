import { getResume } from '@/actions/resume'
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from 'react'
import Resumebuilder from './_components/Resumebuilder'

const Resume = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const resume = await getResume()
  
  return (
    <div className='container mx-auto py-6'>
        <Resumebuilder initialContent={resume?.content} />
    </div>
  )
}

export default Resume