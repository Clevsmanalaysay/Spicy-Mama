const steps = ["Brief", "Concept", "Pre-production", "Shoot", "Post", "Delivery"];

export function HowWeWork() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold sm:text-3xl">How we work</h2>
      <ol className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3 sm:flex-1 sm:min-w-[9rem]">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-hot font-display text-sm font-bold text-ink">
              {i + 1}
            </span>
            <span className="font-display text-base font-bold text-paper">{step}</span>
            {i < steps.length - 1 ? <span className="hidden text-paper-dim sm:inline">&rarr;</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
