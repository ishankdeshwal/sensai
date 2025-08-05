import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/CoverLetterList";
import { getCoverLetters } from "@/actions/coverLetter";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function CoverLetterPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const coverLetters = await getCoverLetters();

  return (
    <div className="px-15">
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Cover Letters</h1>
        <Link href="/ai-cover-letter/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}