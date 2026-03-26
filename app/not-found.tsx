import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-br from-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
            404
          </h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-600 blur-2xl opacity-20 -z-10 rounded-full"></div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Oops! The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium transition-all shadow-lg shadow-purple-500/25 active:scale-95"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}