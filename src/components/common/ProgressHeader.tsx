interface ProgressHeaderProps {
  step: number;
  total?: number;
}

export function ProgressHeader({ step, total = 5 }: ProgressHeaderProps) {
  const progress = (step / total) * 100;

  return (
    <header className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">Health quiz</span>
        <span className="text-sm font-medium text-slate-500">
          Step {step}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
