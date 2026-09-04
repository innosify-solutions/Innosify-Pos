import { cn } from '@utils/cn';

export function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <div className="flex flex-1 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors',
              active === cat.id
                ? 'bg-emerald-800 text-white'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label="Grid view"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
    </div>
  );
}
