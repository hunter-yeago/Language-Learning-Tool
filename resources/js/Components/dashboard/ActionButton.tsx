import { voidFunction } from "@/types/types";

type ButtonColor = 'blue' | 'green' | 'red';

interface ActionButtonProps {
  onClick: voidFunction;
  processing: boolean;
  color: ButtonColor;
  text: string;
}

export default function ActionButton({ onClick, processing, color, text }: ActionButtonProps) {
  const colorClasses: Record<ButtonColor, string> = {
    blue: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  }

  return (
    <button
      onClick={onClick}
      disabled={processing}
      className={`px-5 py-2.5 text-white rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${colorClasses[color] || colorClasses.blue}`}
    >
      {processing ? 'Loading...' : text}
    </button>
  )
}
