"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Eye,
  Sparkles,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Recipe } from "@/lib/types";

interface CookingFocusModeProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CookingFocusMode({ recipe, isOpen, onClose }: CookingFocusModeProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [wakeLockActive, setWakeLockActive] = useState(false);
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [totalTimerTime, setTotalTimerTime] = useState(0);
  
  // Audio narration state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const wakeLockSentinelRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Screen Wake Lock Management
  useEffect(() => {
    if (!isOpen) {
      if (wakeLockSentinelRef.current) {
        wakeLockSentinelRef.current.release().catch(() => {});
        wakeLockSentinelRef.current = null;
        setWakeLockActive(false);
      }
      return;
    }

    // Request Screen Wake Lock
    if ("wakeLock" in navigator) {
      navigator.wakeLock
        .request("screen")
        .then((sentinel) => {
          wakeLockSentinelRef.current = sentinel;
          setWakeLockActive(true);
          sentinel.addEventListener("release", () => {
            setWakeLockActive(false);
          });
        })
        .catch((err) => {
          console.warn("Wake lock request failed:", err);
          setWakeLockActive(false);
        });
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechAvailable(true);
    }

    return () => {
      if (wakeLockSentinelRef.current) {
        wakeLockSentinelRef.current.release().catch(() => {});
      }
    };
  }, [isOpen]);

  // Set timer when step changes
  useEffect(() => {
    if (!recipe || !recipe.instructions[currentStepIdx]) return;
    const step = recipe.instructions[currentStepIdx];
    const duration = (step.durationMinutes || 2) * 60;
    setTotalTimerTime(duration);
    setTimerSeconds(duration);
    setTimerRunning(false);
  }, [currentStepIdx, recipe]);

  // Timer Tick
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            playChime();
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const currentStep = recipe.instructions[currentStepIdx] || recipe.instructions[0];
  const isLastStep = currentStepIdx === recipe.instructions.length - 1;

  // Web Audio chime generator
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.15); // A5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, now);
      osc2.frequency.setValueAtTime(1174.66, now + 0.15); // D6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch {
      // ignore
    }
  };

  // Text-To-Speech Narration
  const speakCurrentStep = () => {
    if (!speechAvailable) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Step ${currentStep.stepNumber}. ${currentStep.instruction}. ${
      currentStep.chefTip ? `Chef tip: ${currentStep.chefTip}` : ""
    }`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    setCompletedSteps((prev) => ({ ...prev, [currentStepIdx]: true }));
    if (isLastStep) {
      setIsDone(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f97316", "#10b981", "#3b82f6", "#eab308"],
      });
    } else {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0c10] text-white flex flex-col justify-between animate-fade-in select-none">
      
      {/* Top HUD Bar */}
      <div className="px-4 sm:px-8 py-4 border-b border-stone-800 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold font-display text-white line-clamp-1">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-400" />
                {wakeLockActive ? "Screen Awake Mode ON" : "Screen Awake Active"}
              </span>
              <span>•</span>
              <span>Step {currentStepIdx + 1} of {recipe.instructions.length}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            onClose();
          }}
          className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Focus Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center space-y-8">
        
        {isDone ? (
          /* Dish Completed Celebration */
          <div className="text-center space-y-6 animate-fade-in py-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-500 to-emerald-500 mx-auto flex items-center justify-center shadow-xl shadow-brand-500/30">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
                Bon Appétit! Dish Perfected.
              </h2>
              <p className="text-sm sm:text-base text-stone-300 max-w-md mx-auto">
                You just crafted &ldquo;{recipe.title}&rdquo; with precision culinary techniques. Plate with pride!
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsDone(false);
                  setCurrentStepIdx(0);
                }}
                className="px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-semibold transition"
              >
                Cook Again
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-lg shadow-brand-500/30 transition"
              >
                Back to PantryPro
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Progress Indicators */}
            <div className="flex items-center gap-1.5 w-full">
              {recipe.instructions.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                    idx < currentStepIdx || completedSteps[idx]
                      ? "bg-emerald-500"
                      : idx === currentStepIdx
                      ? "bg-brand-500 ring-2 ring-brand-500/40"
                      : "bg-stone-800"
                  }`}
                />
              ))}
            </div>

            {/* Instruction Big Card */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-mono tracking-widest text-brand-400 uppercase font-bold">
                  Step {currentStep.stepNumber} of {recipe.instructions.length}
                </span>

                {/* Voice Narration Button */}
                {speechAvailable && (
                  <button
                    onClick={speakCurrentStep}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                      isSpeaking
                        ? "bg-brand-500 text-white border-brand-500 animate-pulse"
                        : "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800"
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-400" />}
                    <span>{isSpeaking ? "Stop Narration" : "Read Step Aloud"}</span>
                  </button>
                )}
              </div>

              {/* Large Step Instruction */}
              <p className="text-xl sm:text-3xl md:text-4xl font-bold font-sans text-stone-100 leading-snug tracking-tight">
                {currentStep.instruction}
              </p>

              {/* Pro Chef Tip Banner in Focus Mode */}
              {currentStep.chefTip && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-sm sm:text-base flex items-start gap-3">
                  <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-400 block mb-0.5">Chef&apos;s Pro Note:</span>
                    <span>{currentStep.chefTip}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step Timer HUD */}
            <div className="p-4 sm:p-6 rounded-3xl bg-stone-900/90 border border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl sm:text-4xl font-mono font-black text-brand-400">
                  {formatTime(timerSeconds)}
                </div>
                <div className="text-xs text-stone-400">
                  <span className="block font-semibold text-stone-200">Suggested Step Timer</span>
                  <span>Chime sounds upon finish</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                    timerRunning
                      ? "bg-amber-500 text-stone-900"
                      : "bg-stone-800 hover:bg-stone-700 text-white"
                  }`}
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{timerRunning ? "Pause Timer" : "Start Timer"}</span>
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(totalTimerTime);
                  }}
                  className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Step Control Navigation */}
      {!isDone && (
        <div className="px-4 sm:px-8 py-4 border-t border-stone-800 bg-black/50 backdrop-blur-md flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-sm font-semibold flex items-center gap-2 disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:brightness-110 text-white text-sm font-bold flex items-center gap-2 shadow-xl shadow-brand-500/25 transition active:scale-95"
          >
            <span>{isLastStep ? "Complete & Serve!" : "Next Step"}</span>
            {isLastStep ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
