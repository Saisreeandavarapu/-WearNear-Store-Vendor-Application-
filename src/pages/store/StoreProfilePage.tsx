import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Building2,
  Clock,
  Star,
  Camera,
  Edit,
  CheckCircle2,
  Save,
  X,
  Sparkles,
  Upload,
  ExternalLink
} from 'lucide-react';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { buttonTapVariants, cardInteractiveVariants } from '../../utils/animations';

export const StoreProfilePage: React.FC = () => {
  const { store, updateStoreProfile } = useAuth();
  const { success } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [tagline, setTagline] = useState(store.tagline);
  const [operatingHours, setOperatingHours] = useState(store.operatingHours);
  const [phone, setPhone] = useState(store.phone);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateStoreProfile({ tagline, operatingHours, phone });
      setIsSaving(false);
      setIsEditing(false);
      success('Store Profile Updated', 'Boutique details saved to WearNear consumer directory.');
    }, 400);
  };

  return (
    <AnimatedPage className="space-y-6">
      <PageHeader
        title="Store Profile & Showcase"
        subtitle="Manage your boutique brand presence, operating hours, geolocation, and store photos."
        breadcrumbs={[{ label: 'Store' }, { label: 'Store Profile' }]}
        badge={<StatusBadge status={store.status} size="md" />}
        actions={
          <motion.button
            variants={buttonTapVariants}
            whileTap="tap"
            onClick={() => setIsEditing(!isEditing)}
            className="wn-btn-secondary text-xs sm:text-sm flex items-center gap-1.5"
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit className="w-3.5 h-3.5 text-[#172B82]" />
                <span>Edit Profile</span>
              </>
            )}
          </motion.button>
        }
      />

      {/* Edit Mode Banner / Form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSave} className="bg-white rounded-2xl border-2 border-[#172B82]/20 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD7CA]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#172B82]" />
                  <h3 className="text-sm font-bold text-[#172033]">Quick Edit Boutique Details</h3>
                </div>
                <span className="text-[11px] text-[#687085]">Instant directory sync</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#172033] font-bold mb-1">Store Tagline / Bio</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] text-xs font-medium focus:border-[#172B82] outline-none"
                    placeholder="e.g. Premium Artisanal Silk & Handloom Boutique"
                  />
                </div>

                <div>
                  <label className="block text-[#172033] font-bold mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] text-xs font-medium focus:border-[#172B82] outline-none"
                    placeholder="e.g. 10:00 AM - 09:30 PM (Mon-Sun)"
                  />
                </div>

                <div>
                  <label className="block text-[#172033] font-bold mb-1">Store Hotline Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD7CA] bg-[#FFFCF5] text-xs font-medium focus:border-[#172B82] outline-none"
                  />
                </div>

                <div className="flex items-end justify-end gap-2 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#DDD7CA] text-xs font-bold text-[#687085] hover:bg-[#F5F0E6]"
                  >
                    Cancel
                  </button>
                  <motion.button
                    variants={buttonTapVariants}
                    whileTap="tap"
                    type="submit"
                    disabled={isSaving}
                    className="wn-btn-primary text-xs flex items-center gap-1.5"
                  >
                    {isSaving ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save Changes</span>
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Profile Showcase Card */}
      <motion.div
        variants={cardInteractiveVariants}
        className="bg-white rounded-3xl border border-[#DDD7CA] overflow-hidden shadow-xs"
      >
        {/* Cover / Store Front Photo */}
        <div className="h-44 sm:h-64 relative bg-[#172B82] overflow-hidden">
          <img
            src="/assets/boutique_store.png"
            alt={store.name}
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Overlaid Logo */}
          <div className="absolute bottom-4 left-4 sm:left-6 flex items-end gap-3.5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 border border-[#DDD7CA] shadow-lg flex items-center justify-center shrink-0">
              <img
                src="/image.png"
                alt="WearNear"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white pr-4">
              <h2 className="text-lg sm:text-2xl font-extrabold leading-tight">
                {store.name}
              </h2>
              <p className="text-xs text-white/85 mt-0.5 line-clamp-1">{store.tagline}</p>
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-4 sm:p-8 space-y-6">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA]">
              <span className="text-[11px] text-[#687085] block font-medium">Customer Rating</span>
              <div className="flex items-center gap-1 mt-0.5 font-extrabold text-sm sm:text-base text-[#172033]">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span>{store.rating} / 5.0</span>
                <span className="text-[10px] sm:text-[11px] font-normal text-[#687085]">
                  ({store.totalReviews})
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA]">
              <span className="text-[11px] text-[#687085] block font-medium">Operating Hours</span>
              <span className="font-bold text-xs sm:text-sm text-[#172033] block mt-0.5 truncate">
                {store.operatingHours}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA]">
              <span className="text-[11px] text-[#687085] block font-medium">Business Constitution</span>
              <span className="font-bold text-xs sm:text-sm text-[#172033] block mt-0.5">
                {store.businessType}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA]">
              <span className="text-[11px] text-[#687085] block font-medium">Platform Tier</span>
              <span className="font-bold text-xs sm:text-sm text-[#172B82] block mt-0.5">
                Verified Boutique
              </span>
            </div>
          </div>

          {/* Details & Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-[#DDD7CA]">
            {/* Contact & Registration */}
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-bold text-[#172033]">Store Contact & Registration</h4>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#172033]">
                  <div className="w-7 h-7 rounded-lg bg-[#172B82]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[#172B82]" />
                  </div>
                  <span className="font-medium">{store.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#172033]">
                  <div className="w-7 h-7 rounded-lg bg-[#172B82]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-[#172B82]" />
                  </div>
                  <span className="font-medium truncate">{store.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#172033]">
                  <div className="w-7 h-7 rounded-lg bg-[#172B82]/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-[#172B82]" />
                  </div>
                  <span>GSTIN: <strong>{store.gstin}</strong> (PAN: {store.panNumber})</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#172033]">
                  <div className="w-7 h-7 rounded-lg bg-[#172B82]/10 flex items-center justify-center shrink-0">
                    <Store className="w-3.5 h-3.5 text-[#172B82]" />
                  </div>
                  <span>Store Owner: <strong>{store.ownerName}</strong></span>
                </div>
              </div>
            </div>

            {/* Geolocation & Counter Address */}
            <div className="space-y-3 text-xs">
              <h4 className="text-sm font-bold text-[#172033]">Boutique Physical Address</h4>
              <div className="p-3.5 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] space-y-1.5">
                <p className="font-semibold text-[#172033] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#172B82] shrink-0" />
                  {store.address.street}
                </p>
                <p className="text-[#687085] pl-5">
                  {store.address.locality}, {store.address.city}, {store.address.state} -{' '}
                  {store.address.pincode}
                </p>
                <p className="text-[11px] text-[#172B82] font-semibold pl-5 pt-1">
                  GPS Coordinates: {store.address.coordinates?.lat}, {store.address.coordinates?.lng}
                </p>
              </div>
            </div>
          </div>

          {/* Store Visual Gallery */}
          <div className="pt-4 border-t border-[#DDD7CA] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h4 className="text-sm font-bold text-[#172033]">Store Showcase Gallery</h4>
              <span className="text-[11px] text-[#687085]">Visible on WearNear customer mobile app</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="aspect-video rounded-2xl overflow-hidden border border-[#DDD7CA] relative group shadow-2xs"
              >
                <img
                  src="/assets/boutique_store.png"
                  alt="Storefront"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-lg font-semibold">
                  Main Boutique Counter
                </span>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                className="aspect-video rounded-2xl overflow-hidden border border-[#DDD7CA] relative group shadow-2xs"
              >
                <img
                  src="/assets/hero_banner.png"
                  alt="Garment racks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-lg font-semibold">
                  Apparel Display Section
                </span>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                className="aspect-video rounded-2xl border-2 border-dashed border-[#DDD7CA] flex flex-col items-center justify-center p-3 hover:border-[#172B82] cursor-pointer transition-colors col-span-2 sm:col-span-1"
              >
                <Camera className="w-5 h-5 text-[#687085] mb-1" />
                <span className="text-xs font-bold text-[#172033]">Upload Photo</span>
                <span className="text-[10px] text-[#687085]">JPG / PNG (Min 1080p)</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
};

