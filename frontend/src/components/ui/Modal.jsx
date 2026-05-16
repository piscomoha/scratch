import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, closeModal, title, children, maxWidth = 'max-w-2xl' }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
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
              <Dialog.Panel className={`w-full ${maxWidth} transform rounded-2xl sm:rounded-[2rem] glass p-6 sm:p-8 text-left align-middle shadow-2xl transition-all border border-white/10`}>
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-4">
                  <Dialog.Title as="h3" className="text-xl sm:text-2xl font-bold text-white tracking-tight line-clamp-2">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="p-2 sm:p-2.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 flex-shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="relative overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-250px)]">
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

