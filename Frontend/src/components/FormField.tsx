interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  maxLength: number;
  autoFocus?: boolean;
  onChange: (value: string) => void;
}

const FormField = ({
  id,
  label,
  value,
  maxLength,
  autoFocus,
  onChange,
}: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default FormField;
