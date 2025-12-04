<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class AIChatController extends Controller
{
    // Path to the Ollama executable (use full path to avoid PATH issues)
    private $ollamaBinary = 'C:\\Users\\ricoa\\AppData\\Local\\Programs\\Ollama\\ollama.exe';
    // Use a faster model for interactive chat to reduce CPU latency
    private $model = 'gemma3:4b';
    
    public function chat(Request $request)
    {
        \Log::info('AIChatController raw request', [
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'is_json' => $request->isJson(),
        ]);

        // Read message robustly: prefer Laravel's JSON helper, fall back to raw body
        $rawContent = $request->getContent();
        \Log::info('AIChatController raw body', ['raw' => substr($rawContent, 0, 1000)]);

        $userMessage = $request->json('message', null);
        if (!$userMessage) {
            $json = json_decode($rawContent, true);
            \Log::info('AIChatController parsed json', [
                'message' => $json['message'] ?? 'NOT_FOUND',
            ]);
            $userMessage = $json['message'] ?? null;
        } else {
            \Log::info('AIChatController parsed json (helper)', ['message' => $userMessage]);
        }

        if (!$userMessage || !is_string($userMessage) || trim($userMessage) === '') {
            return response()->json([
                'message' => 'The message field is required.',
                'errors' => ['message' => ['The message field is required.']],
            ], 422);
        }

        // Prevent multiple concurrent AI requests per user/IP (simple in-flight lock)
        $clientId = optional($request->user())->id ?? $request->ip();
        $lockKey = 'ai_inflight_' . $clientId;
        $lockTtl = 45; // seconds

        // Try to acquire lock — Cache::add returns false if key already exists
        if (!Cache::add($lockKey, true, $lockTtl)) {
            \Log::warning('AI request rejected - already in flight', ['client' => $clientId]);
            return response()->json([
                'message' => 'AI is busy processing another request. Please wait a moment and try again.'
            ], 429);
        }

        try {
            // Generate AI response using Ollama (real AI, not hardcoded)
            $reply = $this->generateAIResponse($userMessage);
        } finally {
            // Always clear the in-flight lock
            Cache::forget($lockKey);
        }

        return response()->json([
            'reply' => $reply,
            'metadata' => [
                'source' => 'ollama_ai',
                'model' => $this->model,
                'timestamp' => now()->toIso8601String(),
            ],
        ], 200);
    }

    /**
     * Generate AI response using Ollama (self-hosted, real AI)
     */
    private function generateAIResponse($userMessage)
    {
        try {
            $systemPrompt = "You are a helpful wellness advisor for students. Provide supportive, practical advice about mental health, stress management, study techniques, time management, fitness, finances, and relationships. Keep responses concise and friendly. Use emojis appropriately. If the question is off-topic (not about wellness), politely redirect them back to wellness topics.";

            $fullPrompt = $systemPrompt . "\n\nUser: " . $userMessage . "\n\nAssistant:";

            // Prefer calling the local Ollama HTTP API (faster if the model is already loaded)
            try {
                $resp = Http::timeout(30)->post('http://localhost:11434/api/generate', [
                    'model' => $this->model,
                    'prompt' => $fullPrompt,
                ]);

                \Log::info('Ollama HTTP Response', ['status' => $resp->status(), 'body_preview' => substr($resp->body(), 0, 400)]);

                if (!$resp->ok()) {
                    throw new \Exception('Ollama HTTP error: ' . $resp->status());
                }

                // Ollama may return plain text or JSON depending on version; prefer body
                $aiResponse = trim($resp->body());
            } catch (\Exception $e) {
                \Log::warning('Ollama HTTP call failed, falling back to CLI: ' . $e->getMessage());

                // Fallback to CLI if HTTP fails (keeps previous behavior)
                $cmd = escapeshellarg($this->ollamaBinary) . ' run ' . escapeshellarg($this->model) . ' ' . escapeshellarg($fullPrompt);

                $descriptors = [
                    1 => ['pipe', 'w'], // stdout
                    2 => ['pipe', 'w'], // stderr
                ];

                $process = proc_open($cmd, $descriptors, $pipes);
                if (!is_resource($process)) {
                    throw new \Exception('Failed to start Ollama process');
                }

                $output = stream_get_contents($pipes[1]);
                fclose($pipes[1]);

                $err = stream_get_contents($pipes[2]);
                fclose($pipes[2]);

                $exitCode = proc_close($process);

                \Log::info('Ollama CLI Response', [
                    'exit_code' => $exitCode,
                    'stderr' => substr($err, 0, 400),
                    'stdout' => substr($output, 0, 400),
                ]);

                if ($exitCode !== 0) {
                    throw new \Exception('Ollama CLI returned non-zero exit code: ' . $err);
                }

                $aiResponse = trim($output);
            }

            // Strip optional leading labels like "Assistant:" if present
            if (str_starts_with($aiResponse, 'Assistant:')) {
                $aiResponse = trim(substr($aiResponse, 10));
            }

            return $aiResponse ?: "I'm here to help with wellness questions. Please ask me about mental health, study tips, fitness, finances, or relationships!";

        } catch (\Exception $e) {
            \Log::error('Ollama CLI Error', ['error' => $e->getMessage()]);

            return "I'm currently experiencing connection issues. Please try again in a moment. In the meantime, remember to take care of yourself! 💚";
        }
    }
}