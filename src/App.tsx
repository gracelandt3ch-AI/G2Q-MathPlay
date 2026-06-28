import { useState, useEffect } from 'react';
import { GamifiedAdventure, Badge } from './types';
import { presetAdventures, badgesList } from './presets';
import { BadgeRack } from './components/BadgeRack';
import { AdventureList } from './components/AdventureList';
import { ActivePlayStation } from './components/ActivePlayStation';
import { HeaderNav } from './components/HeaderNav';
import { playTadaFanfare, playSuccessChime } from './utils/sound';
import { Award, ShieldCheck, HelpCircle, Star, Sparkles, BookOpen, PartyPopper } from 'lucide-react';

export default function App() {
  // State Initializers from LocalStorage
  const [adventures, setAdventures] = useState<GamifiedAdventure[]>(() => {
    const local = localStorage.getItem('math_adventures');
    return local ? JSON.parse(local) : presetAdventures;
  });

  const [selectedAdventure, setSelectedAdventure] = useState<GamifiedAdventure>(() => {
    return adventures[0] || presetAdventures[0];
  });

  const [stars, setStars] = useState<number>(() => {
    const val = localStorage.getItem('math_stars');
    return val ? Number(val) : 10; // Start with 10 helper star coins
  });

  const [streak, setStreak] = useState<number>(() => {
    const val = localStorage.getItem('math_streak');
    return val ? Number(val) : 1;
  });

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const val = localStorage.getItem('math_badges');
    return val ? JSON.parse(val) : ['first_steps']; // Start with encouragement!
  });

  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('math_student_name') || 'Lulu';
  });

  const [avatarEmoji, setAvatarEmoji] = useState<string>(() => {
    return localStorage.getItem('math_student_avatar') || '熊';
  });

  const [completedCount, setCompletedCount] = useState<number>(() => {
    const val = localStorage.getItem('math_completed_count');
    return val ? Number(val) : 0;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Celebratory States
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);
  const [hasCustomFlag, setHasCustomFlag] = useState<boolean>(() => {
    return localStorage.getItem('math_has_custom') === 'true';
  });

  // Save states to Local Storage upon updates
  useEffect(() => {
    localStorage.setItem('math_adventures', JSON.stringify(adventures));
  }, [adventures]);

  useEffect(() => {
    localStorage.setItem('math_stars', String(stars));
  }, [stars]);

  useEffect(() => {
    localStorage.setItem('math_streak', String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('math_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('math_completed_count', String(completedCount));
  }, [completedCount]);

  useEffect(() => {
    localStorage.setItem('math_student_name', studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem('math_student_avatar', avatarEmoji);
  }, [avatarEmoji]);

  useEffect(() => {
    localStorage.setItem('math_has_custom', String(hasCustomFlag));
  }, [hasCustomFlag]);

  // Dynamic Badge Recognition Logic
  const checkBadgeUnlocks = (
    currentStars: number,
    currentCompletedCount: number,
    currentStreak: number,
    customAsked: boolean
  ) => {
    const newlyUnlocked: string[] = [...unlockedBadges];
    let justEarned: Badge | null = null;

    // Condition 1: Solve 1 Adventure (should have first_steps)
    if (currentCompletedCount >= 1 && !newlyUnlocked.includes('first_steps')) {
      newlyUnlocked.push('first_steps');
      justEarned = badgesList.find(b => b.id === 'first_steps') || null;
    }

    // Condition 2: Math Wizard (Completed 3 missions)
    if (currentCompletedCount >= 3 && !newlyUnlocked.includes('math_wizard')) {
      newlyUnlocked.push('math_wizard');
      justEarned = badgesList.find(b => b.id === 'math_wizard') || null;
    }

    // Condition 3: Star Collector (accumulated 30 or more stars)
    if (currentStars >= 30 && !newlyUnlocked.includes('star_collector')) {
      newlyUnlocked.push('star_collector');
      justEarned = badgesList.find(b => b.id === 'star_collector') || null;
    }

    // Condition 4: Streak pioneer (Streak >= 3)
    if (currentStreak >= 3 && !newlyUnlocked.includes('streak_pioneer')) {
      newlyUnlocked.push('streak_pioneer');
      justEarned = badgesList.find(b => b.id === 'streak_pioneer') || null;
    }

    // Condition 5: Custom prompt explorer!
    if (customAsked && !newlyUnlocked.includes('custom_champ')) {
      newlyUnlocked.push('custom_champ');
      justEarned = badgesList.find(b => b.id === 'custom_champ') || null;
    }

    if (justEarned) {
      setUnlockedBadges(newlyUnlocked);
      setCelebrationBadge(justEarned);
      playTadaFanfare();
    }
  };

  // Lesson actions
  const handleStepComplete = (stepId: number, starsEarned: number) => {
    setStars(prev => prev + starsEarned);
  };

  const handleAdventureComplete = (starsEarnedForFinalStep: number) => {
    const finalStars = stars + starsEarnedForFinalStep + 5; // Add extra 5 bonus stars for full completion!
    const finalCompletedCount = completedCount + 1;
    const finalStreak = streak + 1;

    setStars(finalStars);
    setCompletedCount(finalCompletedCount);
    setStreak(finalStreak);

    playSuccessChime();

    // Trigger badge status auditor
    checkBadgeUnlocks(finalStars, finalCompletedCount, finalStreak, hasCustomFlag);

    // Show small completed popup alerting of bonus stars
    alert(`Woohoo! High-five wizard! You completed "${selectedAdventure.title}" successfully and earned a +5 Star bonus coin! 🌟🥳`);
  };

  const handleUpdateProfile = (name: string, emoji: string) => {
    setStudentName(name);
    setAvatarEmoji(emoji);
  };

  // Custom AI solver dynamic trigger
  const handleGenerateCustom = async (question: string) => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error("Oh fudge! Math machine is thinking hard. Let's try again in a bit!");
      }

      const lessonData: GamifiedAdventure = await response.json();

      // Setup list states
      const updatedList = [lessonData, ...adventures.filter(a => a.id !== lessonData.id)];
      setAdventures(updatedList);
      setSelectedAdventure(lessonData);
      setHasCustomFlag(true);

      // Instantly trigger badge audit for custom curiosity pup
      checkBadgeUnlocks(stars, completedCount, streak, true);

    } catch (err: any) {
      console.warn("AI generation error, using fallback logic safely:", err);
      setGenerationError("AI was busy making waffles, but we brewed a customized local puzzle map for you below!");
      
      // Attempt fallback generation
      const mockResult = generateLocalOfflineFallback(question);
      const updatedList = [mockResult, ...adventures.filter(a => a.id !== mockResult.id)];
      setAdventures(updatedList);
      setSelectedAdventure(mockResult);
      setHasCustomFlag(true);
      checkBadgeUnlocks(stars, completedCount, streak, true);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLocalOfflineFallback = (question: string): GamifiedAdventure => {
    const numbers = question.match(/\d+/g)?.map(Number) || [5, 4];
    const n1 = numbers[0] || 5;
    const n2 = numbers[1] || 4;
    const s = n1 + n2;

    return {
      id: "local_gen_" + Date.now(),
      title: `${studentName}'s Magic Forest Quest`,
      originalQuestion: question,
      equation: `${n1} + ${n2} = ${s}`,
      category: 'addition',
      storyAnalogy: `Look! We found ${n1} yellow flower bubbles, and ${n2} red star flowers. Let's count them all with ${studentName}!`,
      themeEmoji: '🌸',
      colorClass: 'emerald',
      steps: [
        {
          id: 1,
          prompt: `Tap the ${n1} magical yellow flowers to gather them!`,
          interactiveType: 'click_to_count',
          visualState: {
            totalCount: n1,
            items: Array(n1).fill('🌸'),
            correctAnswer: n1
          },
          characterSpeak: `Hiya! Let's get counting together to score big!`,
          successMessage: `Wonderful! We cataloged ${n1} flowers.`
        },
        {
          id: 2,
          prompt: `Now combine them with ${n2} red flowers! How many total flowers are in our basket?`,
          interactiveType: 'multiple_choice',
          visualState: {
            items: Array(s).fill('🌸'),
            options: [`${s - 1} flowers`, `${s} flowers`, `${s + 2} flowers`, `${s + 4} flowers`],
            correctAnswer: `${s} flowers`
          },
          characterSpeak: `Let me count! If we have ${n1} and add ${n2}, the sum is...?`,
          successMessage: `Bingo! ${n1} plus ${n2} equals exactly ${s}!`
        },
        {
          id: 3,
          prompt: `Select the forest math sentence representing our flower hunt:`,
          interactiveType: 'multiple_choice',
          visualState: {
            options: [`${n1} - ${n2} = ?`, `${n1} + ${n2} = ${s}`, `${n1} ÷ ${n2} = ?`, `None of these`],
            correctAnswer: `${n1} + ${n2} = ${s}`
          },
          characterSpeak: `Amazing grade pupil! Let's lock our score.`,
          successMessage: `Hooray! ${n1} + ${n2} = ${s} is verified!`
        }
      ]
    };
  };

  // Reset classroom stats to fresh start
  const handleResetClassroom = () => {
    if (confirm("Are you sure you want to reset all earned stars, badges, and progress for a new session?")) {
      setStars(10);
      setStreak(1);
      setUnlockedBadges(['first_steps']);
      setCompletedCount(0);
      setHasCustomFlag(false);
      setAdventures(presetAdventures);
      setSelectedAdventure(presetAdventures[0]);
      localStorage.clear();
      alert("Quest reset complete! Ready for new adventures. 🌟");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Visual background sky container */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header navigation profile */}
        <HeaderNav
          stars={stars}
          streak={streak}
          studentName={studentName}
          avatarEmoji={avatarEmoji === '熊' ? '🐼' : avatarEmoji} // safeguard default placeholder
          onUpdateProfile={handleUpdateProfile}
        />

        {/* Dynamic game layout platform */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: List maps & customized playbook inputs */}
          <div className="lg:col-span-5 space-y-6">
            <AdventureList
              adventures={adventures}
              selectedId={selectedAdventure.id}
              onSelect={setSelectedAdventure}
              onGenerateCustom={handleGenerateCustom}
              isGenerating={isGenerating}
              generationError={generationError}
            />

            <BadgeRack
              unlockedBadgeIds={unlockedBadges}
              stars={stars}
              completedCount={completedCount}
            />

            {/* Teacher Dashboard helper controls */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 border-4 border-slate-700 shadow-sm text-left">
              <h3 className="font-extrabold text-sm flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Teacher & Parents Control Center
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-3">
                Grade pupils learn through gamified, offline-first stories. You can erase session logs for clean classroom reuse.
              </p>
              <button
                onClick={handleResetClassroom}
                className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl cursor-pointer transition-all border border-red-400"
              >
                Reset Pupil Progress Logs
              </button>
            </div>
          </div>

          {/* Right panel: Active play whiteboard */}
          <div className="lg:col-span-7">
            <ActivePlayStation
              adventure={selectedAdventure}
              onStepComplete={handleStepComplete}
              onAdventureComplete={handleAdventureComplete}
              starsEarned={stars}
            />
          </div>

        </div>
      </div>

      {/* Celebration Modal for newly unlocked badge achievements */}
      {celebrationBadge && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm text-center border-6 border-amber-300 shadow-2xl relative overflow-hidden">
            
            {/* Stars background decorations */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300" />
            
            <div className="text-6xl my-4 animate-bounce shrink-0 select-none">
              {celebrationBadge.icon}
            </div>

            <h3 className="text-2xl font-black text-amber-900 font-sans mb-1 flex items-center justify-center gap-2">
              <PartyPopper className="w-6 h-6 text-yellow-500 fill-yellow-300" />
              Badge Unlocked!
            </h3>
            
            <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
              {celebrationBadge.name}
            </span>

            <p className="text-xs text-slate-600 font-sans mt-3 mb-6 font-medium leading-relaxed">
              &ldquo;{celebrationBadge.description}&rdquo;
            </p>

            <button
              onClick={() => setCelebrationBadge(null)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-full cursor-pointer transition-all shadow-md w-full"
            >
              Yippee! Thanks Mathy! 🐾
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
