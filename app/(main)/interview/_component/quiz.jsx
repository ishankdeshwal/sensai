"use client";
import React, { useEffect, useState } from "react";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import userFetch from "@/hooks/user-fetch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import QuizResult from "./QuizResult";
const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = userFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData:setResultData
  } = userFetch(saveQuizResult);

    console.log(resultData);
  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const startNewQuiz=()=>{
    setCurrentQuestion(0)
    setAnswers([0])
    setShowExplanation(false)
    generateQuizFn()
    setResultData(null)
  }

  const handleNext=()=>{
    if(currentQuestion<quizData.length-1){
        setCurrentQuestion(currentQuestion+1);
        setShowExplanation(false)
    }else{
        finishQuiz()
    }
  }
  const finishQuiz=async()=>{
        const score=calculateScore();
        try {
            await saveQuizResultFn(quizData,answers,score)
            toast.success("Quiz Completed")
        } catch (error) {
            toast.error(error.message || "Failed to save quiz results")
        }
  }
  const calculateScore=()=>{
    let correct=0;
    answers.forEach((answer,index)=>{
        if(answer===quizData[index].correctAnswer){
            correct++;
        }
    })
    return (correct/quizData.length)*100
  }

  if (generatingQuiz) {
    return <BarLoader className="mt-4" color="gray" width={"100%"} />;
  }

  if(resultData){
    return(
        <div>
            <QuizResult result={resultData} onStartNew={startNewQuiz} />
        </div>
    )
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }
  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question{currentQuestion + 1} of {quizData.length}{" "}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium  mb-5">{question.question}</p>
        <RadioGroup
          className="space-y-2"
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
        >
          {question.options.map((option, index) => {
            return (
              <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            );
          })}
        </RadioGroup>
        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showExplanation && (
          <Button
            variant="outline"
            disabled={!answers[currentQuestion]}
            onClick={() => setShowExplanation(true)}
          >
            Show Explanation
          </Button>
        )}
        <Button
          className='ml-auto'
          disabled={!answers[currentQuestion] || savingResult}
          onClick={handleNext}
        >
            {savingResult && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
