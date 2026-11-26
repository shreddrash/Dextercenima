import { Check, Pencil, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { openPlatformLauncher } from '../lib/platform';
import {
  addProfile,
  AVATAR_CHOICES,
  deleteProfile,
  dismissProfileGate,
  getProfiles,
  setActiveProfile,
  updateProfile,
} from '../lib/profiles';
import type { ProfileAvatarId, StreamingPlatform, UserProfile } from '../shared/types';
import { DEXTERX_LOGO_URL } from './Navbar';
import ProfileAvatar from './ProfileAvatar';

interface ProfileGateModalProps {
  open: boolean;
  platform: StreamingPlatform;
  onClose: () => void;
  onProfileSelected: (profile: UserProfile) => void;
}

export default function ProfileGateModal({
  open,
  platform,
  onClose,
  onProfileSelected,
}: ProfileGateModalProps) {
  const isPrime = platform === 'prime';
  const [profiles, setProfiles] = useState<UserProfile[]>(() => getProfiles(platform));
  const [managing, setManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [creating, setCreating] = useState(false);

  const [formName, setFormName] = useState('');
  const [formAvatar, setFormAvatar] = useState<ProfileAvatarId>(
    isPrime ? 'prime-ghost' : 'netflix-blue',
  );
  const [formKids, setFormKids] = useState(false);

  useEffect(() => {
    setProfiles(getProfiles(platform));
    setManaging(false);
    setEditingProfile(null);
    setCreating(false);
    setFormAvatar(platform === 'prime' ? 'prime-ghost' : 'netflix-blue');
    setFormKids(false);
  }, [platform, open]);

  if (!open) return null;

  const refreshProfiles = () => setProfiles(getProfiles(platform));

  const handleSelectProfile = (p: UserProfile) => {
    if (managing) {
      setEditingProfile(p);
      setFormName(p.name);
      setFormAvatar(p.avatarId);
      setFormKids(isPrime ? false : p.isKids);
      return;
    }
    const activated = setActiveProfile(p.id, true, platform);
    onProfileSelected(activated);
    onClose();
  };

  const openCreate = () => {
    setCreating(true);
    setFormName('');
    setFormAvatar(isPrime ? 'prime-ghost' : 'netflix-blue');
    setFormKids(false);
  };

  const handleSaveNew = () => {
    if (!formName.trim()) return;
    const created = addProfile(formName, formAvatar, isPrime ? false : formKids, platform);
    refreshProfiles();
    setCreating(false);
    const activated = setActiveProfile(created.id, true, platform);
    onProfileSelected(activated);
    onClose();
  };

  const handleSaveEdit = () => {
    if (!editingProfile || !formName.trim()) return;
    updateProfile(
      editingProfile.id,
      {
        name: formName,
        avatarId: formAvatar,
        isKids: isPrime ? false : formKids,
      },
      platform,
    );
    refreshProfiles();
    setEditingProfile(null);
  };

  const handleDelete = () => {
    if (!editingProfile || profiles.length <= 1) return;
    deleteProfile(editingProfile.id, platform);
    refreshProfiles();
    setEditingProfile(null);
  };

  const avatarOptions = isPrime
    ? AVATAR_CHOICES.filter((a) => a.id !== 'netflix-kids' && a.id !== 'crunchyroll-orange')
    : AVATAR_CHOICES.filter((a) => a.id !== 'crunchyroll-orange');

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto ${
        isPrime
          ? 'bg-[radial-gradient(ellipse_at_top,#082036_0%,#00050D_65%)]'
          : 'bg-[#141414]'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Profile Selection"
    >
      {/* Top Brand Header inside Gate */}
      <div className="absolute left-5 top-5 right-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src={DEXTERX_LOGO_URL}
            alt="Dexterx Cenima"
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded border border-white/15 object-cover"
          />
          {isPrime ? (
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-black tracking-tight text-white">
                prime <span className="font-normal text-[#00A8E1]">video</span>
              </span>
            </div>
          ) : (
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              DEXTERX <span className="text-[#E50914]">CENIMA</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              openPlatformLauncher();
            }}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              isPrime
                ? 'border-[#00A8E1]/40 bg-[#0F171E] text-[#00A8E1] hover:bg-[#00A8E1] hover:text-white'
                : 'border-white/25 bg-white/5 text-white/85 hover:bg-white/15'
            }`}
          >
            Switch App
          </button>

          <button
            type="button"
            onClick={() => {
              dismissProfileGate(platform);
              onClose();
            }}
            aria-label="Continue watching"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Add / Edit Sub-View */}
      {creating || editingProfile ? (
        <div className="w-full max-w-lg border-t border-b border-white/15 py-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">
            {creating ? (isPrime ? 'New Profile' : 'Add Profile') : 'Edit Profile'}
          </h1>
          <p className="mt-1 text-sm text-[#808080]">
            {creating
              ? isPrime
                ? 'Create a Prime Video profile for another viewer.'
                : 'Add a profile for another person watching Netflix on Dexterx.'
              : 'Customize profile name and avatar icon.'}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-white/15 pb-6">
            <ProfileAvatar
              avatarId={formAvatar}
              name={formName || 'Profile'}
              size="lg"
              className={isPrime ? '!rounded-full ring-2 ring-[#00A8E1]' : ''}
            />

            <div className="w-full flex-1 space-y-4">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Profile Name"
                maxLength={24}
                autoFocus
                className={`h-11 w-full px-4 text-base text-white placeholder:text-[#8c8c8c] focus:outline-none focus:ring-2 ${
                  isPrime
                    ? 'rounded-lg bg-[#0F171E] border border-[#00A8E1]/40 focus:ring-[#00A8E1]'
                    : 'bg-[#333333] focus:ring-white'
                }`}
              />

              {!isPrime && (
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={formKids}
                    onClick={() => {
                      const nextKids = !formKids;
                      setFormKids(nextKids);
                      if (nextKids) setFormAvatar('netflix-kids');
                    }}
                    className={`flex h-7 w-7 items-center justify-center border transition-colors cursor-pointer ${
                      formKids
                        ? 'border-white bg-[#E50914] text-white'
                        : 'border-[#808080] bg-transparent text-transparent'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                    <ShieldCheck className="h-4 w-4 text-sky-400" />
                    <span>Kid? (Strictly Kids movies &amp; cartoons only)</span>
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#b3b3b3]">
              Choose Profile Icon
            </p>
            <div className="flex flex-wrap gap-3">
              {avatarOptions.map((choice) => {
                const selected = formAvatar === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => setFormAvatar(choice.id)}
                    title={choice.label}
                    className={`p-0.5 transition-transform cursor-pointer ${
                      isPrime ? 'rounded-full' : 'rounded-md'
                    } ${
                      selected
                        ? isPrime
                          ? 'ring-2 ring-[#00A8E1] scale-105'
                          : 'ring-2 ring-white scale-105'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <ProfileAvatar
                      avatarId={choice.id}
                      name={choice.label}
                      size="md"
                      className={isPrime ? '!rounded-full' : ''}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={creating ? handleSaveNew : handleSaveEdit}
              disabled={!formName.trim()}
              className={`h-11 px-7 text-sm font-bold tracking-wide transition-colors disabled:opacity-40 cursor-pointer ${
                isPrime
                  ? 'rounded-lg bg-[#00A8E1] text-white hover:bg-[#1A98FF]'
                  : 'bg-white text-black hover:bg-[#E50914] hover:text-white'
              }`}
            >
              {creating ? 'Continue' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditingProfile(null);
              }}
              className={`h-11 border px-7 text-sm font-semibold transition-colors cursor-pointer ${
                isPrime
                  ? 'rounded-lg border-white/25 text-white/75 hover:border-white hover:text-white'
                  : 'border-[#808080] text-[#808080] hover:border-white hover:text-white'
              }`}
            >
              Cancel
            </button>
            {editingProfile && profiles.length > 1 && (
              <button
                type="button"
                onClick={handleDelete}
                className="ml-auto inline-flex h-11 items-center gap-1.5 border border-red-500/40 px-5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-600 hover:text-white cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Profile</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Main "Who's watching?" Grid */
        <div className="w-full max-w-4xl text-center">
          <h1 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white">
            {managing
              ? 'Manage Profiles:'
              : isPrime
                ? "Who's watching Prime Video?"
                : "Who's watching?"}
          </h1>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-start justify-center gap-6 sm:gap-10">
            {profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectProfile(p)}
                className="group flex w-28 sm:w-36 flex-col items-center cursor-pointer focus:outline-none"
              >
                <div
                  className={`relative overflow-hidden transition-all duration-200 ${
                    isPrime
                      ? 'rounded-full ring-2 ring-[#00A8E1]/50 group-hover:ring-4 group-hover:ring-[#00A8E1] group-hover:shadow-[0_0_32px_rgba(0,168,225,0.55)]'
                      : 'rounded-md ring-2 ring-transparent group-hover:ring-4 group-hover:ring-white'
                  }`}
                >
                  <ProfileAvatar
                    avatarId={p.avatarId}
                    name={p.name}
                    size="xl"
                    className={isPrime ? '!rounded-full' : ''}
                  />
                  {managing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black/60 text-white">
                        <Pencil className="h-4 w-4" />
                      </span>
                    </div>
                  )}
                  {!isPrime && p.isKids && (
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                      Kids
                    </span>
                  )}
                </div>
                <span
                  className={`mt-3 max-w-full truncate text-sm sm:text-lg font-medium transition-colors ${
                    isPrime
                      ? 'text-[#9cb3c9] group-hover:text-white'
                      : 'text-[#808080] group-hover:text-white'
                  }`}
                >
                  {p.name}
                </span>
              </button>
            ))}

            {profiles.length < 8 && (
              <button
                type="button"
                onClick={openCreate}
                className="group flex w-28 sm:w-36 flex-col items-center cursor-pointer focus:outline-none"
              >
                <div
                  className={`flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center transition-all duration-200 ${
                    isPrime
                      ? 'rounded-full border-2 border-dashed border-[#00A8E1]/45 bg-[#0F171E] text-[#00A8E1] group-hover:border-[#00A8E1] group-hover:bg-[#16212C] group-hover:text-white'
                      : 'rounded-md border-2 border-transparent bg-[#262626] text-[#808080] group-hover:border-white group-hover:bg-[#333333] group-hover:text-white'
                  }`}
                >
                  <Plus className="h-12 w-12" />
                </div>
                <span
                  className={`mt-3 text-sm sm:text-lg font-medium transition-colors ${
                    isPrime
                      ? 'text-[#9cb3c9] group-hover:text-white'
                      : 'text-[#808080] group-hover:text-white'
                  }`}
                >
                  {isPrime ? 'Create' : 'Add Profile'}
                </span>
              </button>
            )}
          </div>

          <div className="mt-12">
            <button
              type="button"
              onClick={() => setManaging((prev) => !prev)}
              className={`px-7 py-2.5 text-sm sm:text-base font-medium tracking-widest uppercase transition-colors cursor-pointer ${
                isPrime
                  ? 'rounded-lg border border-[#00A8E1]/50 bg-[#0F171E] text-[#00A8E1] hover:bg-[#00A8E1] hover:text-white'
                  : 'border border-[#808080] text-[#808080] hover:border-white hover:text-white'
              }`}
            >
              {managing ? 'Done' : 'Manage Profiles'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
