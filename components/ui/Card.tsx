import { cn } from '@/lib/utils/cn';

export default function Card({ children, className, hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-100 rounded-2xl transition-all duration-200',
        hover && 'hover:border-gray-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
