// Implementing a custom Select component because the Shadcn Select is difficult to use. The syntax is aligned with Shadcn's Select.
import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<'select'> & {
    onValueChange?: (value: string) => void;
  }
>(({ className, onChange, ...props }, ref) => {
  const _onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event);
    const value = event.target.value;
    props.onValueChange?.(value);
  };
  return (
    <select
      className={cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className
      )}
      ref={ref}
      onChange={_onChange}
      {...props}
    />
  );
});
Select.displayName = 'Select';

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.ComponentProps<'option'>
>(({ ...props }, ref) => {
  return <option ref={ref} {...props} />;
});
SelectItem.displayName = 'SelectItem';

export { Select, SelectItem };
