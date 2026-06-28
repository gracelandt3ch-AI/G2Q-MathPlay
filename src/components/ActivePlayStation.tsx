import React, { useState, useEffect } from 'react';
import { GamifiedAdventure, InteractiveStep } from '../types';
import { playPop, playSuccessChime, playErrorBuzz } from '../utils/sound';
import { Sparkles, ArrowLeft, ArrowRight, RotateCcw, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';

interface ActivePlayStationProps {
  adventure: GamifiedAdventure;
  onStepComplete: (stepId: number, starsEarned: number) => void;
  onAdventureComplete: (starsEarned: number) => void;
  starsEarned: number;
}

export const ActivePlayStation: React.FC<ActivePlayStationProps> = ({
  adventure,
  onStepComplete,
  onAdventureComplete,
  starsEarned
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [clickedItemIndices, setClickedItemIndices] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [stepScore, setStepScore] = useState<number>(10); // Stars available to earn for this step
  const [characterMessage, setCharacterMessage] = useState<string>('');

  const currentStep = adventure.steps[currentStepIndex];

  // Initialize/Reset step details when adventure or step index shifts
  useEffect(() => {
    setClickedItemIndices([]);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setStepScore(10);
    if (currentStep) {
      setCharacterMessage(currentStep.characterSpeak);
    }
  }, [adventure, currentStepIndex]);

  if (!currentStep) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border-4 border-slate-100 shadow-sm">
        <p className="text-slate-500 font-sans text-sm">No steps loaded for this lesson. Go ask custom math playmaker!</p>
      </div>
    );
  }

  const emojiArray = currentStep.visualState.items || [];
  const requiredCount = Number(currentStep.visualState?.totalCount || currentStep.visualState?.correctAnswer || emojiArray.length);

  // Click to Count interactions
  const handleItemClick = (index: number) => {
    if (currentStep.interactiveType !== 'click_to_count') return;
    if (isAnswerCorrect) return; // already solved

    if (clickedItemIndices.includes(index)) {
      // Toggle off
      setClickedItemIndices(prev => prev.filter(i => i !== index));
      playPop();
    } else {
      // Add to counted list
      const newIndices = [...clickedItemIndices, index];
      setClickedItemIndices(newIndices);
      playPop();

      // Check if we hit the targeted number of clicks
      if (newIndices.length === requiredCount) {
        setIsAnswerCorrect(true);
        playSuccessChime();
        setCharacterMessage(currentStep.successMessage);
      }
    }
  };

  // Option select interactions (multiple_choice)
  const handleOptionSelect = (option: string) => {
    if (isAnswerCorrect) return; // already solved
    setSelectedOption(option);

    const isMatch = option === currentStep.visualState.correctAnswer || 
                    option.startsWith(String(currentStep.visualState.correctAnswer)) ||
                    option.includes(String(currentStep.visualState.correctAnswer));

    if (isMatch) {
      setIsAnswerCorrect(true);
      playSuccessChime();
      setCharacterMessage(currentStep.successMessage);
    } else {
      setIsAnswerCorrect(false);
      // Reduce the stars available slightly for errors as penalty, but guarantee minimum 3 stars for effort
      setStepScore(prev => Math.max(3, prev - 2));
      playErrorBuzz();
      setCharacterMessage(`Oh, close! Give it another focus. "${option}" is a good guess! Let's study our shapes and count again!`);
    }
  };

  const handleNextStep = () => {
    const earnedThisStep = isAnswerCorrect ? stepScore : 0;
    onStepComplete(currentStep.id, earnedThisStep);

    if (currentStepIndex < adventure.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // This was the final step of the adventure!
      onAdventureComplete(stepScore);
    }
  };

  const resetCurrentStep = () => {
    setClickedItemIndices([]);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setStepScore(10);
    setCharacterMessage(currentStep.characterSpeak);
  };

  // Fetch color properties mapped from colorClass properties
  const getAccentColors = (color: string) => {
    switch (color) {
      case 'emerald': return { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', bgLight: 'bg-emerald-50', gradient: 'from-emerald-400 to-teal-500', rings: 'focus:ring-emerald-300' };
      case 'indigo': return { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200', bgLight: 'bg-indigo-50', gradient: 'from-indigo-400 to-blue-500', rings: 'focus:ring-indigo-300' };
      case 'rose': return { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200', bgLight: 'bg-rose-50', gradient: 'from-rose-400 to-pink-500', rings: 'focus:ring-rose-300' };
      case 'sky': return { bg: 'bg-sky-500', text: 'text-sky-600', border: 'border-sky-200', bgLight: 'bg-sky-50', gradient: 'from-sky-450 to-blue-400', rings: 'focus:ring-sky-300' };
      case 'purple': return { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', bgLight: 'bg-purple-50', gradient: 'from-purple-400 to-fuchsia-500', rings: 'focus:ring-purple-300' };
      case 'violet': return { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200', bgLight: 'bg-violet-50', gradient: 'from-violet-400 to-indigo-500', rings: 'focus:ring-violet-300' };
      case 'amber':
      default:
        return { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200', bgLight: 'bg-amber-50', gradient: 'from-amber-400 to-orange-500', rings: 'focus:ring-amber-300' };
    }
  };

  const currentColors = getAccentColors(adventure.colorClass || 'amber');

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-slate-200 shadow-md flex flex-col justify-between min-h-[580px]">
      
      {/* Header section with level track progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
              ADVENTURE: {adventure.category.toUpperCase()}
            </span>
            <h2 className="text-xl font-black font-sans text-slate-800 mt-1 line-clamp-1">
              {adventure.title}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono font-black text-slate-400">
              Mission Rewards
            </span>
            <div className="flex items-center gap-1 text-amber-500 justify-end">
              <Sparkles className="w-4 h-4 fill-amber-400 shrink-0 animate-spin" />
              <span className="font-mono font-bold text-sm">+{stepScore} Stars</span>
            </div>
          </div>
        </div>

        {/* Step dots visual progress */}
        <div className="flex items-center gap-2 mb-6">
          {adventure.steps.map((step, idx) => {
            let activeDot = 'bg-slate-200';
            if (idx === currentStepIndex) activeDot = currentColors.bg;
            if (idx < currentStepIndex) activeDot = 'bg-green-500';
            return (
              <div key={step.id} className="flex-1 h-3 rounded-full transition-all duration-300 relative overflow-hidden bg-slate-100">
                <div className={`h-full rounded-full ${activeDot}`} style={{ width: '100%' }} />
              </div>
            );
          })}
        </div>

        {/* Story Intro Dialogue Anchor block */}
        <div className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl mb-6 flex gap-3 text-left">
          <div className="text-4xl select-none leading-none pt-1 shrink-0">
            {adventure.themeEmoji}
          </div>
          <div className="text-xs text-slate-600 font-sans leading-relaxed">
            <p className="font-extrabold text-slate-800 uppercase text-[10px] tracking-wide mb-0.5">Lesson Analogy</p>
            {adventure.storyAnalogy}
          </div>
        </div>

        {/* Interactive Math Stage container */}
        <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-5 min-h-[190px] flex flex-col items-center justify-center relative mb-6">
          <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" /> Stage Instructions:
          </div>
          <p className="text-sm font-black text-slate-800 text-center mb-5 max-w-md font-sans leading-snug px-3 mt-3">
            {currentStep.prompt}
          </p>

          {/* Interactive render strategy 1: click_to_count */}
          {currentStep.interactiveType === 'click_to_count' && (
            <div className="flex flex-wrap gap-4 items-center justify-center max-w-md py-2">
              {emojiArray.map((emoji, idx) => {
                const isSelected = clickedItemIndices.includes(idx);
                const countNumber = clickedItemIndices.indexOf(idx) + 1;

                return (
                  <button
                    key={idx}
                    onClick={() => handleItemClick(idx)}
                    className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-all duration-150 border-3 ${
                      isSelected
                        ? `bg-amber-100 border-amber-400 shadow-sm scale-105`
                        : 'bg-white border-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <span>{emoji}</span>

                    {/* Badge numbers overlaid for real-time counting */}
                    {isSelected && (
                      <span className="absolute -top-2.5 -right-2.5 bg-slate-900 border border-white text-white font-mono text-[10px] font-block w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                        {countNumber}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Interactive render strategy 2: multiple choice */}
          {currentStep.interactiveType === 'multiple_choice' && (
            <div className="w-full max-w-sm space-y-2 py-1">
              {(currentStep.visualState.options || []).map((opt) => {
                const isThisSelected = selectedOption === opt;
                let btnTheme = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';
                
                if (isThisSelected) {
                  if (isAnswerCorrect) {
                    btnTheme = 'bg-green-100 border-green-400 text-green-900 ring-2 ring-green-300';
                  } else {
                    btnTheme = 'bg-red-100 border-red-400 text-red-900 ring-2 ring-red-300 animate-shake';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    disabled={isAnswerCorrect === true}
                    className={`w-full text-left px-4 py-3 rounded-2xl border-2 font-bold font-sans text-xs transition-all flex items-center justify-between cursor-pointer ${btnTheme}`}
                  >
                    <span>{opt}</span>
                    <span className="text-xs">
                      {isThisSelected && isAnswerCorrect === true && (
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      )}
                      {isThisSelected && isAnswerCorrect === false && (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Prompt success state details if verified */}
          {isAnswerCorrect === true && (
            <div className="mt-4 flex items-center gap-2 bg-green-50 text-green-800 text-[11px] font-black py-1.5 px-4 rounded-xl border border-green-200 animate-bounce">
              <CheckCircle className="w-4 h-4" /> Ready to Advance!
            </div>
          )}
        </div>
      </div>

      {/* Comic character speach block at base */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-4xl select-none shrink-0 shadow-sm animate-pulse border-4 border-white ring-4 ring-slate-100">
            {adventure.themeEmoji || '🐻'}
          </div>
          <div className="flex-1 bg-amber-50 border-2 border-amber-100 p-4 rounded-2xl relative shadow-xs">
            <div className="absolute left-0 top-6 -translate-x-2.5 w-3 h-3 bg-amber-50 border-b-2 border-l-2 border-amber-100 rotate-45" />
            <h4 className="font-extrabold font-sans text-amber-900 text-xs mb-1">
              Math Companion Says:
            </h4>
            <p className="text-xs font-sans font-medium text-amber-800 leading-relaxed italic">
              &ldquo;{characterMessage}&rdquo;
            </p>
          </div>
        </div>

        {/* Action Panel: Restart current stage or submit next step */}
        <div className="flex gap-3 justify-between items-center pt-2">
          <button
            onClick={resetCurrentStep}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-extrabold text-xs px-3.5 py-2.5 rounded-full cursor-pointer transition-all border border-slate-200 font-sans"
            title="Restart this step"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Step
          </button>

          {isAnswerCorrect === true ? (
            <button
              onClick={handleNextStep}
              className={`flex items-center gap-1 text-xs font-black text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all animate-bounce cursor-pointer ${currentColors.bg}`}
            >
              <span>{currentStepIndex === adventure.steps.length - 1 ? 'Finish Adventure 🎉' : 'Next Lesson Step'}</span>
              <ArrowRight className="w-4 h-4 fill-white shrink-0" />
            </button>
          ) : (
            <button
              disabled
              className="bg-slate-100 text-slate-400 font-bold text-xs px-5 py-3 rounded-full cursor-not-allowed flex items-center gap-1"
            >
              <span>Solve Challenge to Play</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
