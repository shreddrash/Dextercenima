import { useCallback, useEffect, useState } from 'react';
import DetailModal from './components/DetailModal';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import NetflixIntroSplash from './components/NetflixIntroSplash';
import PlatformLauncher from './components/PlatformLauncher';
import ProfileGateModal from './components/ProfileGateModal';
import {
  applyPlatformThemeCssVars,
  getActivePlatform,
  shouldShowPlatformLauncher,
  subscribePlatformLauncherOpen,
  subscribePlatformUpdates,
} from './lib/platform';
import {
  getActiveProfile,
  shouldShowProfileGate,
  subscribeProfileGateOpen,
  subscribeProfileUpdates,
} from './lib/profiles';
import { useAppLocation } from './lib/router';
import CuratedPage from './pages/CuratedPage';
import DiscoverPage from './pages/DiscoverPage';
import HomePage from './pages/HomePage';
import MyVaultPage from './pages/MyVaultPage';
import PersonPage from './pages/PersonPage';
import PlayPage from './pages/PlayPage';
import SearchPage from './pages/SearchPage';
import type { MediaSummary, StreamingPlatform, UserProfile } from './shared/types';

export default function App() {
  const loc = useAppLocation();
  const [selectedItem, setSelectedItem] = useState<MediaSummary | null>(null);
  const [activePlatform, setActivePlatformState] = useState<StreamingPlatform>(() =>
    getActivePlatform(),
  );
  const [activeProfile, setActiveProfileState] = useState<UserProfile>(() =>
    getActiveProfile(getActivePlatform()),
  );

  const [launcherOpen, setLauncherOpen] = useState<boolean>(() => shouldShowPlatformLauncher());
  const [hasPickedPlatform, setHasPickedPlatform] = useState<boolean>(
    () => !shouldShowPlatformLauncher(),
  );

  const [splashOpen, setSplashOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.location.pathname === '/play') return false;
    return !shouldShowPlatformLauncher();
  });
  const [gateOpen, setGateOpen] = useState<boolean>(() =>
    shouldShowProfileGate(getActivePlatform()),
  );

  const handleCloseSplash = useCallback(() => {
    setSplashOpen(false);
  }, []);

  useEffect(() => {
    applyPlatformThemeCssVars(activePlatform);
  }, [activePlatform]);

  useEffect(() => {
    const unsubPlatform = subscribePlatformUpdates(() => {
      const next = getActivePlatform();
      setActivePlatformState(next);
      setActiveProfileState(getActiveProfile(next));
      setSelectedItem(null);
    });
    const unsubLauncher = subscribePlatformLauncherOpen(() => {
      setLauncherOpen(true);
    });
    const unsubProfile = subscribeProfileUpdates(() => {
      setActiveProfileState(getActiveProfile(getActivePlatform()));
      setSelectedItem(null);
    });
    const unsubGate = subscribeProfileGateOpen(() => {
      if (getActivePlatform() !== 'crunchyroll') {
        setGateOpen(true);
      }
    });
    return () => {
      unsubPlatform();
      unsubLauncher();
      unsubProfile();
      unsubGate();
    };
  }, []);

  const handlePlatformChosen = (platform: StreamingPlatform) => {
    setActivePlatformState(platform);
    setActiveProfileState(getActiveProfile(platform));
    setSelectedItem(null);
    setHasPickedPlatform(true);
    setLauncherOpen(false);
    setSplashOpen(true);
    setGateOpen(platform !== 'crunchyroll' && shouldShowProfileGate(platform));
  };

  const renderPage = () => {
    const path = loc.pathname;

    if (path === '/discover') {
      return (
        <DiscoverPage
          platform={activePlatform}
          activeProfile={activeProfile}
          onInspect={setSelectedItem}
        />
      );
    }
    if (path === '/search') {
      return (
        <SearchPage
          platform={activePlatform}
          activeProfile={activeProfile}
          onInspect={setSelectedItem}
        />
      );
    }
    if (path === '/my') {
      return (
        <MyVaultPage
          platform={activePlatform}
          activeProfile={activeProfile}
          onInspect={setSelectedItem}
        />
      );
    }
    if (path === '/play') {
      return (
        <PlayPage
          platform={activePlatform}
          activeProfile={activeProfile}
          onInspect={setSelectedItem}
        />
      );
    }
    if (path.startsWith('/curated/')) {
      const slug = path.replace('/curated/', '').split('/')[0];
      return (
        <CuratedPage
          slug={slug}
          platform={activePlatform}
          activeProfile={activeProfile}
          onInspect={setSelectedItem}
        />
      );
    }
    if (path.startsWith('/person/')) {
      const id = Number(path.replace('/person/', '').split('/')[0]);
      return (
        <PersonPage
          personId={id}
          platform={activePlatform}
          onInspect={setSelectedItem}
        />
      );
    }

    return (
      <HomePage
        platform={activePlatform}
        activeProfile={activeProfile}
        onInspect={setSelectedItem}
      />
    );
  };

  return (
    <div className="dx-stage-bg min-h-screen flex flex-col text-white">
      <Navbar
        platform={activePlatform}
        activeProfile={activeProfile}
        onInspect={setSelectedItem}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer platform={activePlatform} activeProfile={activeProfile} />

      <DetailModal
        item={selectedItem}
        platform={activePlatform}
        isKidsMode={activePlatform === 'netflix' && activeProfile.isKids}
        onClose={() => setSelectedItem(null)}
        onSelectOther={(other) => setSelectedItem(other)}
      />

      <PlatformLauncher
        open={launcherOpen}
        canDismiss={hasPickedPlatform}
        activePlatform={activePlatform}
        onSelectPlatform={handlePlatformChosen}
        onDismiss={() => setLauncherOpen(false)}
      />

      <NetflixIntroSplash
        open={splashOpen && !launcherOpen}
        platform={activePlatform}
        durationMs={4800}
        onFinish={handleCloseSplash}
      />

      <ProfileGateModal
        open={gateOpen && !splashOpen && !launcherOpen && activePlatform !== 'crunchyroll'}
        platform={activePlatform}
        onClose={() => setGateOpen(false)}
        onProfileSelected={(profile) => {
          setActiveProfileState(profile);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
