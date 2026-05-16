import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', isLoading = false }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={isLoading ? () => {} : onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl sm:rounded-[2rem] glass p-6 sm:p-8 text-center align-middle shadow-2xl transition-all border border-white/10">
                <div className="flex flex-col items-center justify-center">
                  <div className="mx-auto flex h-16 sm:h-20 w-16 sm:w-20 items-center justify-center rounded-2xl bg-red-500/10 mb-4 sm:mb-6">
                    <AlertTriangle className="h-8 sm:h-10 w-8 sm:w-10 text-red-500" aria-hidden="true" />
                  </div>
                  
                  <Dialog.Title as="h3" className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1 sm:mb-2 line-clamp-2">
                    {title}
                  </Dialog.Title>
                  
                  <div className="mt-2 sm:mt-3">
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    className="rounded-xl border border-border bg-white/[0.03] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-all duration-300"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className="rounded-xl bg-red-600 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white"></span>
                    ) : null}
                    {confirmText}
                  </button>
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

