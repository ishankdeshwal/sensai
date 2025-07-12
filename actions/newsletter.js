"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

export async function subscribeToNewsletter(email) {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }

    // For now, we'll just log the subscription
    // In a real app, you'd want to store this in a database
    // and integrate with an email service like Mailchimp, SendGrid, etc.
    console.log("Newsletter subscription:", email);

    // You could add this to your database schema later:
    // await db.newsletterSubscription.create({
    //   data: {
    //     email,
    //     subscribedAt: new Date(),
    //     isActive: true
    //   }
    // });

    return { success: true, message: "Successfully subscribed to newsletter!" };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    throw new Error(error.message || "Failed to subscribe to newsletter");
  }
}

export async function unsubscribeFromNewsletter(email) {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }

    console.log("Newsletter unsubscription:", email);

    // You could update the database here:
    // await db.newsletterSubscription.updateMany({
    //   where: { email },
    //   data: { isActive: false, unsubscribedAt: new Date() }
    // });

    return { success: true, message: "Successfully unsubscribed from newsletter!" };
  } catch (error) {
    console.error("Newsletter unsubscription error:", error);
    throw new Error(error.message || "Failed to unsubscribe from newsletter");
  }
} 