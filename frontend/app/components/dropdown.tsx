import { useState } from 'react';

interface DrowpdownProps {
    values: string[],
    selected: number,
    onChange(selected: number): void
}

export default function Dropdown({ values, selected, onChange }: DrowpdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // 'relative' keeps the absolute menu positioned directly below this div
    <div className="relative inline-block text-left">
      
      {/* The Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-black border-black border-2 px-4 py-1 rounded-md hover:bg-gray-800 transition-all"
      >
        {values[selected]} ▼
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border-2 border-black rounded-md shadow-lg overflow-hidden z-50">
          {values.map((val, idx) => (
            <button 
                onClick={() => {
                    setIsOpen(false);
                    onChange(idx);
                }}
                className="w-full text-left px-4 py-2 text-black hover:bg-gray-200">
                {val}
            </button>
          ))

          }
        </div>
      )}
    </div>
  );
}