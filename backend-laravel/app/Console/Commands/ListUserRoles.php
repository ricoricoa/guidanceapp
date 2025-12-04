<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class ListUserRoles extends Command
{
    protected $signature = 'app:list-roles';
    protected $description = 'List all unique user roles';

    public function handle()
    {
        $roles = User::select('role')->distinct()->orderBy('role')->get();
        
        $this->info("=== Unique User Roles ===\n");
        foreach ($roles as $r) {
            $count = User::where('role', $r->role)->count();
            $this->line("Role: '{$r->role}' - Count: $count");
        }

        $this->info("\n=== All Users ===\n");
        $users = User::select('id', 'name', 'email', 'role')->orderBy('role')->get();
        foreach ($users as $user) {
            $this->line(sprintf("ID: %2d | %-20s | %-25s | %s", $user->id, $user->name, $user->email, $user->role));
        }
        
        return 0;
    }
}
?>
