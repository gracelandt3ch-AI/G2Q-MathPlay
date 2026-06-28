export interface MathAppletState {
  stars: number;
  streak: number;
  completedCount: number;
  unlockedBadges: string[]; // Badge IDs
  history: CompletedAdventure[];
}

export interface CompletedAdventure {
  id: string;
  title: string;
  equation: string;
  completedAt: string;
  ratingValue: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji representation
  color: string; // Tailwind color classes
  unlockedAt?: string;
  condition: string;
}

export interface InteractiveStep {
  id: number;
  prompt: string;         // Instructions: "Click on 4 cupcakes to share them equally!"
  interactiveType: 'click_to_count' | 'distribute_items' | 'multiple_choice' | 'drag_to_match';
  visualState: {
    totalCount?: number;
    items?: string[];     // E.g., ['🧁', '🧁', '🧁', '🧁']
    groupsCount?: number; // E.g., 2 groups for division
    correctAnswer: number | string; // The correct group size, count, or selected option
    options?: string[];   // For multiple choice
  };
  characterSpeak: string; // Encouraging narrator text: "Mathy says: We have 10 pieces to start with!"
  successMessage: string; // "Fantastic! You shared them perfectly!"
}

export interface GamifiedAdventure {
  id: string;
  title: string;
  originalQuestion: string;
  equation: string;       // e.g., "12 / 4 = 3"
  category: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions' | 'other';
  storyAnalogy: string;   // Friendly narrative, e.g., "Squirrel Nutty wants to share 12 acorns among his 4 best friends!"
  themeEmoji: string;     // E.g., "🐿️" or "🧁"
  colorClass: string;     // e.g., "from-amber-400 to-orange-500"
  steps: InteractiveStep[];
}
