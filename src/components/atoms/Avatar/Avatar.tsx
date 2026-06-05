import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = '', fallback = 'U', size = 'md', ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);
    const cn = (...classes: (string | undefined | null | boolean)[]) => 
      classes.filter(Boolean).join(' ');

    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-16 w-16 text-xl font-bold border-2 border-amber-400 shadow-lg'
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 select-none items-center justify-center font-medium text-slate-600 dark:text-slate-300",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="h-full w-full aspect-square object-cover"
          />
        ) : (
          <span className="uppercase">{fallback.slice(0, 2)}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };