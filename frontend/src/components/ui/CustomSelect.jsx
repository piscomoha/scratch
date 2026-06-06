import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

const OptionsPortal = ({ open, anchorRef, children }) => {
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;

      const gutter = 8;
      const spaceBelow = window.innerHeight - rect.bottom - gutter;
      const spaceAbove = rect.top - gutter;
      const openAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(120, Math.min(240, openAbove ? spaceAbove - gutter : spaceBelow - gutter));

      setPosition({
        left: Math.max(gutter, Math.min(rect.left, window.innerWidth - rect.width - gutter)),
        top: openAbove ? undefined : rect.bottom + gutter,
        bottom: openAbove ? window.innerHeight - rect.top + gutter : undefined,
        width: Math.min(rect.width, window.innerWidth - gutter * 2),
        maxHeight,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, open]);

  if (typeof document === 'undefined' || !open || !position) return null;

  return createPortal(
    <Transition
      as={Fragment}
      show={open}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <Listbox.Options
        static
        className="fixed z-[200] overflow-auto rounded-2xl glass p-1.5 shadow-2xl focus:outline-none scrollbar-thin"
        style={position}
      >
        {children}
      </Listbox.Options>
    </Transition>,
    document.body
  );
};

const CustomSelect = ({ options, value, onChange, placeholder = 'Sélectionner', disabled = false }) => {
  const buttonRef = useRef(null);
  const normalizedValue = value ?? '';
  // Ensure we compare values correctly regardless of type (string/number)
  const selectedOption = options.find((opt) => 
    String(opt.value) === String(normalizedValue)
  );

  return (
    <div className="relative w-full min-w-0">
      <Listbox value={normalizedValue} onChange={(selectedValue) => onChange(selectedValue ?? '')} disabled={disabled}>
        {({ open }) => (
        <div className="relative min-w-0">
          <Listbox.Button 
            ref={buttonRef}
            className={`
              relative w-full min-w-0 cursor-default rounded-xl border border-border bg-input
              py-2 sm:py-2.5 pl-3 sm:pl-4 pr-9 sm:pr-10 text-left text-xs sm:text-sm text-100 transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              ${disabled ? 'opacity-50 cursor-not-allowed bg-zinc-900/50' : 'hover:bg-overlay-hover hover:border-zinc-700/30'}
              ${selectedOption ? 'font-medium' : 'text-500'}
            `}
          >
            <span className="block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${disabled ? 'text-500' : 'text-400 group-hover:text-primary'}`} aria-hidden="true" />
            </span>
          </Listbox.Button>
          
          <OptionsPortal open={open} anchorRef={buttonRef}>
              {options.length === 0 ? (
                <div className="py-4 px-4 text-center text-500 text-sm">Aucune option disponible</div>
              ) : (
                options.map((option, optionIdx) => (
                  <Listbox.Option
                    key={optionIdx}
                    className={({ active, selected }) =>
                      `relative w-full min-w-0 cursor-default select-none py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                        active ? 'bg-primary/10 text-100' : selected ? 'bg-primary/5 text-primary' : 'text-400'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block min-w-0 truncate ${selected ? 'font-semibold text-primary' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                )
              ))}
          </OptionsPortal>
        </div>
        )}
      </Listbox>
    </div>
  );
};

export default CustomSelect;
