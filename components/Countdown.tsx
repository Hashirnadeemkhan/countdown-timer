"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { start } from "repl";


export default function Countdown() {
  const [duration, setDuration] = useState<number | string>(""); //duration is the time the user sets
  const [timeLeft, setTimeLeft] = useState<number>(0); // how much time is left
  const [isActive, setIsActive] = useState<boolean>(false); //if the timer is running
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); //null: The initial value of the ref. Here, it’s set to null because there is no timer set when the component first renders.
  //Timer ID: An identifier for the timer that allows you to controls the intervals
  //NodeJS.Timeout: TypeScript type used to represent the timer ID (it’s a number in browsers).
  //useRef: Used to persist the timer ID between renders without causing re-renders

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current); //timerRef.current will hold the timer ID returned by setInterval.
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(true);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0); //// Reset the timer to the original duration
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            //If remaining is less than or equal to 1, the interval is cleared, and the remaining time is set to 0, effectively stopping the timer.
            clearInterval(timerRef.current!); // stops the timer if the time is up (1 second or less).
            return 0; //Setting Time to 0:
          }
          return prevTime - 1; //If prevTime is greater than 1, the timer decrements the time by 1 second (return prevTime - 1;).
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        //The return function inside useEffect is known as a cleanup function.
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);     //If either of these variables changes, the current interval will be cleared (due to the cleanup function), and the timer may restart depending on the new values of isActive and isPaused



const formatTime =  (time:number):string=>{          //is designed to take a time value in seconds and format it as a MM:SS
  const minutes = Math.floor(time/60)               //This calculates the number of minutes in the given time.  Why use Math.floor: When you divide the total time by 60, you get the total number of minutes, including any fractional part. Since you only want the whole minutes, you use Math.floor to round down to the nearest integer.
  const seconds =Math.floor(time %60)                //This calculates the remaining seconds after the minutes have been accounted for.
  return `${String(minutes).padStart(2,"0")} : ${String(seconds).padStart(2,"0")}`;        //This converts the minutes to a string and ensures the minutes are displayed in a two-digit format, even if the number of minutes is less than 10.


}

const handleDurationChange=(e:ChangeEvent<HTMLInputElement>):void=>{
  setDuration(Number(e.target.value)|| "")     //update the duration state

}

return (
 <div className="flex flex-col items-center h-screen justify-center bg-gray-100 dark:bg-gray-900 " >
  <div className="bg-white dark:bg-gray-800 shadow-lg  rounded-lg p-8 w-full max-w-md">
<h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">Countdown Timer</h1>
<div className="flex items-center mb-6">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />  
          <Button
            onClick={handleSetDuration}
            variant="outline"
  
            className="text-gray-800 dark:text-gray-200"
          >    Set
          </Button>
</div>

          <div className="text-6xl font-bold  text-gray-800 dark:text-gray-200 mb-8 text-center">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={handleStart}
              variant="outline"
              className="text-gray-800 dark:text-gray-200"
               > 
               {isPaused ? "Resume" :"Start"}
            </Button>
            <Button
            onClick={handlePause}
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="text-gray-800 dark:text-gray-200"
          >
            Reset
            </Button>
          </div>
          </div>
  </div>
 
);




}