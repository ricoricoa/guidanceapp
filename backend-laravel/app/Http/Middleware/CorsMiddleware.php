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
            'localhost:5173',
            '127.0.0.1:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5174',
            'http://localhost:5180',
            'http://127.0.0.1:5180',
        ];

        $origin = $request->header('origin');
        
        // Allow any localhost origin in development
        $isLocalhost = strpos($origin, 'localhost') !== false || 
                      strpos($origin, '127.0.0.1') !== false ||
                      strpos($origin, '0.0.0.0') !== false;

        if ($isLocalhost) {
            return $next($request)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN')
                ->header('Access-Control-Expose-Headers', 'Content-Length, X-JSON-Response');
        }

        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            return response('', 204)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN');
        }

        return $next($request);
    }
}
