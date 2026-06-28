import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI or direct call to keep the server startup completely safe
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined in the workspace! Generating high-quality local math puzzles as fallback.");
    }
    // Setup client with User-Agent required header for AI Studio
    aiClient = new GoogleGenAI({
      apiKey: key || "DUMMY_KEY_FOR_LOCAL_STABILITY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST route for gamified math solver using Gemini Flash
app.post("/api/generate-lesson", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Please enter a valid mathematical query!" });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Return a simulated high-quality response for the user to view immediately if key is missing in test mode
      console.log("No GEMINI_API_KEY found, providing rich fallback lesson.");
      return res.json(generateFallbackLesson(question));
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are an expert grade teacher specializing in elementary school mathematics (ages 5 to 9).
Your superpower is turning dry, scary mathematical questions (like addition, subtraction, division, fractions, sharing problems, or simple word problems) into engaging, simplified, step-by-step visual matching games.
You explain math using delightful stories about friendly animals, space explorers, cake baking, or pirate treasure quests.

Produce matching JSON that maps out a highly interactive 3-step lesson game for children.
Rules:
1. "title" should be a brilliant child-friendly adventure title (e.g., "The Magical Donut Safari", "Starship Balloon Mission").
2. "equation" should state the neat mathematical formula (e.g., "6 + 4 = 10", "15 ÷ 3 = 5", "1/2 of 8 = 4").
3. "themeEmoji" should be a single cheerful emoji that anchors the items (e.g., "🍩", "🎈", "🐸", "🍕", "🍪").
4. "colorClass" represents the theme. Choose ONLY among: "amber", "emerald", "indigo", "rose", "sky", "purple", "violet".
5. "steps" MUST contain exactly 3 step objects:
   - Step 1: "click_to_count". Let the student count/interact with the starting items.
     * "prompt": Instructions on what to scan/count.
     * "visualState.totalCount": Integer.
     * "visualState.items": An array of size totalCount filled with the matching themeEmoji.
     * "visualState.correctAnswer": Total counted items as a numerical string (e.g., "6").
   - Step 2: An action step representing the mathematical formula operation (e.g., adding, subtracting, or sharing).
     * Set "interactiveType" as "multiple_choice".
     * "prompt": Asking what happens to the items in the story. E.g., "Oh no! 3 frogs hopped away. How many frogs are left on the leaves?"
     * "visualState.options": An array of exactly 4 clear options (e.g. ["2 frogs left", "3 frogs left", "4 frogs left", "5 frogs left"]). Include the correct one.
     * "visualState.correctAnswer": The exact string option from the choices.
   - Step 3: Math formula verification.
     * Set "interactiveType" as "multiple_choice".
     * "prompt": Asking them to pick the mathematical sentence that remembers our adventure.
     * "visualState.options": Playful options representing calculations (e.g. ["6 - 1 = 5", "6 - 3 = 3", "6 - 4 = 2", "6 - 2 = 4"]).
     * "visualState.correctAnswer": The correct math calculation string.

Ensure everything is fully adapted so a 7-year-old pupil can read it and instantly laugh, learn, and feel like they are playing an iPad game!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Translate this math request into a gamified lesson structure: "${question}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            equation: { type: Type.STRING },
            category: {
              type: Type.STRING,
              enum: ['addition', 'subtraction', 'multiplication', 'division', 'fractions', 'other']
            },
            storyAnalogy: { type: Type.STRING },
            themeEmoji: { type: Type.STRING },
            colorClass: { type: Type.STRING, description: "Choose one of: 'amber', 'emerald', 'indigo', 'rose', 'sky', 'purple', 'violet'." },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  prompt: { type: Type.STRING },
                  interactiveType: { type: Type.STRING, enum: ['click_to_count', 'multiple_choice'] },
                  visualState: {
                    type: Type.OBJECT,
                    properties: {
                      totalCount: { type: Type.INTEGER },
                      items: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["items", "correctAnswer"]
                  },
                  characterSpeak: { type: Type.STRING },
                  successMessage: { type: Type.STRING }
                },
                required: ["id", "prompt", "interactiveType", "visualState", "characterSpeak", "successMessage"]
              }
            }
          },
          required: ["title", "equation", "category", "storyAnalogy", "themeEmoji", "colorClass", "steps"]
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Empty response from AI engine");
    }

    const lessonData = JSON.parse(outputText);
    // Guarantee that an ID exists
    lessonData.id = "dynamic_" + Date.now();
    res.json(lessonData);

  } catch (error: any) {
    console.error("Gemini math builder compilation failed:", error);
    // Propagate the error and provide a pleasant kid-friendly fallback
    res.status(500).json({
      error: "Oh fudge! Puzzle magic was a bit busy. But don't worry, we brewed a wonderful local adventure card just for you!",
      fallback: generateFallbackLesson(question)
    });
  }
});

function generateFallbackLesson(question: string) {
  // Extract numbers if any to make it slightly customized
  const numbers = question.match(/\d+/g)?.map(Number) || [8, 2];
  const num1 = numbers[0] || 6;
  const num2 = numbers[1] || 4;
  
  const isAlt = question.toLowerCase().includes("subtract") || question.toLowerCase().includes("minus") || question.includes("-");
  const isDiv = question.toLowerCase().includes("divide") || question.toLowerCase().includes("share") || question.includes("/");
  
  if (isAlt) {
    const diff = Math.max(0, num1 - num2);
    return {
      id: "fallback_" + Date.now(),
      title: "Sparky's Magic Balloon Pop!",
      originalQuestion: question,
      equation: `${num1} - ${num2} = ${diff}`,
      category: "subtraction",
      storyAnalogy: `Sparky the Dragon loaded ${num1} super shiny floating star balloons. Suddenly, ${num2} of them went POP in the wind! Let us help Sparky count how many floating stars remain.`,
      themeEmoji: "🎈",
      colorClass: "rose",
      steps: [
        {
          id: 1,
          prompt: `Look at the balloons Sparky started with! Click on the ${num1} star balloons to count them.`,
          interactiveType: "click_to_count",
          visualState: {
            totalCount: num1,
            items: Array(num1).fill("🎈"),
            correctAnswer: String(num1)
          },
          characterSpeak: `Hey kiddo! I am Sparky. I have ${num1} pretty balloons. Can you tap them to double check I counted right?`,
          successMessage: `Whoosh! Indeed, there are ${num1} balloons to start!`
        },
        {
          id: 2,
          prompt: `Oh dear! ${num2} balloons popped! Choose how many gorgeous balloons Sparky has left.`,
          interactiveType: "multiple_choice",
          visualState: {
            items: Array(diff).fill("🎈"),
            options: [`${diff - 1 >= 0 ? diff - 1 : diff + 3} balloons`, `${diff} balloons`, `${diff + 1} balloons`, `${diff + 2} balloons`],
            correctAnswer: `${diff} balloons`
          },
          characterSpeak: `POP! Squeak! Suddenly ${num2} of them are gone. How many do I have left now?`,
          successMessage: `Fantastic! ${num1} minus ${num2} leaves exactly ${diff} floating balloons!`
        },
        {
          id: 3,
          prompt: "Let us record our math adventure! Which school formula represents what happened today?",
          interactiveType: "multiple_choice",
          visualState: {
            options: [`${num1} + ${num2} = ${num1 + num2}`, `${num1} - ${num2} = ${diff}`, `${num1} - 1 = ${num1 - 1}`, `${num1} ÷ ${num2} = ?`],
            correctAnswer: `${num1} - ${num2} = ${diff}`
          },
          characterSpeak: "You saved my math adventure! Sparky is sending you a huge firey high-five! Let's lock in the code.",
          successMessage: `Incredible subtraction wizardry! ${num1} - ${num2} = ${diff}!`
        }
      ]
    };
  } else if (isDiv) {
    const quotient = Math.floor(num1 / (num2 || 1));
    const divisor = num2 || 2;
    const product = quotient * divisor;
    return {
      id: "fallback_" + Date.now(),
      title: "Chef Panda's Cookie Tray!",
      originalQuestion: question,
      equation: `${product} ÷ ${divisor} = ${quotient}`,
      category: "division",
      storyAnalogy: `Chef Panda has baked ${product} hot chocolate-chip cookies. He wants to plate them evenly for his ${divisor} hungry panda friends who are rubbing their tummies!`,
      themeEmoji: "🍪",
      colorClass: "amber",
      steps: [
        {
          id: 1,
          prompt: `Look at the amazing fresh cookies! Click on the ${product} cookies to get them ready for plating.`,
          interactiveType: "click_to_count",
          visualState: {
            totalCount: product,
            items: Array(product).fill("🍪"),
            correctAnswer: String(product)
          },
          characterSpeak: "Sniff sniff! Smells amazing. Tap all my chocolate cookies to arrange them nicely!",
          successMessage: `Tasty! We have ${product} cookies on the backing sheet.`
        },
        {
          id: 2,
          prompt: `Let's share! If we group ${product} cookies onto ${divisor} pretty plates, how many cookies go on each plate?`,
          interactiveType: "multiple_choice",
          visualState: {
            items: Array(product).fill("🍪"),
            options: [`${quotient - 1 > 0 ? quotient - 1 : quotient + 2} cookies`, `${quotient} cookies`, `${quotient + 1} cookies`, `${quotient + 2} cookies`],
            correctAnswer: `${quotient} cookies`
          },
          characterSpeak: `I want to be perfectly fair to my ${divisor} furry panda friends. Choose the right amount for each plate!`,
          successMessage: `Yummy! Each hungry panda receives helper-sized servings of exactly ${quotient} cookies!`
        },
        {
          id: 3,
          prompt: "What division formula captures Chef Panda's fair sharing rule?",
          interactiveType: "multiple_choice",
          visualState: {
            options: [`${product} + ${divisor} = ${product + divisor}`, `${product} × ${divisor} = ${product * divisor}`, `${product} ÷ ${divisor} = ${quotient}`, `none of these`],
            correctAnswer: `${product} ÷ ${divisor} = ${quotient}`
          },
          characterSpeak: "We did it! All pandas are happy and chewing. Tap to lock in your reward!",
          successMessage: `Awesome helper! ${product} ÷ ${divisor} = ${quotient} is correct!`
        }
      ]
    };
  } else {
    // Default to addition/other
    const sum = num1 + num2;
    return {
      id: "fallback_" + Date.now(),
      title: "Barnaby's Magic Berry Bush!",
      originalQuestion: question,
      equation: `${num1} + ${num2} = ${sum}`,
      category: "addition",
      storyAnalogy: `Barnaby Bear found ${num1} juicy blueberries in a basket. Then he picked ${num2} more forest strawberries! Let's help Barnaby count all of his yummy wizard berries.`,
      themeEmoji: "🍓",
      colorClass: "emerald",
      steps: [
        {
          id: 1,
          prompt: `Count Barnaby's first batch of strawberries! Tap the ${num1} strawberries to add to the pot.`,
          interactiveType: "click_to_count",
          visualState: {
            totalCount: num1,
            items: Array(num1).fill("🍓"),
            correctAnswer: String(num1)
          },
          characterSpeak: "Mantra-berries! I love picking fruits! Give my first strawberries a tap to drop them in.",
          successMessage: `Sweet! ${num1} baskets loaded.`
        },
        {
          id: 2,
          prompt: `He finds another strawberry patch with ${num2} more. Tap them to double check!`,
          interactiveType: "click_to_count",
          visualState: {
            totalCount: num2,
            items: Array(num2).fill("🍓"),
            correctAnswer: String(num2)
          },
          characterSpeak: "Oh look over there! ${num2} more red strawberries! Tap them to pick them too.",
          successMessage: `Yum! All ${num2} additional strawberries have been picked.`
        },
        {
          id: 3,
          prompt: `How many strawberries does Barnaby Bear have now that we combined ${num1} and ${num2}?`,
          interactiveType: "multiple_choice",
          visualState: {
            options: [`${sum - 2 > 0 ? sum - 2 : sum + 3} strawberries`, `${sum - 1 > 0 ? sum - 1 : sum + 2} strawberries`, `${sum} strawberries`, `${sum + 2} strawberries`],
            correctAnswer: `${sum} strawberries`
          },
          characterSpeak: "Let's make a giant wild jam jar! What is the final total sum of all our berries?",
          successMessage: `Bingo! ${num1} + ${num2} = ${sum}! Barnaby has enough berry jam for the winter! 🐻🍯`
        }
      ]
    };
  }
}

// Vite static assets and routing setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
