import { cn } from '@utils/cn';

export function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            active === cat.id
              ? 'bg-accent text-content-inverse'
              : 'bg-surface-muted text-content-muted hover:text-content'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
