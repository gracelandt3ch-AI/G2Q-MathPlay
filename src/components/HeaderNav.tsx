import React, { useState } from 'react';
import { availableAvatars } from '../presets';
import { User, ShieldAlert, Star, Flame, Trophy, Check } from 'lucide-react';

interface HeaderNavProps {
  stars: number;
  streak: number;
  studentName: string;
  avatarEmoji: string;
  onUpdateProfile: (name: string, emoji: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  stars,
  streak,
  studentName,
  avatarEmoji,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(studentName);
  const [selectedEmoji, setSelectedEmoji] = useState(avatarEmoji);

  const handleSave = () => {
    if (!nameInput.trim()) return;
    onUpdateProfile(nameInput.trim(), selectedEmoji);
    setIsEditing(false);
  };

  const currentLevel = Math.floor(stars / 20) + 1;
  const starsNeededForNextLevel = 20 - (stars % 20);
  const progressPercent = Math.min(100, ((stars % 20) / 20) * 100);

  return (
    <div className="bg-white rounded-3xl p-5 border-4 border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Profil details */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsEditing(true)}
          className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-4xl select-none hover:scale-105 active:scale-95 transition-all shadow-inner border-2 border-slate-200 cursor-pointer"
          title="Click to change avatar/name!"
        >
          {avatarEmoji}
        </button>

        <div className="text-left">
          {isEditing ? (
            <div className="space-y-2 max-w-xs">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="bg-slate-50 text-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full"
                placeholder="Student Name..."
                maxLength={18}
              />
              <div className="flex flex-wrap gap-1.5">
                {availableAvatars.map((av) => (
                  <button
                    key={av.name}
                    type="button"
                    onClick={() => setSelectedEmoji(av.emoji)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-lg cursor-pointer ${
                      selectedEmoji === av.emoji ? 'bg-slate-900 border-2 border-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSave}
                className="bg-slate-900 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Save Profile
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black font-sans text-slate-800">
                  {studentName}&apos;s Math Adventure
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
              <p className="text-xs text-slate-500 font-sans font-medium">
                Grade Pupil Mathematical Quest Map 🗺️
              </p>

              {/* level helper */}
              <div className="mt-2 flex items-center gap-2 max-w-xs md:max-w-md">
                <span className="text-[10px] font-sans font-black text-slate-400">
                  LVL {currentLevel}
                </span>
                <div className="w-28 h-2.5 rounded-full bg-slate-150 overflow-hidden relative border border-slate-100">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-500">
                  {starsNeededForNextLevel} ★ to next level
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Star achievements status panel */}
      <div className="flex items-center gap-4 bg-slate-50 border-2 border-slate-100 px-4 py-3 rounded-2xl shrink-0 self-start md:self-auto">
        <div className="flex items-center gap-1.5 border-r-2 border-slate-200 pr-3">
          <div className="bg-amber-100 p-1.5 rounded-xl shrink-0">
            <Star className="w-5 h-5 text-amber-500 fill-amber-300 animate-spin" />
          </div>
          <div className="text-left leading-none">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Total Stars</span>
            <div className="font-mono text-base font-black text-slate-800">{stars}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="bg-orange-100 p-1.5 rounded-xl shrink-0">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-300 animate-pulse" />
          </div>
          <div className="text-left leading-none">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Streak</span>
            <div className="font-mono text-base font-black text-slate-800">{streak} 🔥</div>
          </div>
        </div>
      </div>

    </div>
  );
};
