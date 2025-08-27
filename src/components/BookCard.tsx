import type { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const statusConfig = {
    reading: {
      color: 'bg-[#d9a6b3] text-[#232020]',
      label: 'Reading'
    },
    completed: {
      color: 'bg-[#94596b] text-white',
      label: 'Completed'
    },
    'to-read': {
      color: 'bg-[#704a51] text-white',
      label: 'To Read'
    },
  };

  const config = statusConfig[book.status as keyof typeof statusConfig] || statusConfig['to-read'];

  return (
    <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-[#c9b7b4] p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-[#d9a6b3]/20 to-[#b57281]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[#232020] line-clamp-2 group-hover:text-[#b57281] transition-colors">
            {book.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color} transition-all duration-300`}>
            {config.label}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 font-medium">
          by {book.author}
        </p>
        
        {book.notes && (
          <div className="mb-4 p-3 bg-[#d9a6b3]/20 rounded-lg border border-[#c9b7b4]/50">
            <p className="text-sm text-[#704a51] line-clamp-3">
              {book.notes}
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Added {book.createdAt?.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
