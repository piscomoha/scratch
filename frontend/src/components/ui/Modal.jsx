import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

/* ── Small diamond mark ── */
const Diamond = ({ color = '#2660A4', size = 6 }) => (
  <div style={{
    width: size, height: size,
    transform: 'rotate(45deg)',
    background: color,
    borderRadius: 1,
    flexShrink: 0,
  }} />
);

const Modal = ({ isOpen, closeModal, title, children, maxWidth = 'max-w-2xl' }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>

        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" style={{ background: 'rgba(28,63,110,0.5)', backdropFilter: 'blur(6px)' }} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-250"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel
                className={`w-full ${maxWidth} transform rounded-2xl text-left align-middle transition-all overflow-hidden`}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 24px 64px rgba(28,63,110,0.20), 0 8px 24px rgba(0,0,0,0.10)',
                }}
              >
                {/* Modal header stripe */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{
                    background: 'linear-gradient(135deg, rgba(38,96,164,0.06), rgba(46,139,87,0.04))',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Diamond color="#2E8B57" size={7} />
                      <Diamond color="#8C9BA8" size={7} />
                      <Diamond color="#2660A4" size={7} />
                    </div>
                    <Dialog.Title as="h3" className="text-lg font-black text-100 tracking-tight">
                      {title}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-1.5 rounded-xl text-500 hover:text-100 transition-all duration-150"
                    style={{ background: 'var(--overlay)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--overlay-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--overlay)'}
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Modal body */}
                <div className="p-6 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
