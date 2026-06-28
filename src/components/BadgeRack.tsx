import React from 'react';
import { Badge } from '../types';
import { badgesList } from '../presets';
import { Award, Lock, Star, Flame } from 'lucide-react';

interface BadgeRackProps {
  unlockedBadgeIds: string[];
  stars: number;
  completedCount: number;
}

export const BadgeRack: React.FC<BadgeRackProps> = ({
  unlockedBadgeIds,
  stars,
  completedCount
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-amber-200 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-sans text-amber-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500 animate-bounce" />
          Pupil Badge Locker
        </h3>
        <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-3 py-1 rounded-full border border-amber-100">
          Earned: {unlockedBadgeIds.length} / {badgesList.length}
        </span>
      </div>

      {/* Tiny Stats overview */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100 text-center flex flex-col items-center">
          <span className="text-2xl">🌟</span>
          <span className="font-mono text-lg font-bold text-amber-900">{stars}</span>
          <span className="text-xs text-amber-600 font-medium">Star Coins</span>
        </div>
        <div className="bg-orange-50 rounded-2xl p-3 border border-orange-100 text-center flex flex-col items-center">
          <span className="text-2xl">🏆</span>
          <span className="font-mono text-lg font-bold text-orange-900">{completedCount}</span>
          <span className="text-xs text-orange-600 font-medium font-sans">Solved Missions</span>
        </div>
      </div>

      {/* Badge List */}
      <div className="space-y-3">
        {badgesList.map((rawBadge) => {
          const isUnlocked = unlockedBadgeIds.includes(rawBadge.id);
          return (
            <div
              key={rawBadge.id}
              className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 border-2 ${
                isUnlocked
                  ? `${rawBadge.color} shadow-sm scale-100 transform`
                  : 'bg-slate-50 text-slate-400 border-slate-100 opacity-60'
              }`}
            >
              <div className={`text-3xl p-2 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-white shadow-xs' : 'bg-slate-100'}`}>
                {isUnlocked ? (
                  <span className="animate-pulse">{rawBadge.icon}</span>
                ) : (
                  <Lock className="w-6 h-6 text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {rawBadge.name}
                  </h4>
                  {isUnlocked && (
                    <span className="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                      ★ Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">
                  {rawBadge.description}
                </p>
                <div className="mt-1 flex items-center text-[10px] text-slate-500 font-mono">
                  <span>Target: {rawBadge.condition}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
