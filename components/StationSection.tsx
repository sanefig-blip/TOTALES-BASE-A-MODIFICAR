import React, { useState } from 'react';
import { Truck, Status } from '../types.js';
import TruckList from './TruckList.js';
import { UsersIcon } from './icons/UsersIcon.js';
import { ChevronDownIcon } from './icons/ChevronDownIcon.js';
import { PlusIcon } from './icons/PlusIcon.js';
import { XCircleIcon } from './icons/XCircleIcon.js';

interface StationSectionProps {
  stationName: string;
  trucks: Truck[];
  firefighters: string[];
  onEditTruck: (truck: Truck) => void;
  onClearTruck: (id: string) => void;
  onMoveTruck: (truck: Truck) => void;
  onOpenStatusModal: (truck: Truck) => void;
  onAddFirefighter: (stationName: string, firefighterName: string) => void;
  onRemoveFirefighter: (stationName: string, firefighterName: string) => void;
}

const StationSection: React.FC<StationSectionProps> = ({ 
  stationName, 
  trucks, 
  firefighters, 
  onEditTruck, 
  onClearTruck, 
  onMoveTruck,
  onOpenStatusModal,
  onAddFirefighter, 
  onRemoveFirefighter 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newFirefighterFirstName, setNewFirefighterFirstName] = useState('');
  const [newFirefighterLastName, setNewFirefighterLastName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${newFirefighterFirstName.trim()} ${newFirefighterLastName.trim()}`.trim();
    if (fullName) {
      onAddFirefighter(stationName, fullName);
      setNewFirefighterFirstName('');
      setNewFirefighterLastName('');
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 md:p-6">
      <h3 className="text-xl font-semibold text-white mb-4">{stationName}</h3>
      <TruckList 
        trucks={trucks} 
        onEdit={onEditTruck} 
        onClear={onClearTruck} 
        onMove={onMoveTruck} 
        onOpenStatusModal={onOpenStatusModal} 
      />

      <div className="mt-4 border-t border-gray-700 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left text-lg font-medium text-cyan-400 hover:text-cyan-300 p-2 rounded-md transition-colors"
          aria-expanded={isExpanded}
        >
          <span className="flex items-center">
            <UsersIcon className="h-6 w-6 mr-2" />
            Dotación de la Estación ({firefighters.length})
          </span>
          <ChevronDownIcon className={`h-6 w-6 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="mt-4 pl-4 md:pl-8">
            {firefighters.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {firefighters.map((name, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md animate-fade-in-sm">
                    <span className="text-gray-200">{name}</span>
                    <button 
                      onClick={() => onRemoveFirefighter(stationName, name)} 
                      aria-label={`Quitar a ${name}`}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic my-4">No hay personal asignado a esta dotación.</p>
            )}

            <form onSubmit={handleAdd} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:items-end">
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                        <label htmlFor={`ff-first-name-${stationName}`} className="sr-only">Nombre</label>
                        <input
                            id={`ff-first-name-${stationName}`}
                            type="text"
                            value={newFirefighterFirstName}
                            onChange={(e) => setNewFirefighterFirstName(e.target.value)}
                            placeholder="Nombre"
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                            aria-label="Nombre del nuevo bombero"
                        />
                    </div>
                    <div>
                        <label htmlFor={`ff-last-name-${stationName}`} className="sr-only">Apellido</label>
                        <input
                            id={`ff-last-name-${stationName}`}
                            type="text"
                            value={newFirefighterLastName}
                            onChange={(e) => setNewFirefighterLastName(e.target.value)}
                            placeholder="Apellido"
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                            aria-label="Apellido del nuevo bombero"
                        />
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="sm:col-span-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors disabled:bg-red-800 disabled:cursor-not-allowed"
                    disabled={!newFirefighterFirstName.trim() || !newFirefighterLastName.trim()}
                >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    <span>Agregar</span>
                </button>
            </form>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in-sm {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-sm {
          animation: fade-in-sm 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StationSection;