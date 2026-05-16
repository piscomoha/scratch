import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ options, value, onChange, placeholder = 'Sélectionner', disabled = false }) => {
  // Ensure we compare values correctly regardless of type (string/number)
  const selectedOption = options.find((opt) => 
    (value !== null && value !== undefined && String(opt.value) === String(value))
  );

  return (
    <div className="relative w-full">
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button 
            className={`
              relative w-full cursor-default rounded-xl border border-border bg-input
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
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl glass py-1.5 shadow-2xl focus:outline-none scrollbar-thin left-0 right-0">
              {options.length === 0 ? (
                <div className="py-4 px-4 text-center text-500 text-sm">Aucune option disponible</div>
              ) : (
                options.map((option, optionIdx) => (
                  <Listbox.Option
                    key={optionIdx}
                    className={({ active, selected }) =>
                      `relative cursor-default select-none py-2 sm:py-2.5 pl-10 pr-4 mx-1.5 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                        active ? 'bg-primary/10 text-100' : selected ? 'bg-primary/5 text-primary' : 'text-400'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-semibold text-primary' : 'font-normal'}`}>
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
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelect;

