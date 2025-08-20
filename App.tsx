
import React, { useState, useMemo, useCallback } from 'react';
import { Truck, Status } from './types.ts';
import AssignmentModal from './components/AssignmentModal.tsx';
import MoveTruckModal from './components/MoveTruckModal.tsx';
import StatusUpdateModal from './components/StatusUpdateModal.tsx';
import { FireTruckIcon } from './components/icons/FireTruckIcon.tsx';
import StationSection from './components/StationSection.tsx';
import { initialTrucks, initialCrews } from './data.ts';

function App() {
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [movingTruck, setMovingTruck] = useState<Truck | null>(null);
  const [statusUpdatingTruck, setStatusUpdatingTruck] = useState<Truck | null>(null);
  const [stationCrews, setStationCrews] = useState<Record<string, string[]>>(initialCrews);

  const handleSave = useCallback((id: string, officer: Truck['officer'], personnel: number, personnelList: string[]) => {
    setTrucks(currentTrucks =>
      currentTrucks.map(t => (t.id === id ? { ...t, officer, personnel, personnelList } : t))
    );
    setEditingTruck(null);
  }, []);

  const handleClear = useCallback((id: string) => {
    setTrucks(currentTrucks =>
      currentTrucks.map(t => (t.id === id ? { ...t, officer: undefined, personnel: undefined, personnelList: [] } : t))
    );
  }, []);

  const handleOpenModal = useCallback((truck: Truck) => {
    setEditingTruck(truck);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingTruck(null);
  }, []);

  const handleOpenMoveModal = useCallback((truck: Truck) => {
    setMovingTruck(truck);
  }, []);

  const handleCloseMoveModal = useCallback(() => {
    setMovingTruck(null);
  }, []);

  const handleConfirmMove = useCallback((truckId: string, newStation: string) => {
    const destinationTruck = initialTrucks.find(t => t.station === newStation);
    if (!destinationTruck) return;
    const newZone = destinationTruck.zone;

    setTrucks(currentTrucks =>
      currentTrucks.map(t =>
        t.id === truckId ? { ...t, station: newStation, zone: newZone } : t
      )
    );
    handleCloseMoveModal();
  }, [handleCloseMoveModal]);

  const handleOpenStatusModal = useCallback((truck: Truck) => {
    setStatusUpdatingTruck(truck);
  }, []);

  const handleCloseStatusModal = useCallback(() => {
    setStatusUpdatingTruck(null);
  }, []);
  
  const handleConfirmStatusUpdate = useCallback((truckId: string, status: Status) => {
    setTrucks(currentTrucks =>
      currentTrucks.map(t => (t.id === truckId ? { ...t, status } : t))
    );
    handleCloseStatusModal();
  }, [handleCloseStatusModal]);


  const handleAddFirefighter = useCallback((stationName: string, firefighterName: string) => {
    setStationCrews(prevCrews => {
      const currentCrew = prevCrews[stationName] || [];
      if (currentCrew.includes(firefighterName)) {
        return prevCrews; // Avoid duplicates
      }
      return {
        ...prevCrews,
        [stationName]: [...currentCrew, firefighterName],
      };
    });
  }, []);

  const handleRemoveFirefighter = useCallback((stationName: string, firefighterName: string) => {
    setStationCrews(prevCrews => {
      const currentCrew = prevCrews[stationName] || [];
      return {
        ...prevCrews,
        [stationName]: currentCrew.filter(name => name !== firefighterName),
      };
    });
  }, []);

  const groupedData = useMemo(() => {
    const groups: Record<string, Record<string, Truck[]>> = {};
    const stationOrder: Record<string, string[]> = {};

    trucks.forEach(truck => {
      const zone = truck.zone || 'Sin Zona';
      const station = truck.station || 'Sin Estación';

      if (!groups[zone]) {
        groups[zone] = {};
        stationOrder[zone] = [];
      }
      if (!groups[zone][station]) {
        groups[zone][station] = [];
        stationOrder[zone].push(station);
      }
      groups[zone][station].push(truck);
    });
    
    const zoneOrder = ['ZONA I', 'ZONA II', 'ZONA III', 'Unidades Especiales', 'Jefatura'];
    const sortedZoneKeys = Object.keys(groups).sort((a, b) => {
      const indexA = zoneOrder.indexOf(a);
      const indexB = zoneOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    const sortedGroups: Record<string, Record<string, Truck[]>> = {};
    for (const key of sortedZoneKeys) {
        const stationsInZone = groups[key];
        const orderedStationKeys = stationOrder[key];
        
        const sortedStations: Record<string, Truck[]> = {};
        for (const stationKey of orderedStationKeys) {
            sortedStations[stationKey] = stationsInZone[stationKey];
        }
        sortedGroups[key] = sortedStations;
    }
    return sortedGroups;
  }, [trucks]);

  const allDestinations = useMemo(() => {
    const destinations: Record<string, Set<string>> = {};
    
    initialTrucks.forEach(truck => {
      if (!destinations[truck.zone]) {
        destinations[truck.zone] = new Set();
      }
      destinations[truck.zone].add(truck.station);
    });

    const zoneOrder = ['ZONA I', 'ZONA II', 'ZONA III', 'Unidades Especiales', 'Jefatura'];
    return zoneOrder
      .filter(zone => destinations[zone])
      .map(zone => ({
        zone,
        stations: Array.from(destinations[zone])
      }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-900/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
               <FireTruckIcon className="h-8 w-8 text-red-500 mr-3" />
               <h1 className="text-2xl font-bold tracking-tight">
                Estado de Unidades y Dotaciones
               </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-12">
          {Object.entries(groupedData).map(([zone, stations]) => (
            <section key={zone} aria-labelledby={`zone-title-${zone}`}>
              <div className="mb-4">
                <h2 id={`zone-title-${zone}`} className="text-2xl font-bold text-red-500 border-b-2 border-red-500/30 pb-2 inline-block">
                  {zone}
                </h2>
              </div>
              <div className="space-y-8">
                {Object.entries(stations).map(([stationName, stationTrucks]) => (
                   <StationSection
                    key={stationName}
                    stationName={stationName}
                    trucks={stationTrucks}
                    firefighters={stationCrews[stationName] || []}
                    onEditTruck={handleOpenModal}
                    onClearTruck={handleClear}
                    onMoveTruck={handleOpenMoveModal}
                    onOpenStatusModal={handleOpenStatusModal}
                    onAddFirefighter={handleAddFirefighter}
                    onRemoveFirefighter={handleRemoveFirefighter}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <AssignmentModal
        isOpen={!!editingTruck}
        onClose={handleCloseModal}
        onSave={handleSave}
        truck={editingTruck}
      />

      <MoveTruckModal
        isOpen={!!movingTruck}
        onClose={handleCloseMoveModal}
        onSave={handleConfirmMove}
        truck={movingTruck}
        destinations={allDestinations}
      />

      <StatusUpdateModal
        isOpen={!!statusUpdatingTruck}
        onClose={handleCloseStatusModal}
        onSave={handleConfirmStatusUpdate}
        truck={statusUpdatingTruck}
      />
    </div>
  );
}

export default App;