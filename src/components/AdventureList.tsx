import React, { useState } from 'react';
import { GamifiedAdventure } from '../types';
import { Sparkles, HelpCircle, Puzzle, Loader2, ArrowRight } from 'lucide-react';

interface AdventureListProps {
  adventures: GamifiedAdventure[];
  selectedId: string | null;
  onSelect: (adv: GamifiedAdventure) => void;
  onGenerateCustom: (question: string) => Promise<void>;
  isGenerating: boolean;
  generationError: string | null;
}

export const AdventureList: React.FC<AdventureListProps> = ({
  adventures,
  selectedId,
  onSelect,
  onGenerateCustom,
  isGenerating,
  generationError
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [customQuestion, setCustomQuestion] = useState<string>('');

  const sampleIdeas = [
    "What is 8 divided by 2?",
    "If I have 14 balloons and 6 pop, how many left?",
    "What is 3 plus 4?",
    "Divide 15 strawberry cookies among 5 polar bears",
    "Show me what 2 / 3 of an orange represents"
  ];

  const handleIdeaClick = (idea: string) => {
    setCustomQuestion(idea);
  };

  const categories = [
    { id: 'all', label: 'All', emoji: '🌟' },
    { id: 'addition', label: 'Addition', emoji: '➕' },
    { id: 'subtraction', label: 'Subtraction', emoji: '➖' },
    { id: 'division', label: 'Sharing (÷)', emoji: '🐿️' },
    { id: 'fractions', label: 'Fractions', emoji: '🍕' }
  ];

  const filteredAdventures = adventures.filter(adv => {
    if (filter === 'all') return true;
    return adv.category === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    onGenerateCustom(customQuestion);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Magical AI Generator Box */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl p-6 border-4 border-violet-300 shadow-lg relative overflow-hidden">
        {/* Subtle decorative background bubbles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />

        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-xl animate-pulse">
            <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          </div>
          <h3 className="font-bold text-xl font-sans text-white">Custom Math Playmaker</h3>
        </div>
        <p className="text-xs text-indigo-100 mb-4 font-sans leading-relaxed">
          Type any math problem! Our friendly woodland creatures will immediately spin it into a cartoon adventure game.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g., If I share 10 donuts between 2 pandas..."
              disabled={isGenerating}
              className="w-full bg-white text-slate-800 font-medium placeholder-slate-400 px-4 py-3.5 rounded-2xl border-none focus:outline-none focus:ring-4 focus:ring-yellow-400 pr-12 text-sm text-ellipsis"
            />
            <button
              type="submit"
              disabled={isGenerating || !customQuestion.trim()}
              className="absolute right-2 top-2 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold p-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
              ) : (
                <ArrowRight className="w-4 h-4 text-slate-800 stroke-[3]" />
              )}
            </button>
          </div>

          {isGenerating && (
            <div className="flex items-center gap-2.5 py-1 text-xs text-yellow-200 font-mono animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Mixing magical stardust, baking cookies...</span>
            </div>
          )}

          {generationError && (
            <div className="bg-red-500/20 text-red-100 p-3 rounded-xl text-xs font-medium border border-red-400/30">
              {generationError}
            </div>
          )}
        </form>

        {/* Custom prompts helper */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-indigo-200 font-extrabold flex items-center gap-1.5 mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Tap any prompt idea:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleIdeas.map((idea, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleIdeaClick(idea)}
                disabled={isGenerating}
                className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-xl cursor-pointer transition-all border border-white/5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[280px]"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Playground Selection Card */}
      <div className="bg-white rounded-3xl p-5 border-4 border-slate-100 shadow-xs">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-3">
          <Puzzle className="w-5 h-5 text-indigo-500" />
          Choose an Adventure Map
        </h3>

        {/* Category filtering pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border-2 transition-all cursor-pointer whitespace-nowrap ${
                filter === cat.id
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Map cards */}
        <div className="space-y-3 mt-1 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredAdventures.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              🌈 Adventure path empty in this category! Create one above!
            </div>
          ) : (
            filteredAdventures.map((adv) => {
              const themeColor = adv.colorClass || 'amber';
              const isSelected = selectedId === adv.id;

              // Color mappings
              const borderTheme = isSelected 
                ? `border-${themeColor}-400 ring-2 ring-${themeColor}-450 animate-pulse` 
                : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300';
              
              const accentColorBg = `bg-${themeColor}-100 text-${themeColor}-800`;

              return (
                <div
                  key={adv.id}
                  onClick={() => onSelect(adv)}
                  className={`border-4 rounded-2xl p-4 transition-all duration-200 cursor-pointer text-left relative overflow-hidden ${borderTheme}`}
                >
                  <div className="absolute right-2 top-2 text-2xl font-sans select-none opacity-40">
                    {adv.themeEmoji}
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-3xl mt-0.5">{adv.themeEmoji || '🧁'}</span>
                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="font-bold text-sm text-slate-800 font-sans line-clamp-1">
                        {adv.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Formula: {adv.equation}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic font-sans leading-relaxed">
                        &ldquo;{adv.storyAnalogy}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
