import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  className?: string;
  isFocused?: boolean;
}

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { type = 'text', className = '', isFocused = false, ...props },
  ref
) {
  const localRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => (localRef.current as HTMLInputElement));

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <input
      {...props}
      type={type}
      className={'rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition ' + className}
      ref={localRef}
    />
  );
});
