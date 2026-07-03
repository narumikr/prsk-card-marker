interface InputProps {
  className?: string;
  label: string;
}

export const Input = ({ label, className }: InputProps) => {
  return (
    <input
      type="text"
      aria-label={label}
      className={`w-full font-bold rounded border-0 text-center outline-none focus:border-0 focus:outline-none focus:ring-0 ${className}`}
    />
  );
};
