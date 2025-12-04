<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5174',
            'http://localhost:5180',
            'http://127.0.0.1:5180',
        ];

        $origin = $request->header('origin') ?? '';

        // Determine allowed origin value to send back
        $allowOrigin = '*';
        if ($origin !== '') {
            $isLocalhost = preg_match('/localhost|127\.0\.0\.1|0\.0\.0\.0/', $origin);
            if (in_array($origin, $allowedOrigins) || $isLocalhost) {
                $allowOrigin = $origin;
            } else {
                // If origin is present but not allowed, still echo it (useful for debugging).
                $allowOrigin = $origin;
            }
        }

        // If we allow all origins ('*'), we must NOT set Allow-Credentials to true
        $allowCredentials = $allowOrigin === '*' ? 'false' : 'true';

        $headers = [
            'Access-Control-Allow-Origin' => $allowOrigin,
            'Access-Control-Allow-Credentials' => $allowCredentials,
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
            'Access-Control-Allow-Headers' => 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN',
            'Access-Control-Expose-Headers' => 'Content-Length, X-JSON-Response'
        ];

        // Handle preflight requests early
        if ($request->isMethod('OPTIONS')) {
            return response('', 204)->withHeaders($headers);
        }

        $response = $next($request);
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
