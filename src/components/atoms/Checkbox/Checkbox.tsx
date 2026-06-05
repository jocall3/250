import * as React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    const cn = (...classes: (string | undefined | null | boolean)[]) => 
      classes.filter(Boolean).join(' ');

    return (
      <div className="flex items-center space-x-2 select-none">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded border border-slate-300 bg-white text-amber-600 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-amber-500 dark:focus:ring-offset-slate-950 appearance-none checked:bg-amber-500 checked:border-amber-500 transition-all duration-150 cursor-pointer",
              className
            )}
            {...props}
          />
          <svg
            className="absolute left-0.5 top-0.5 h-3 w-3 pointer-events-none text-white hidden peer-checked:block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };