
import { getAssessments } from '@/actions/interview'
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from 'react'
import StatsCards from './_component/StatsCards';
import PerformanceCharts from './_component/PerformanceCharts';
import QuizList from './_component/QuizList';

const InterviewPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const assessments = await getAssessments();
  
  return (
    <div className='md:px-15'>
      <h1 className='text-6xl font-bold gradient--title mb-5'>
        Interview Preparation
      </h1>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceCharts assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  )
}

export default InterviewPage