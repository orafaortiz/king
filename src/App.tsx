import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/layouts/AppLayout';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { SpiritualRoutine } from '@/features/spiritual/SpiritualRoutine';
import { PhysicalRoutine } from '@/features/physical/PhysicalRoutine';
import { WorkRoutine } from '@/features/work/WorkRoutine';
import { NightRoutine } from '@/features/journal/NightRoutine';
import { StatisticsPage } from '@/features/dashboard/StatisticsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/spiritual" element={<SpiritualRoutine />} />
            <Route path="/physical" element={<PhysicalRoutine />} />
            <Route path="/work" element={<WorkRoutine />} />
            <Route path="/journal" element={<NightRoutine />} />
            <Route path="/stats" element={<StatisticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
