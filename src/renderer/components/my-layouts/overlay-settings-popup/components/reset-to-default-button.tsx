import { RotateCcw } from 'lucide-react';

interface ResetToDefaultProps {
  handleReset: () => void;
}

const ResetToDefaultButton = ({ handleReset }: ResetToDefaultProps) => {
  return (
    <button
      onClick={handleReset}
      className="flex items-center space-x-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-xs text-orange-700 transition-colors hover:bg-orange-100"
    >
      <RotateCcw className="h-3 w-3" />
      <span>Reset to default</span>
    </button>
  );
};

export default ResetToDefaultButton;
