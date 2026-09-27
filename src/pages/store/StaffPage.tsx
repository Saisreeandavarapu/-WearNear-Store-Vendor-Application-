import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShieldCheck, Check, Edit2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BottomSheet } from '../../components/common/BottomSheet';
import { AnimatedPage } from '../../components/common/AnimatedPage';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StaffMember, StaffPermission } from '../../types';
import { staggerContainer, staggerItem } from '../../utils/animations';

export const StaffPage: React.FC = () => {
  const { staff, addStaffMember, updateStaffMember } = useData();
  const { success } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaffForPerms, setSelectedStaffForPerms] = useState<StaffMember | null>(null);

  // New Staff form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Store Manager' | 'Inventory Lead' | 'Sales Executive' | 'Billing Operator'>('Store Manager');

  const allPermissions: { code: StaffPermission; label: string; desc: string }[] = [
    { code: 'PRODUCT_READ', label: 'View Products', desc: 'Browse catalog and prices' },
    { code: 'PRODUCT_CREATE', label: 'Create Garments', desc: 'Add new garments and SKUs' },
    { code: 'PRODUCT_UPDATE', label: 'Update Garments', desc: 'Edit prices and descriptions' },
    { code: 'INVENTORY_READ', label: 'View Stock', desc: 'View physical inventory levels' },
    { code: 'INVENTORY_UPDATE', label: 'Adjust Stock', desc: 'Add stock and manual corrections' },
    { code: 'ORDER_READ', label: 'View Orders', desc: 'Read customer order details' },
    { code: 'ORDER_UPDATE', label: 'Process Orders', desc: 'Accept, pack, and mark ready' },
    { code: 'BILL_CREATE', label: 'Create Invoices', desc: 'Generate retail GST bills' }
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addStaffMember({
      name,
      phone,
      email,
      role,
      status: 'ACTIVE',
      permissions: ['PRODUCT_READ', 'ORDER_READ', 'ORDER_UPDATE', 'BILL_CREATE'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    });

    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    success('Staff Member Added', `${name} invited to WearNear Store portal.`);
  };

  const togglePermission = (permCode: StaffPermission) => {
    if (!selectedStaffForPerms) return;
    const has = selectedStaffForPerms.permissions.includes(permCode);
    const updated = has
      ? selectedStaffForPerms.permissions.filter((p) => p !== permCode)
      : [...selectedStaffForPerms.permissions, permCode];

    updateStaffMember(selectedStaffForPerms.id, { permissions: updated });
    setSelectedStaffForPerms({ ...selectedStaffForPerms, permissions: updated });
    success('Permissions Saved', `Updated access privileges for ${selectedStaffForPerms.name}`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
        <PageHeader
          title="Store Team & Permissions"
          subtitle="Manage store managers, packing operators, billing associates, and granular access controls."
          breadcrumbs={[{ label: 'Store' }, { label: 'Staff' }]}
          actions={
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="wn-btn-primary text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" /> Add Team Member
            </motion.button>
          }
        />

        {/* Staff Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {staff.map((member) => (
            <motion.div
              key={member.id}
              variants={staggerItem}
              whileTap={{ scale: 0.99 }}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DDD7CA] shadow-xs flex flex-col justify-between select-none"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#DDD7CA]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#172033]">{member.name}</h4>
                      <p className="text-xs text-[#172B82] font-semibold">{member.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={member.status} size="sm" />
                </div>

                <div className="space-y-1 text-xs text-[#687085] py-2 border-y border-[#DDD7CA]/50">
                  <p className="font-mono">{member.phone}</p>
                  <p className="truncate">{member.email}</p>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-bold text-[#687085] uppercase tracking-wider block mb-1.5">
                    Granted Permissions ({member.permissions.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.permissions.slice(0, 4).map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FFFCF5] border border-[#DDD7CA] text-[#172033]"
                      >
                        {p.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {member.permissions.length > 4 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#172B82]/10 text-[#172B82]">
                        +{member.permissions.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DDD7CA]">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStaffForPerms(member)}
                  className="w-full wn-btn-secondary text-xs py-2 min-h-[38px] flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#172B82]" />
                  <span>Configure Access Rights</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Staff Member BottomSheet */}
        <BottomSheet
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Invite Store Associate"
          subtitle="Assign roles and operational credentials for store associates"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 py-1">
            <div>
              <label className="wn-label">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="wn-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="wn-label">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="wn-input"
                />
              </div>

              <div>
                <label className="wn-label">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="wn-input"
                >
                  <option>Store Manager</option>
                  <option>Inventory Lead</option>
                  <option>Sales Executive</option>
                  <option>Billing Operator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="wn-label">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@store.com"
                className="wn-input"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="wn-btn-secondary text-xs flex-1"
              >
                Cancel
              </button>
              <button type="submit" className="wn-btn-primary text-xs flex-1">
                Send Invite
              </button>
            </div>
          </form>
        </BottomSheet>

        {/* Permissions BottomSheet */}
        <BottomSheet
          isOpen={!!selectedStaffForPerms}
          onClose={() => setSelectedStaffForPerms(null)}
          title="Staff Access Permissions"
          subtitle={selectedStaffForPerms ? `Granular permissions for ${selectedStaffForPerms.name} (${selectedStaffForPerms.role})` : undefined}
        >
          {selectedStaffForPerms && (
            <div className="space-y-2.5 py-1">
              {allPermissions.map((perm) => {
                const isChecked = selectedStaffForPerms.permissions.includes(perm.code);
                return (
                  <div
                    key={perm.code}
                    onClick={() => togglePermission(perm.code)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#172B82]/5 border-[#172B82]'
                        : 'bg-white border-[#DDD7CA] hover:bg-[#FFFCF5]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-[#172033]">{perm.label}</p>
                      <p className="text-[11px] text-[#687085]">{perm.desc}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isChecked
                          ? 'bg-[#172B82] border-[#172B82] text-white'
                          : 'border-[#DDD7CA] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <button
                  onClick={() => setSelectedStaffForPerms(null)}
                  className="w-full wn-btn-primary text-xs py-2.5"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </BottomSheet>
      </div>
    </AnimatedPage>
  );
};
