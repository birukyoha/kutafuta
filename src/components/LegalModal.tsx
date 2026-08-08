import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, initialTab = 'privacy', onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0b0d]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-[#111114] border border-[#f8f7f4]/15 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl text-[#f8f7f4] flex flex-col max-h-[85vh]"
        >
          {/* MODAL HEADER */}
          <div className="p-5 border-b border-[#f8f7f4]/10 flex items-center justify-between bg-[#0b0b0d]">
            <div>
              <span className="font-mono-code text-[0.65rem] text-[#ff3e00] font-bold uppercase tracking-wider block">
                Legal & Governance // Proton Technology Plc
              </span>
              <h2 className="font-syne text-xl font-bold uppercase tracking-tight text-[#f8f7f4] mt-0.5">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#f8f7f4]/60 hover:text-[#f8f7f4] transition-colors rounded-full hover:bg-white/5 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* TAB CONTROLS */}
          <div className="flex border-b border-[#f8f7f4]/10 bg-[#0b0b0d]/50 font-mono-code text-[0.7rem] uppercase font-bold">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-3 px-4 text-center transition-all cursor-pointer border-b-2 ${
                activeTab === 'privacy'
                  ? 'border-[#ff3e00] text-[#f8f7f4] bg-white/[0.03]'
                  : 'border-transparent text-[#f8f7f4]/50 hover:text-[#f8f7f4]'
              }`}
            >
              1. Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 py-3 px-4 text-center transition-all cursor-pointer border-b-2 ${
                activeTab === 'terms'
                  ? 'border-[#ff3e00] text-[#f8f7f4] bg-white/[0.03]'
                  : 'border-transparent text-[#f8f7f4]/50 hover:text-[#f8f7f4]'
              }`}
            >
              2. Terms of Service
            </button>
          </div>

          {/* SCROLLABLE DOCUMENT BODY */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#f8f7f4]/80 leading-relaxed font-sans">
            {activeTab === 'privacy' ? (
              <>
                <section className="space-y-2">
                  <h3 className="font-syne font-bold uppercase text-[#f8f7f4] text-base">
                    1. Information We Collect
                  </h3>
                  <p>
                    KutafutaTalent, operated and developed by Proton Technology Plc, collects personal and professional information necessary for facilitating cinematic talent bookings, project casting, and media production marketplace transactions.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-[#f8f7f4]/70">
                    <li>Account credentials & contact information (Name, Email, Phone, Company)</li>
                    <li>Professional portfolio details, showreels, rate cards, and equipment lists</li>
                    <li>Transaction logs, proposal history, and contract agreements</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="font-syne font-bold uppercase text-[#f8f7f4] text-base">
                    2. Data Usage & Protection
                  </h3>
                  <p>
                    All personal data is encrypted in transit and at rest. Proton Technology Plc does not sell user data to third-party advertisers. Data is exclusively utilized to match creative talent with verified production agencies and producers.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-syne font-bold uppercase text-[#f8f7f4] text-base">
                    3. Your Rights
                  </h3>
                  <p>
                    Users maintain full rights to update, export, or delete their portfolio profiles at any time through their account settings or by submitting a request to legal@protontechnology.plc.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section className="space-y-2">
                  <h3 className="font-syne font-bold uppercase text-[#f8f7f4] text-base">
                    1. Marketplace Platform Agreement
                  </h3>
                  <p>
                    By accessing KutafutaTalent, developed by Proton Technology Plc, users agree to adhere to production standards, transparent booking terms, and fair rate structures for all crew and agency engagements.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-syne font-bold uppercase text-[#f8f7f4] text-base">
                    2. Bookings & Escrow Payments
                  </h3>
                  <p>
                    All project contracts and deposit payments initialized on the platform are safeguarded under Proton Technology Plc's escrow workflow. Funds are released upon verified project completion or agreed milestones.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-syne font-bold uppercase text-[#f8f7f4] text-base">
                    3. Intellectual Property Rights
                  </h3>
                  <p>
                    Talent retains intellectual property rights to submitted showreels and portfolios. Clients receive work-for-hire usage rights upon full payment settlement as specified in individual call sheets and project contracts.
                  </p>
                </section>
              </>
            )}

            <div className="pt-4 border-t border-[#f8f7f4]/10 text-xs font-mono-code text-[#f8f7f4]/50 flex flex-col sm:flex-row justify-between gap-2">
              <span>Effective Date: 2026 Edition</span>
              <span>Developed by Proton Technology Plc</span>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="p-4 bg-[#0b0b0d] border-t border-[#f8f7f4]/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#f8f7f4] text-[#0b0b0d] font-mono-code text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              Close & Accept
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
