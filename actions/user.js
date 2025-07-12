"use server";

import { industries } from "@/data/industries";
import { MarketOutlook } from "@/lib/generated/prisma";
import { DemandLevel } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";
import { generateAIInsights } from "./dashboard";
export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not Found");
  try {
    const result = await db.$transaction(
      async (tx) => {
        let industryInsights = await tx.industryInsights.findUnique({
          where: {
            industry: data.industry,
          },
        });
        if (!industryInsights) {
          const insights = await generateAIInsights(data.industry);
           industryInsights = await db.industryInsights.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdated: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }
        const updateUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        return { updateUser, industryInsights };
      },

      {
        timeout: 10000,
      }
    );

    return { success: true, ...result };
  } catch (error) {
    console.log("Error Updating user and undstry: ", error.message);
    throw new Error("Failed to update Profile" + error.message);
  }
}
export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("user not Found");
  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.log("error checking onboarding status", error.message);
    throw new Error("Failed to check onboarding status");
  }
}
