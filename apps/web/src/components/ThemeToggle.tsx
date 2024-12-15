'use client';

import { Moon, Sun } from '@repo/ui/icons';
import { useTheme } from 'next-themes';

import { Button } from '@repo/ui/button';
import { useIsMounted } from '@/lib/hooks/use-is-mouted';
import { Skeleton } from '@repo/ui/skeleton';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();
  console.log(theme);

  if (!isMounted) return <Skeleton className="!size-7 sm:!size-8" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-foreground"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
