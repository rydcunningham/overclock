import { create } from 'zustand';

interface Zone {
  id: string;
  name: string;
  startX: number;
  startY: number;
  width: number;
  height: number;
}

interface Rack {
  id: string;
  x: number;
  y: number;
  type: 'MDA' | 'EDA' | 'HDA';
  status: 'active' | 'inactive' | 'maintenance';
  zoneId?: string;
  powerDraw?: number;
  temperature?: number;
}

interface Connection {
  from: string;
  to: string;
  type: 'fiber' | 'copper';
}

interface LayoutState {
  racks: Rack[];
  connections: Connection[];
  zones: Zone[];
  selectedRack: string | null;
  selectedZone: string | null;
  addRack: (rack: Rack) => void;
  removeRack: (id: string) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (from: string, to: string) => void;
  selectRack: (id: string | null) => void;
  selectZone: (id: string | null) => void;
  initializeConnections: () => void;
}

export const useLayoutStore = create<LayoutState>((set, get) => {
  // Define our status literals first
  const ACTIVE: Rack['status'] = 'active';
  const INACTIVE: Rack['status'] = 'inactive';

  return {
    racks: [
      // MDA (Main Distribution Area)
      { 
        id: 'mda-1', 
        x: 9, 
        y: 1, 
        type: 'MDA' as const, 
        status: ACTIVE 
      },
      
      // EDA (Equipment Distribution Area) - 3 zones of 6x12 racks
      ...Array(18).fill(0).flatMap((_, col) =>
        Array(12).fill(0).map((_, row) => ({
          id: `eda-${col}-${row}`,
          x: col,
          y: row + 3,
          type: 'EDA' as const,
          status: col === 5 && row === 6 ? INACTIVE : ACTIVE,
          zoneId: `zone-${Math.floor(col / 6) + 1}`,
          powerDraw: col === 5 && row === 6 ? 0 : Math.random() * 5 + 5, // 5-10 kW
          temperature: col === 5 && row === 6 ? 0 : Math.random() * 10 + 65, // 65-75°F
        }))
      )
    ],
    connections: [],
    zones: [
      { id: 'zone-1', name: 'Zone A', startX: 0, startY: 3, width: 6, height: 12 },
      { id: 'zone-2', name: 'Zone B', startX: 6, startY: 3, width: 6, height: 12 },
      { id: 'zone-3', name: 'Zone C', startX: 12, startY: 3, width: 6, height: 12 },
    ],
    selectedRack: null,
    selectedZone: null,
    addRack: (rack) => set((state) => ({ racks: [...state.racks, rack] })),
    removeRack: (id) => set((state) => ({ 
      racks: state.racks.filter(r => r.id !== id) 
    })),
    addConnection: (connection) => set((state) => ({ 
      connections: [...state.connections, connection] 
    })),
    removeConnection: (from, to) => set((state) => ({ 
      connections: state.connections.filter(c => 
        !(c.from === from && c.to === to) && 
        !(c.from === to && c.to === from)
      ) 
    })),
    selectRack: (id) => set({ selectedRack: id }),
    selectZone: (id) => set({ selectedZone: id }),
    initializeConnections: () => {
      const state = get();
      const mda = state.racks.find(r => r.type === 'MDA');
      if (!mda) return;

      // Create fiber connections from MDA to each EDA rack
      const newConnections = state.racks
        .filter(r => r.type === 'EDA')
        .map(rack => ({
          from: mda.id,
          to: rack.id,
          type: 'fiber' as const
        }));

      set({ connections: newConnections });
    },
  };
}); 