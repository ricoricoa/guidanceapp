<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class FixUserRole extends Command
{
    protected $signature = 'app:fix-user-role {username} {role=counselor}';
    protected $description = 'Fix a user role (default: counselor)';

    public function handle()
    {
        $username = $this->argument('username');
        $role = $this->argument('role');

        $user = User::where('name', $username)->first();

        if (!$user) {
            $this->error("User '$username' not found");
            return 1;
        }

        $oldRole = $user->role;
        $user->update(['role' => $role]);

        $this->info("✅ Updated user '$username' role from '$oldRole' to '$role'");
        return 0;
    }
}
?>
