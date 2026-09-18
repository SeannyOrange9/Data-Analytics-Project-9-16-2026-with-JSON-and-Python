import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 text-center">
      <div className="rounded-2xl bg-white p-10 shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">404</h1>
        <p className="mt-1 text-sm text-slate-500">This page is off the map.</p>
        <Link to="/dashboard" className="mt-6 inline-flex">
          <Button>
            <Home className="h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}