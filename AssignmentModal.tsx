import React, { useState, useEffect } from 'react';
import { Truck } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { XCircleIcon } from './icons/XCircleIcon';


interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, officer: Truck['officer'], personnel: number, personnelList: string[]) => void;
  truck: Truck | null;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSave, truck }) => {
  const [hierarchy, setHierarchy] = useState('');
  const [officerFirstName, setOfficerFirstName] = useState('');
  const [officerLastName, setOfficerLastName] = useState('');
  const [lp, setLp] = useState('');
  const [personnel, setPersonnel] = useState('');
  const [personnelList, setPersonnelList] = useState<string[]>([]);
  const [newPersonnelName, setNewPersonnelName] = useState('');

  useEffect(() => {
    if (truck) {
      const nameParts = truck.officer?.name.split(' ') || [];
      const firstName = nameParts.shift() || '';
      const lastName = nameParts.join(' ');
      
      setHierarchy(truck.officer?.hierarchy || '');
      setOfficerFirstName(firstName);
      setOfficerLastName(lastName);
      setLp(truck.officer?.lp || '');
      setPersonnel(truck.personnel?.toString() || '');
      setPersonnelList(truck.personnelList || []);

    } else {
      // Reset fields when modal is closed or truck is null
      setHierarchy('');
      setOfficerFirstName('');
      setOfficerLastName('');
      setLp('');
      setPersonnel('');
      setPersonnelList([]);
      setNewPersonnelName('');
    }
  }, [truck, isOpen]);

  if (!isOpen || !truck) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const personnelNumber = parseInt(personnel, 10);
    const fullName = `${officerFirstName.trim()} ${officerLastName.trim()}`.trim();
    
    if (hierarchy && fullName && lp && !isNaN(personnelNumber) && personnelNumber > 0) {
      const officerData = {
        hierarchy: hierarchy.trim(),
        name: fullName,
        lp: lp.trim()
      };
      onSave(truck.id, officerData, personnelNumber, personnelList);
    }
  };

  const handleAddPersonnel = () => {
    const trimmedName = newPersonnelName.trim();
    if(trimmedName && !personnelList.includes(trimmedName)) {
      setPersonnelList([...personnelList, trimmedName]);
      setNewPersonnelName('');
    }
  };

  const handleRemovePersonnel = (nameToRemove: string) => {
    setPersonnelList(personnelList.filter(name => name !== nameToRemove));
  };


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'fade-in-scale 0.3s forwards' }}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Asignar Oficial</h2>
          <p className="text-gray-400">Unidad: <span className="font-semibold text-red-400">{truck.name}</span></p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            <div className="space-y-3 p-4 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-amber-400">Oficial a Cargo</h3>
                <div>
                    <label htmlFor="officer-hierarchy" className="block text-sm font-medium text-gray-300 mb-1">Jerarquía</label>
                    <input id="officer-hierarchy" type="text" value={hierarchy} onChange={e => setHierarchy(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="Ej: Capitán" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nombre y Apellido</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input id="officer-first-name" type="text" value={officerFirstName} onChange={e => setOfficerFirstName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="Nombre" required />
                        <input id="officer-last-name" type="text" value={officerLastName} onChange={e => setOfficerLastName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="Apellido" required />
                    </div>
                </div>
                 <div>
                    <label htmlFor="officer-lp" className="block text-sm font-medium text-gray-300 mb-1">Legajo Personal (LP)</label>
                    <input id="officer-lp" type="text" value={lp} onChange={e => setLp(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="Ej: 12345678" required />
                </div>
            </div>

            <div className="space-y-3 p-4 border border-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-cyan-400">Dotación de la Unidad</h3>
                <div>
                    <label htmlFor="personnel-count" className="block text-sm font-medium text-gray-300 mb-1">Cantidad Total de Personal</label>
                    <input id="personnel-count" type="number" value={personnel} onChange={e => setPersonnel(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="Ej: 8" min="1" required />
                </div>
                
                <div className="border-t border-gray-600 pt-3">
                     <label htmlFor="add-personnel-name" className="block text-sm font-medium text-gray-300 mb-1">Agregar Personal a la Lista</label>
                    <div className="flex gap-2">
                        <input id="add-personnel-name" type="text" value={newPersonnelName} onChange={e => setNewPersonnelName(e.target.value)} className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" placeholder="Nombre y Apellido"/>
                        <button type="button" onClick={handleAddPersonnel} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold p-2 rounded-md flex items-center justify-center transition-colors disabled:bg-cyan-800 disabled:cursor-not-allowed" disabled={!newPersonnelName.trim()}>
                           <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {personnelList.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {personnelList.map((name, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md text-sm">
                        <span className="text-gray-200">{name}</span>
                        <button type="button" onClick={() => handleRemovePersonnel(name)} aria-label={`Quitar a ${name}`} className="text-gray-500 hover:text-red-400 transition-colors">
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
          <div className="bg-gray-800/50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition disabled:bg-red-800 disabled:cursor-not-allowed" disabled={!hierarchy || !officerFirstName || !officerLastName || !lp || !personnel || parseInt(personnel, 10) <= 0}>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AssignmentModal;