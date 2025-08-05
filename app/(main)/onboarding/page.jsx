import { getUserOnboardingStatus } from '@/actions/user'
import { industries } from '@/data/industries'
import { redirect } from 'next/navigation'
import React from 'react'
import OnboardingForm from './_components/Onboarding-form'
import ChatBot from '@/components/ChatBot'

// Check if user is already onboarded
const OnboardingPage = async () => {
const {isOnboarded}=await getUserOnboardingStatus()
if(isOnboarded){
  redirect("/dashboard")
}
  return (
    <main>
        <OnboardingForm industry={industries} />
        <ChatBot />
    </main>
  )
}

export default OnboardingPage