import React from 'react';
import { Truck, Status } from '../types.ts';
import { FireTruckIcon } from './icons/FireTruckIcon.tsx';
import { UsersIcon } from './icons/UsersIcon.tsx';
import { EditIcon } from './icons/EditIcon.tsx';
import { PlusIcon } from './icons/PlusIcon.tsx';
import { XCircleIcon } from './icons/XCircleIcon.tsx';
import { MoveIcon } from './icons/MoveIcon.tsx';
import { CogIcon } from './icons/CogIcon.tsx';

interface TruckCardProps {
  truck: Truck;
  onEdit: (truck: Truck) => void;
  onClear: (id: string) => void;
  onMove: (truck: Truck) => void;
  onOpenStatusModal: (truck: Truck) => void;
}

const statusInfo: Record<Status, { color: string; label: string, labelClasses: string }> = {
    'Para Servicio': { color: 'bg-white', label: 'Para Servicio', labelClasses: '' },
    'Reserva': { color: 'bg-green-500', label: 'Reserva', labelClasses: 'bg-green-500/20 text-green-300' },
    'Alternativa': { color: 'bg-yellow-400', label: 'Alternativa', labelClasses: 'bg-yellow-500/20 text-yellow-300' },
    'A Préstamo': { color: 'bg-blue-500', label: 'A Préstamo', labelClasses: 'bg-blue-500/20 text-blue-300' },
    'Fuera de Servicio': { color: 'bg-red-500', label: 'Fuera de Servicio', labelClasses: 'bg-red-500/20 text-red-300' },
};


const TruckCard: React.FC<TruckCardProps> = ({ truck, onEdit, onClear, onMove, onOpenStatusModal }) => {
  const hasAssignment = truck.officer && truck.officer.name.trim() !== '';

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <FireTruckIcon className="h-8 w-8 text-red-500 mr-3 flex-shrink-0" />
            <div className="flex-grow">
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className={`w-3 h-3 rounded-full flex-shrink-0 border border-gray-900/50 ${statusInfo[truck.status].color}`} 
                  title={`Estado: ${truck.status}`}
                ></span>
                <h3 className="text-xl font-bold text-white">{truck.name}</h3>
                {truck.status !== 'Para Servicio' && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusInfo[truck.status].labelClasses}`}>
                    {statusInfo[truck.status].label}
                  </span>
                )}
              </div>
              {truck.type && <p className="text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-900/50 inline-block px-2 py-0.5 rounded mt-1">{truck.type}</p>}
            </div>
          </div>
        </div>
        
        {hasAssignment ? (
          <div className="space-y-3 bg-gray-900/50 p-4 rounded-md mt-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Oficial a Cargo</p>
              <p className="text-lg font-medium text-amber-400">{truck.officer.hierarchy} {truck.officer.name}</p>
              <p className="text-xs text-gray-500">LP: {truck.officer.lp}</p>
            </div>
            {typeof truck.personnel === 'number' && truck.personnel > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Personal</p>
                <div className="flex items-center">
                  <UsersIcon className="h-6 w-6 text-cyan-400 mr-2" />
                  <p className="text-lg font-medium text-cyan-400">{truck.personnel}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[120px] bg-gray-700/30 rounded-md p-4 mt-4">
            <p className="text-gray-500 italic">Sin Asignación</p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-800/50 border-t border-gray-700/50 p-3 flex items-center justify-end space-x-2">
         {hasAssignment && (
            <button
              onClick={() => onClear(truck.id)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
              aria-label="Limpiar asignación"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          )}

        <button
          onClick={() => onOpenStatusModal(truck)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
          aria-label="Cambiar estado"
        >
          <CogIcon className="h-4 w-4" />
        </button>

        <button
          onClick={() => onMove(truck)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
          aria-label="Mover unidad"
        >
          <MoveIcon className="h-4 w-4" />
        </button>

        <button
          onClick={() => onEdit(truck)}
          className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-bold text-white rounded-md transition-colors duration-200 ${
            hasAssignment
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          aria-label={hasAssignment ? 'Editar asignación' : 'Asignar oficial'}
        >
          {hasAssignment ? (
            <>
              <EditIcon className="h-4 w-4 mr-2" />
              Editar
            </>
          ) : (
             <>
              <PlusIcon className="h-4 w-4 mr-2" />
              Asignar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TruckCard;