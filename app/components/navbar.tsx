// app/components/navbar.tsx
'use client'

import Link from 'next/link';
import { Search, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import { signOutUser } from '@/app/actions/auth.actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  return (
    <nav className="bg-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Search className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="ml-2 text-lg font-semibold text-foreground">Person Search</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/github" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              GitHub
            </Link>
            <Link href="/database" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Database
            </Link>

            {session?.user ? (
              <>
                <span className="text-foreground text-sm px-2 py-1">
                  {session.user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}