import * as React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const radioId = id || React.useId();
    const cn = (...classes: (string | undefined | null | boolean)[]) => 
      classes.filter(Boolean).join(' ');

    return (
      <div className="flex items-center space-x-2 select-none">
        <div className="relative flex items-center">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            className={cn(
              "peer h-4 w-4 rounded-full border border-slate-300 bg-white text-amber-600 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-amber-500 dark:focus:ring-offset-slate-950 appearance-none checked:border-amber-500 transition-all duration-150 cursor-pointer",
              className
            )}
            {...props}
          />
          <span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-amber-500 scale-0 peer-checked:scale-100 transition-transform duration-150 pointer-events-none" />
        </div>
        {label && (
          <label
            htmlFor={radioId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

export { Radio };