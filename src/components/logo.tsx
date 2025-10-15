import { Sprout } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-lg font-semibold", className)}>
      <div className="p-1.5 bg-primary text-primary-foreground rounded-md">
        <Sprout className="w-5 h-5" />
      </div>
      <span className="font-headline">AgriVision AI</span>
    </Link>
  );
}
