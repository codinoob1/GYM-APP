// src/app/onboarding/page.js
import Onbordflow from '@/components/onBord/Onbordflow'
import { WorkoutProvider } from '@/context/WorkoutContext' // 👈 check your actual path

export default function OnboardingPage() {
  return (
    <WorkoutProvider>       {/* 👈 wrap it here */}
      <Onbordflow />
    </WorkoutProvider>
  )
}