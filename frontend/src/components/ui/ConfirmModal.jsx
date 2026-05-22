import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmModal = ({
  isOpen, onClose, onConfirm,
  title, message,
  confirmText = 'Confirmer',
  cancelText  = 'Annuler',
  isLoading   = false,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={isLoading ? () => {} : onClose}>

        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in  duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0" style={{ background: 'rgba(28,63,110,0.50)', backdropFilter: 'blur(6px)' }} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95 translate-y-3" enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in  duration-150" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-3"
            >
              <Dialog.Panel
                className="w-full max-w-sm transform rounded-2xl text-left align-middle transition-all overflow-hidden"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 24px 64px rgba(28,63,110,0.18), 0 8px 24px rgba(0,0,0,0.10)',
                }}
              >
                {/* Top danger stripe */}
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #DC2626, #EF4444)' }} />

                <div className="p-6 flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="mb-5 h-16 w-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(220,38,38,0.10)' }}>
                    <AlertTriangle className="h-8 w-8" style={{ color: '#DC2626' }} />
                  </div>

                  <Dialog.Title as="h3" className="text-xl font-black text-100 mb-2">
                    {title}
                  </Dialog.Title>
                  <p className="text-sm text-400 leading-relaxed">
                    {message}
                  </p>

                  {/* Actions */}
                  <div className="mt-7 flex gap-3 w-full">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-400 transition-all duration-200 disabled:opacity-50"
                      style={{ background: 'var(--overlay)', border: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--overlay-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--overlay)'}
                    >
                      {cancelText}
                    </button>
                    <button
                      type="button"
                      onClick={onConfirm}
                      disabled={isLoading}
                      className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-55"
                      style={{ background: '#DC2626', boxShadow: '0 2px 10px rgba(220,38,38,0.3)' }}
                      onMouseEnter={e => !isLoading && (e.currentTarget.style.background = '#B91C1C')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#DC2626')}
                    >
                      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {confirmText}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmModal;
