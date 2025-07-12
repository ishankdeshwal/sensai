"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { industries } from "@/data/industries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import userFetch from "@/hooks/user-fetch";
import { updateUser } from "@/actions/user";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
const OnboardingForm = () => {
  const [selectIndustry, setSelectIndustry] = useState(null);
  const router = useRouter();
 const{loading:updateLoading,
  fn:updateUserFn,
  data:updateResult}= userFetch(updateUser)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });
  const watchIndustry = watch("industry");
  const onSubmit = async (values) => {
 try {
    const formattedIndustry=`${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g,"-")}`
    await updateUserFn({
      ...values,
      industry:formattedIndustry
    })
 } catch (error) {
  console.log("onbarding error:",error);
 }
  };
  useEffect(()=>{
    if(updateResult?.success && !updateLoading){
      toast.success("Profile Completed Successfully")
      router.push("/dashboard")
      router.refresh()
    }
  },[updateResult,updateLoading])
  return (
    <div className="flex  items-center justify-center bg-background">
      <Card className="w-full max-w-xl mt-10 mx-2">
        <CardHeader>
          <CardTitle className="text-gray-300 text-4xl">
            Complete your profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalised carrer insights and
            recommendations
          </CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Industry */}
            <div className="space-y-4">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  const selected = industries.find((ind) => ind.id === value);
                  setSelectIndustry(selected);
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry" className="w-[280px]">
                  <SelectValue placeholder="Select an Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>
            {/* Subindustry */}
            {watchIndustry && (
              <div className="space-y-4  mt-4">
                <Label htmlFor="subIndustry"> Sub Industry</Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                  disabled={!selectIndustry}
                >
                  <SelectTrigger id="subIndustry" className="w-[280px]">
                    <SelectValue placeholder="Select a Sub Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectIndustry?.subIndustries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}
            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Years Of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>
            {/*Skills  */}
              <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="eg. python.javascript,project Management"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Seprate Multiple Skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">
                  {errors.skills.message}
                </p>
              )}
            </div>
             {/*Bio  */}
              <div className="space-y-2">
              <Label htmlFor="bio">Proffessional Bio</Label>
              <Textarea
                id="skills"
                placeholder="Tell us about your proffesional background"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">
                  {errors.bio.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={updateLoading} className='w-full'>
             {updateLoading?(
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
              </>
             ):(
              " Complete Profile"
             )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingForm;
