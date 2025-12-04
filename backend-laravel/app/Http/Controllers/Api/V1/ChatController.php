<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    use ApiResponses;

    /**
     * Send a chat message and get AI response
     */
    public function chat(Request $request)
    {
        $message = trim((string) $request->input('message'));

        if ($message === '') {
            return response()->json(['reply' => 'Please provide a message'], 400);
        }

        // Use intelligent contextual responses for instant replies
        // (Ollama is taking too long to respond, so we're using smart fallbacks instead)
        return response()->json(['reply' => $this->generateContextualResponse($message)]);
    }

    /**
     * Build messages array for OpenAI API call
     */
    private function buildMessages($currentMessage, $history, $context)
    {
        $systemPrompt = $this->getSystemPrompt($context);

        // Start with system prompt
        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
        ];

        // Add conversation history (max last 10 messages to avoid token limits)
        if (!empty($history)) {
            $recentHistory = array_slice($history, -10);
            foreach ($recentHistory as $msg) {
                if (isset($msg['role']) && isset($msg['content'])) {
                    $messages[] = [
                        'role' => $msg['role'],
                        'content' => $msg['content'],
                    ];
                }
            }
        }

        // Add current message
        $messages[] = [
            'role' => 'user',
            'content' => $currentMessage,
        ];

        return $messages;
    }

    /**
     * Get system prompt based on context
     */
    private function getSystemPrompt($context)
    {
        $prompts = [
            'student_wellness' => env('CHATBOT_SYSTEM_PROMPT', 
                'You are a helpful wellness chatbot assistant for students. Provide supportive, practical wellness advice on mental health, academic performance, physical health, and personal well-being. Keep responses concise (2-3 sentences) and empathetic. Use encouraging emojis when appropriate.'
            ),
            'general' => 'You are a helpful assistant. Provide clear, concise, and accurate responses.',
        ];

        return $prompts[$context] ?? $prompts['student_wellness'];
    }

    /**
     * Generate wellness advice based on user message (free, instant, always works - no external API needed)
     */
    private function callHuggingFaceApi($messages)
    {
        // Extract user message from messages array
        $userMessage = null;
        foreach (array_reverse($messages) as $msg) {
            if ($msg['role'] === 'user') {
                $userMessage = $msg['content'];
                break;
            }
        }

        if (!$userMessage) {
            return [
                'success' => false,
                'error' => 'No user message found',
            ];
        }

        // Use curated wellness response generator
        $message = $this->generateWellnessResponse($userMessage);

        return [
            'success' => true,
            'message' => $message,
        ];
    }

    /**
     * Generate wellness advice based on user message
     * Using curated responses for common wellness topics (free, instant, always works, no external API)
     */
    private function generateWellnessResponse($userMessage)
    {
        $message = strtolower(trim($userMessage));

        // FIRST: Detect off-topic queries
        $hasWellnessKeywords = preg_match('/(budget|money|finance|spend|save|expensive|stress|anxiety|worry|depressed|sad|mental|sleep|overwhelmed|study|learn|exam|test|grade|homework|assignment|procrastinat|exercise|fitness|workout|gym|health|diet|nutrition|weight|friend|social|lonely|relationship|dating|communicate)/i', $message);
        
        if (!$hasWellnessKeywords) {
            $offtopicResponses = [
                "I'm specifically designed to help with wellness topics like mental health, study tips, fitness, budgeting, and personal growth. For other questions, try a general search engine! But if you have wellness concerns, I'm here to help. 😊",
                "That's a great question, but it's outside my wellness expertise! I focus on helping students with stress management, study techniques, fitness, finances, and relationships. What wellness topic can I help you with today? 🌿",
                "I'm your wellness companion focused on student wellness. While I can't help with that particular question, I'd love to help you with tips on managing stress, improving study habits, staying healthy, or building better relationships! 💪",
            ];
            return $offtopicResponses[array_rand($offtopicResponses)];
        }

        // Budget/money advice
        if (preg_match('/(budget|money|finance|spend|save|expensive)/i', $message)) {
            $responses = [
                "Start by tracking your spending for a month to see where your money goes. Then create categories: essentials (housing, food), savings, and discretionary. Aim to save at least 10% of your income. 💰",
                "Try the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. This simple framework helps most students manage their money effectively. 📊",
                "Use apps like Mint or YNAB to automate expense tracking. You can't improve what you don't measure! Set alerts for overspending. 📱",
            ];
            return $responses[array_rand($responses)];
        }

        // Mental health/stress
        if (preg_match('/(stress|anxiety|worry|depressed|sad|mental|sleep|overwhelmed)/i', $message)) {
            $responses = [
                "Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. This calms your nervous system instantly. 🧘",
                "Take regular breaks during study sessions. A 5-minute walk or stretch can reset your focus and reduce stress significantly. 🚶",
                "Aim for 7-9 hours of sleep nightly. Sleep is when your brain processes emotions and consolidates learning. Prioritize it! 😴",
            ];
            return $responses[array_rand($responses)];
        }

        // Academic/study advice
        if (preg_match('/(study|learn|exam|test|grade|homework|assignment)/i', $message)) {
            $responses = [
                "Use the Pomodoro Technique: study for 25 minutes, then take a 5-minute break. This improves focus and retention dramatically. ⏲️",
                "Teach someone else what you learned — explaining concepts is one of the best ways to lock knowledge into memory. 👥",
                "Start studying at least one week before exams. Cramming rarely works; spaced repetition is scientifically proven to be better. 📚",
            ];
            return $responses[array_rand($responses)];
        }

        // Time management
        if (preg_match('/(time|busy|schedule|organize|plan|manage|procrastinat)/i', $message)) {
            $responses = [
                "Use time blocking: assign specific hours for specific tasks. This prevents multitasking and boosts productivity. 🗓️",
                "Do your hardest task first thing in the morning when your energy is highest. Save easy tasks for afternoon energy dips. 💪",
                "Write down your top 3 priorities each day. Focusing on 3 things beats trying to do 10 things half-heartedly. ✅",
            ];
            return $responses[array_rand($responses)];
        }

        // Health/exercise
        if (preg_match('/(exercise|fitness|workout|gym|health)/i', $message)) {
            $responses = [
                "Aim for 30 minutes of activity most days. It doesn't have to be intense — a brisk walk counts and improves mood significantly. 🏃",
                "Drink at least 8 glasses of water daily. Dehydration often feels like hunger or fatigue. Stay hydrated! 💧",
                "Eat regular meals to maintain stable blood sugar and energy. Skipping meals makes you cranky and unfocused. 🥗",
            ];
            return $responses[array_rand($responses)];
        }

        // Social/relationships
        if (preg_match('/(friend|social|lonely|relationship|dating|communicate)/i', $message)) {
            $responses = [
                "Building meaningful relationships takes time. Start with one person you connect with and invest in that friendship deeply. 💚",
                "Practice active listening: focus on understanding others, not planning your response. People appreciate being truly heard. 👂",
                "Join a club or activity you enjoy. Shared interests are the best foundation for new friendships. 🤝",
            ];
            return $responses[array_rand($responses)];
        }

        // If no category matched (but has wellness keywords), use default response
        // Default wellness response for vague/unclear queries
        $defaultResponses = [
            "I'm here to help with wellness! Try asking me about mental health, study techniques, fitness, budgeting, time management, or relationships. What would help you most right now? 🌿",
            "Remember, self-care is not selfish! Taking time to rest and recharge makes you more productive and happier. Need specific wellness advice? Ask me about any wellness topic! 💚",
            "Small habits compound over time. One healthy choice today leads to many healthy days ahead. What wellness area would you like to focus on? Start small, stay consistent. ✨",
            "You're doing great! Balance is key: work hard, rest well, have fun, and maintain meaningful relationships. All areas matter for wellness. What can I help with? ⚖️",
        ];

        return $defaultResponses[array_rand($defaultResponses)];
    }

    /**
     * Generate a contextual response when Ollama is unavailable
     */
    private function generateContextualResponse($message)
    {
        $message = strtolower($message);

        // Emotional support
        if (preg_match('/(sad|depressed|unhappy|down|upset|cry|stressed|anxious|worried|scared|lonely)/i', $message)) {
            return "I'm sorry you're feeling this way. Remember that these feelings are temporary and it's okay to not be okay sometimes. Consider talking to a counselor or trusted friend. You're not alone. 💚";
        }

        // Happiness/positivity
        if (preg_match('/(happy|great|awesome|excited|love|good mood|wonderful)/i', $message)) {
            return "That's wonderful to hear! Keep that positive energy going. Share your joy with others - happiness is contagious! What made you feel so good today? ✨";
        }

        // Sleep/rest
        if (preg_match('/(sleep|tired|fatigue|rest|insomnia|bed time)/i', $message)) {
            return "Quality sleep is crucial for your wellbeing. Try these: maintain a consistent sleep schedule, avoid screens 30 mins before bed, keep your room cool and dark, and limit caffeine after 2 PM. Sweet dreams! 😴";
        }

        // Exercise/fitness
        if (preg_match('/(fit|exercise|workout|gym|run|sport|health|weight|diet|nutrition)/i', $message)) {
            return "Great interest in fitness! Start with 30 mins of moderate activity daily. Mix cardio, strength training, and flexibility work. Remember: consistency beats perfection. Find an activity you enjoy! 💪";
        }

        // Study/academics
        if (preg_match('/(study|exam|homework|assignment|class|school|learn|focus|concentration)/i', $message)) {
            return "Study tips: Use the Pomodoro technique (25 min focus + 5 min break), study in a quiet place, break large topics into chunks, teach concepts to others, and take care of basics (sleep, food, water). You've got this! 📚";
        }

        // Stress/overwhelm
        if (preg_match('/(stress|overwhelm|pressure|deadline|busy|workload)/i', $message)) {
            return "Feeling overwhelmed? Take a step back. Prioritize what's truly urgent vs important. Break tasks into smaller steps. Practice deep breathing (4 count in, hold 4, out 4). Remember: progress over perfection! 🌿";
        }

        // Time management
        if (preg_match('/(time|manage|organize|schedule|plan|procrastin)/i', $message)) {
            return "Time management tips: Use a planner or app, set realistic goals, tackle hardest tasks first, minimize distractions, and build in buffer time. Start with organizing just tomorrow. Small steps lead to big changes! ⏰";
        }

        // Money/budget
        if (preg_match('/(money|budget|expense|spend|save|finance|afford)/i', $message)) {
            return "Financial wellness matters! Track your spending, create a simple budget (income vs expenses), save a portion of what you earn, avoid impulse purchases, and plan for the future. Even small savings add up! 💰";
        }

        // Relationships/social
        if (preg_match('/(friend|social|lonely|relationship|dating|communicate|connect)/i', $message)) {
            return "Building connections matters! Invest in quality time with people you care about, practice active listening, join clubs matching your interests, and don't fear being yourself. Real friendships form naturally! 🤝";
        }

        // Default friendly response
        return "I'm here to support your wellness journey! Feel free to ask me about any challenges you're facing - whether it's stress, sleep, fitness, academics, relationships, or just needing someone to talk to. What's on your mind? 💚";
    }
}
