import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Book, Dumbbell, Briefcase, Moon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-zinc-100 font-body relative overflow-x-hidden p-6 max-w-md mx-auto">
      {/* Background Ambience */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 h-16 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around z-50 shadow-2xl max-w-sm mx-auto">
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Home" />
        <NavItem to="/spiritual" icon={<Book size={20} />} label="Spirit" />
        <NavItem to="/physical" icon={<Dumbbell size={20} />} label="Body" />
        <NavItem to="/work" icon={<Briefcase size={20} />} label="Work" />
        <NavItem to="/journal" icon={<Moon size={20} />} label="Night" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={cn("flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300", isActive ? "text-primary scale-110" : "text-zinc-500 hover:text-zinc-300")}>
      {icon}
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </Link>
  );
}
