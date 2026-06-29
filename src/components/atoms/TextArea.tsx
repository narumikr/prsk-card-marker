interface TextAreaProps {
  className?: string;
  label: string;
}

export const TextArea = ({ label, className }: TextAreaProps) => {
  return (
    <textarea
      aria-label={label}
      className={`resize-none rounded border-0 font-bold outline-none focus:border-0 focus:outline-none focus:ring-0 ${className}`}
    />
  );
};
