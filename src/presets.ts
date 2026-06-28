import { GamifiedAdventure } from './types';

export const presetAdventures: GamifiedAdventure[] = [
  {
    id: 'preset_1_division',
    title: 'The Great Squirrel Acorn Share!',
    originalQuestion: 'How is 12 shared equally among 4 squirrels?',
    equation: '12 ÷ 4 = 3',
    category: 'division',
    storyAnalogy: 'Nutty the Squirrel has collected 12 golden woodland acorns! He wants to share them equally with his 4 cute squirrel friends so everybody gets the exact same amount.',
    themeEmoji: '🐿️',
    colorClass: 'amber',
    steps: [
      {
        id: 1,
        prompt: 'First, let us check how many total acorns Nutty has! Click on the acorns one by one to count them.',
        interactiveType: 'click_to_count',
        visualState: {
          totalCount: 12,
          items: Array(12).fill('🌰'),
          correctAnswer: 12
        },
        characterSpeak: 'Hello there! I am Nutty. I want to make sure I have exactly 12 yummy acorns. Can you count them with me by clicking each one?',
        successMessage: 'Splendid! Yes, we have 12 golden acorns!'
      },
      {
        id: 2,
        prompt: 'Let us divide them! If we share 12 acorns equally among 4 friendly squirrels, how many acorns should each friend get? Choose the correct sharing size.',
        interactiveType: 'multiple_choice',
        visualState: {
          items: Array(12).fill('🌰'),
          options: ['2 acorns each', '3 acorns each', '4 acorns each', '5 acorns each'],
          correctAnswer: '3 acorns each'
        },
        characterSpeak: 'Now, my 4 friends are waiting. If I put them in 4 equal lines, how many are in each line? Try picking a number!',
        successMessage: 'Incredible! 12 shared by 4 is exactly 3 each! 🌰 + 🌰 + 🌰 = 3 acorns!'
      },
      {
        id: 3,
        prompt: 'Look at the happy squirrels! Drag the slider or choose the right answer to confirm the sharing equation: 12 ÷ 4 equals what?',
        interactiveType: 'multiple_choice',
        visualState: {
          options: ['2', '3', '4', '6'],
          correctAnswer: '3'
        },
        characterSpeak: 'You solved it! You are a sharing champion. Let us write down the math rule to remember our squirrel party!',
        successMessage: 'Hooray! 12 ÷ 4 = 3! All friendly squirrels are eating acorns happily!'
      }
    ]
  },
  {
    id: 'preset_2_addition',
    title: 'Space Cupcake Rocket Station!',
    originalQuestion: 'What is 5 plus 4?',
    equation: '5 + 4 = 9',
    category: 'addition',
    storyAnalogy: 'Captain Pixel is loading fuel canisters (which look like magical glowing space cupcakes!) into the twin engine boosters of the Rocket. Engine A has 5 cupcakes, and Engine B has 4 cupcakes. How many cupcakes do we have in total?',
    themeEmoji: '🚀',
    colorClass: 'emerald',
    steps: [
      {
        id: 1,
        prompt: 'Count the cosmic fuel cupcakes in Engine A! Click all of them to power up Booster A.',
        interactiveType: 'click_to_count',
        visualState: {
          totalCount: 5,
          items: Array(5).fill('🧁'),
          correctAnswer: 5
        },
        characterSpeak: 'Booster A is ready! Let us tap the 5 sparkly purple fuel cupcakes to stand by.',
        successMessage: 'Engine A is fully charged with 5 cosmic fuel cupcakes!'
      },
      {
        id: 2,
        prompt: 'Now add the cupcakes from Booster B of the rocket. There are 4 cupcakes here. Click each one to activate Booster B.',
        interactiveType: 'click_to_count',
        visualState: {
          totalCount: 4,
          items: Array(4).fill('🧁'),
          correctAnswer: 4
        },
        characterSpeak: 'Terrific! Booster B is waiting. Give its 4 pink cupcakes a tap to fuel up.',
        successMessage: 'Great job! 4 cupcakes loaded for Booster B!'
      },
      {
        id: 3,
        prompt: 'Let us combine both engines for lift-off! What is the combined fuel of 5 cupcakes and 4 cupcakes?',
        interactiveType: 'multiple_choice',
        visualState: {
          options: ['7 cupcakes', '8 cupcakes', '9 cupcakes', '10 cupcakes'],
          correctAnswer: '9 cupcakes'
        },
        characterSpeak: 'Now, light up both boosters! Together, we have 5 and 4. What is the total sum?',
        successMessage: 'BINGO! 5 + 4 = 9! The galaxy rocket is blasting off to the math stars! 🌟🐾'
      }
    ]
  },
  {
    id: 'preset_3_fractions',
    title: 'Dino-Chef Pizza Puzzle!',
    originalQuestion: 'If we cut a pizza into 4 slices and eat 3, what fraction of the pizza is eaten?',
    category: 'fractions',
    equation: '3 / 4',
    storyAnalogy: 'Rexy the Dinosaur Chef has baked a circular Volcano Pepperoni Pizza! He cut it into 4 equal delicious slices. He is very hungry and eats 3 slices. Let us see what fraction Rexy swallowed!',
    themeEmoji: '🍕',
    colorClass: 'indigo',
    steps: [
      {
        id: 1,
        prompt: 'Chef Rexy has cut the freshly baked pizza into 4 giant slices. Click on each slice to count them!',
        interactiveType: 'click_to_count',
        visualState: {
          totalCount: 4,
          items: ['🍕', '🍕', '🍕', '🍕'],
          correctAnswer: 4
        },
        characterSpeak: 'Grrr-licious! My volcano pizza is fresh out of the oven, cut into 4 slices. Tap them all to inhale that delicious pizza smell!',
        successMessage: 'Awesome! We have 4 slices in total.'
      },
      {
        id: 2,
        prompt: 'Rexy cannot resist! He chomps down 3 of those slices. How many slices are left for Rexy\'s friends?',
        interactiveType: 'multiple_choice',
        visualState: {
          options: ['1 slice left', '2 slices left', '3 slices left', '0 slices left'],
          correctAnswer: '1 slice left'
        },
        characterSpeak: 'Chomp, chomp, chomp! I just ate 3 whole slices! How many slice(s) did I leave on the chef plate?',
        successMessage: 'Correct! There is only 1 slice left on the plate because 4 - 3 = 1!'
      },
      {
        id: 3,
        prompt: 'What fraction of the total pizza did Chef Rexy happily eat?',
        interactiveType: 'multiple_choice',
        visualState: {
          options: ['1/4 (one-fourth)', '2/4 (two-fourths)', '3/4 (three-fourths)', '4/4 (four-fourths)'],
          correctAnswer: '3/4 (three-fourths)'
        },
        characterSpeak: 'So, out of the 4 original slices, I ate 3 slices. Can you show me the fraction of pizza I devoured?',
        successMessage: 'You are a Fraction Genius! Chef Rexy ate 3 out of 4 slices, which is 3/4 of the pizza!'
      }
    ]
  }
];

export const badgesList = [
  {
    id: 'first_steps',
    name: 'First steps',
    description: 'Solve your very first math question adventure!',
    icon: '✨',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    condition: 'Solve 1 adventure'
  },
  {
    id: 'math_wizard',
    name: 'Math explorer',
    description: 'Complete 3 mathematical adventures successfully.',
    icon: '🧙‍♂️',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    condition: 'Solve 3 adventures'
  },
  {
    id: 'star_collector',
    name: 'Star collector',
    description: 'Earn 30 or more stellar learning gold coins.',
    icon: '🌟',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    condition: 'Accumulate 30 stars'
  },
  {
    id: 'streak_pioneer',
    name: 'Streak hero',
    description: 'Establish a streak of 3 or more problems.',
    icon: '🔥',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    condition: 'Achieve a 3-problem streak'
  },
  {
    id: 'custom_champ',
    name: 'Curiosity pup',
    description: 'Submit an original question for custom game solving!',
    icon: '🐾',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    condition: 'Ask a custom Math question'
  }
];
export const availableAvatars = [
  { emoji: '🐻', name: 'Beary', color: 'bg-orange-100' },
  { emoji: '🦊', name: 'Foxie', color: 'bg-red-100' },
  { emoji: '🐨', name: 'Koali', color: 'bg-slate-100' },
  { emoji: '🦉', name: 'Owlet', color: 'bg-amber-100' },
  { emoji: '🦁', name: 'Leopold', color: 'bg-yellow-100' },
  { emoji: '🐼', name: 'Pandy', color: 'bg-indigo-100' }
];
