import { useState } from 'react';
import type { MediaSummary } from './shared/types';
import { useAppLocation } from './lib/router';
import DetailModal from './components/DetailModal';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import CuratedPage from './pages/CuratedPage';
import DiscoverPage from './pages/DiscoverPage';
import HomePage from './pages/HomePage';
import MyVaultPage from './pages/MyVaultPage';
import PersonPage from './pages/PersonPage';
import PlayPage from './pages/PlayPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  const loc = useAppLocation();
  const [selectedItem, setSelectedItem] = useState<MediaSummary | null>(null);

  const renderPage = () => {
    const path = loc.pathname;

    if (path === '/discover') {
      return <DiscoverPage onInspect={setSelectedItem} />;
    }
    if (path === '/search') {
      return <SearchPage onInspect={setSelectedItem} />;
    }
    if (path === '/my') {
      return <MyVaultPage onInspect={setSelectedItem} />;
    }
    if (path === '/play') {
      return <PlayPage onInspect={setSelectedItem} />;
    }
    if (path.startsWith('/curated/')) {
      const slug = path.replace('/curated/', '').split('/')[0];
      return <CuratedPage slug={slug} onInspect={setSelectedItem} />;
    }
    if (path.startsWith('/person/')) {
      const id = Number(path.replace('/person/', '').split('/')[0]);
      return <PersonPage personId={id} onInspect={setSelectedItem} />;
    }

    return <HomePage onInspect={setSelectedItem} />;
  };

  return (
    <div className="dx-stage-bg min-h-screen flex flex-col text-[#f5f0ff]">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSelectOther={(other) => setSelectedItem(other)}
      />
    </div>
  );
}
