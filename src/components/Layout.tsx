import { useRef, useEffect, useState } from 'react';
import { useLayoutStore } from '../stores/useLayoutStore';

interface SelectionState {
  type: 'zone' | 'column' | 'rack' | null;
  id: string | null;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

export function Layout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    racks, 
    connections, 
    zones,
    initializeConnections 
  } = useLayoutStore();

  // Track selection state
  const [selection, setSelection] = useState<SelectionState>({
    type: null,
    id: null
  });

  const [tooltip, setTooltip] = useState<TooltipState>({ 
    visible: false, 
    x: 0, 
    y: 0, 
    content: '' 
  });

  // Add keyboard navigation state
  const [navigationMode, setNavigationMode] = useState<'zone' | 'column' | 'rack'>('zone');
  const [navigationPos, setNavigationPos] = useState({ x: 0, y: 0 });

  // Adjust grid and positioning constants
  const CANVAS_WIDTH = 720;
  const CANVAS_HEIGHT = 540;
  const GRID_SIZE = 32;
  const RACK_RADIUS = 3;
  const ZONE_GAP = 16; // Gap between zones
  
  // Helper to convert grid position to canvas coordinates (centers within grid cell)
  const gridToCanvas = (gridX: number, gridY: number) => ({
    x: gridX * GRID_SIZE + GRID_SIZE / 2,
    y: gridY * GRID_SIZE + GRID_SIZE / 2
  });

  // Initialize MDA connections
  useEffect(() => {
    initializeConnections();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          // Only cycle through navigation modes, don't update selection
          setNavigationMode(prev => {
            switch (prev) {
              case 'zone': return 'column';
              case 'column': return 'rack';
              case 'rack': return 'zone';
            }
          });
          return; // Exit early, don't update selection

        case 'ArrowLeft':
          setNavigationPos(prev => {
            switch (navigationMode) {
              case 'zone':
                return {
                  ...prev,
                  x: prev.x <= 0 ? 12 : Math.max(0, prev.x - 6)
                };
              case 'column':
                return {
                  ...prev,
                  x: prev.x <= 0 ? 17 : prev.x - 1
                };
              case 'rack':
                return {
                  ...prev,
                  x: prev.x <= 0 ? 17 : prev.x - 1
                };
              default:
                return prev;
            }
          });
          break;

        case 'ArrowRight':
          setNavigationPos(prev => {
            switch (navigationMode) {
              case 'zone':
                return {
                  ...prev,
                  x: prev.x >= 12 ? 0 : prev.x + 6
                };
              case 'column':
                return {
                  ...prev,
                  x: prev.x >= 17 ? 0 : prev.x + 1
                };
              case 'rack':
                return {
                  ...prev,
                  x: prev.x >= 17 ? 0 : prev.x + 1
                };
              default:
                return prev;
            }
          });
          break;

        case 'ArrowUp':
          setNavigationPos(prev => {
            if (navigationMode === 'rack') {
              return {
                ...prev,
                y: prev.y <= 3 ? 14 : prev.y - 1
              };
            }
            return prev; // No vertical movement for zone/column modes
          });
          break;

        case 'ArrowDown':
          setNavigationPos(prev => {
            if (navigationMode === 'rack') {
              return {
                ...prev,
                y: prev.y >= 14 ? 3 : prev.y + 1
              };
            }
            return prev; // No vertical movement for zone/column modes
          });
          break;
      }

      // Update selection after position change (only for arrow keys)
      updateSelectionFromNavigation();
    };

    const updateSelectionFromNavigation = () => {
      switch (navigationMode) {
        case 'zone':
          const zoneIndex = Math.floor(navigationPos.x / 6);
          setSelection({ 
            type: 'zone', 
            id: `zone-${zoneIndex + 1}` 
          });
          break;

        case 'column':
          setSelection({ 
            type: 'column', 
            id: navigationPos.x.toString() 
          });
          break;

        case 'rack':
          const rackId = `eda-${navigationPos.x}-${navigationPos.y}`;
          if (racks.find(r => r.id === rackId)) {
            setSelection({ type: 'rack', id: rackId });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigationMode, navigationPos, racks]);

  // Draw the layout
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw zones with gaps and dashed borders
    zones.forEach((zone) => {
      const isSelected = selection.type === 'zone' && selection.id === zone.id;
      
      // Calculate zone boundaries with gaps
      const x = zone.startX * GRID_SIZE + (zone.id !== 'zone-1' ? ZONE_GAP/2 : 0);
      const y = zone.startY * GRID_SIZE;
      const width = zone.width * GRID_SIZE - (zone.id !== 'zone-3' ? ZONE_GAP : 0);
      const height = zone.height * GRID_SIZE;

      // Zone background
      ctx.fillStyle = isSelected
        ? 'rgba(0, 240, 255, 0.15)'
        : 'rgba(0, 240, 255, 0.05)';
      ctx.fillRect(x, y, width, height);

      // Dashed zone borders
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = isSelected ? '#00f0ff' : 'rgba(0, 240, 255, 0.3)';
      ctx.strokeRect(x, y, width, height);
      ctx.setLineDash([]); // Reset line style

      // Zone label
      ctx.fillStyle = '#00f0ff';
      ctx.font = '11px "JetBrains Mono"';
      ctx.fillText(zone.name, x + 8, y - 4);
    });

    // Draw column highlights (centered on grid)
    if (selection.type === 'column') {
      const col = parseInt(selection.id!);
      const x = col * GRID_SIZE;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.fillRect(x, 3 * GRID_SIZE, GRID_SIZE, 12 * GRID_SIZE);
    }

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw connections
    connections.forEach(({ from, to, type }) => {
      const fromRack = racks.find(r => r.id === from);
      const toRack = racks.find(r => r.id === to);
      if (!fromRack || !toRack) return;

      const fromPos = gridToCanvas(fromRack.x, fromRack.y);
      const toPos = gridToCanvas(toRack.x, toRack.y);

      ctx.beginPath();
      ctx.strokeStyle = type === 'fiber' ? '#00f0ff' : '#ff9f00';
      ctx.lineWidth = 1;
      
      if (fromRack.type === 'MDA') {
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(fromPos.x, fromPos.y + GRID_SIZE);
        ctx.lineTo(toPos.x, fromPos.y + GRID_SIZE);
        ctx.lineTo(toPos.x, toPos.y);
      } else {
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
      }
      
      ctx.stroke();
    });

    // Draw racks (centered in grid cells)
    racks.forEach((rack) => {
      const pos = gridToCanvas(rack.x, rack.y);
      const isSelected = selection.type === 'rack' && selection.id === rack.id;
      const isOffline = rack.status === 'inactive';

      // Status indicator ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, RACK_RADIUS + 2, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected
        ? '#00ff9f'
        : isOffline
          ? '#ff0000'
          : rack.status === 'active'
            ? '#00f0ff'
            : '#ff9f00';
      ctx.stroke();

      // Rack point
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, RACK_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = rack.type === 'MDA'
        ? '#00ff9f'
        : isSelected
          ? '#00ff9f'
          : isOffline
            ? '#ff0000'
            : '#ffffff';
      ctx.fill();

      // MDA label
      if (rack.type === 'MDA') {
        ctx.fillStyle = '#00ff9f';
        ctx.font = '11px "JetBrains Mono"';
        ctx.fillText('MDA', pos.x - 15, pos.y - 8);
      }
    });
  }, [racks, connections, zones, selection]);

  // Update click handling to use centered grid coordinates
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.floor(x / GRID_SIZE);
    const gridY = Math.floor(y / GRID_SIZE);

    // Check for rack clicks
    const clickedRack = racks.find(rack => {
      const pos = gridToCanvas(rack.x, rack.y);
      const distance = Math.sqrt(
        Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
      );
      return distance <= RACK_RADIUS + 2;
    });

    if (clickedRack) {
      setSelection({ type: 'rack', id: clickedRack.id });
      return;
    }

    // Check for column selection (using grid cells)
    if (gridY >= 3 && gridY <= 14) {
      setSelection({ type: 'column', id: gridX.toString() });
      return;
    }

    // Check for zone selection (accounting for gaps)
    const clickedZone = zones.find(zone => {
      const zoneX = x / GRID_SIZE;
      const zoneY = y / GRID_SIZE;
      const zoneStartX = zone.startX + (zone.id !== 'zone-1' ? ZONE_GAP/(2*GRID_SIZE) : 0);
      const zoneWidth = zone.width - (zone.id !== 'zone-3' ? ZONE_GAP/GRID_SIZE : 0);
      
      return (
        zoneX >= zoneStartX && 
        zoneX < zoneStartX + zoneWidth &&
        zoneY >= zone.startY && 
        zoneY < zone.startY + zone.height
      );
    });

    if (clickedZone) {
      setSelection({ type: 'zone', id: clickedZone.id });
      return;
    }

    setSelection({ type: null, id: null });
  };

  // Handle mouse move for tooltips
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check for rack hover
    const hoveredRack = racks.find(rack => {
      const pos = gridToCanvas(rack.x, rack.y);
      const distance = Math.sqrt(
        Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2)
      );
      return distance <= RACK_RADIUS + 2;
    });

    if (hoveredRack) {
      let content = `Rack ${hoveredRack.id}`;
      if (hoveredRack.type === 'EDA') {
        content += `\nPower: ${hoveredRack.powerDraw?.toFixed(1)} kW`;
        content += `\nTemp: ${hoveredRack.temperature?.toFixed(1)}°F`;
      }
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        content
      });
      return;
    }

    // Check for column hover
    const gridX = Math.floor(x / GRID_SIZE);
    const gridY = Math.floor(y / GRID_SIZE);
    if (gridY >= 3 && gridY <= 14) {
      setTooltip({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        content: `Column ${gridX + 1}`
      });
      return;
    }

    setTooltip({ ...tooltip, visible: false });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  // Update the stats calculation helpers
  const GPUS_PER_RACK = 32;

  const getZoneStats = (zoneId: string) => {
    const zoneRacks = racks.filter(r => r.zoneId === zoneId);
    return {
      totalRacks: zoneRacks.length,
      activeRacks: zoneRacks.filter(r => r.status === 'active').length,
      totalPower: zoneRacks.reduce((sum, r) => sum + (r.powerDraw || 0), 0),
      avgTemp: zoneRacks.reduce((sum, r) => sum + (r.temperature || 0), 0) / zoneRacks.length,
      totalGPUs: zoneRacks.length * GPUS_PER_RACK,
      activeGPUs: zoneRacks.filter(r => r.status === 'active').length * GPUS_PER_RACK
    };
  };

  const getColumnStats = (columnId: string) => {
    const colRacks = racks.filter(r => r.x === parseInt(columnId));
    return {
      totalRacks: colRacks.length,
      activeRacks: colRacks.filter(r => r.status === 'active').length,
      totalPower: colRacks.reduce((sum, r) => sum + (r.powerDraw || 0), 0),
      avgTemp: colRacks.reduce((sum, r) => sum + (r.temperature || 0), 0) / colRacks.length,
      totalGPUs: colRacks.length * GPUS_PER_RACK,
      activeGPUs: colRacks.filter(r => r.status === 'active').length * GPUS_PER_RACK
    };
  };

  return (
    <div className="p-6 bg-cyber-black min-h-screen">
      <div className="mb-6">
        <h2 className="text-cyber-blue font-mono font-semibold text-xl">
          Datacenter Layout
        </h2>
        <div className="text-cyber-text/60 text-sm">
          MDA (Main Distribution Area) and EDA (Equipment Distribution Area) Configuration
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Layout View */}
        <div className="flex-1 flex justify-center">
          <div className="border border-cyber-blue/20 rounded-lg p-8 bg-cyber-dark/50 relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onClick={handleClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full"
            />
            
            {/* Tooltip */}
            {tooltip.visible && (
              <div 
                className="absolute pointer-events-none bg-cyber-dark/90 border border-cyber-blue/20 rounded px-3 py-2 text-cyber-text font-mono text-xs whitespace-pre"
                style={{ 
                  left: tooltip.x - 100,
                  top: tooltip.y - 80,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                {tooltip.content}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Panels */}
        <div className="w-72 space-y-4">
          {/* Navigation Panel - Always visible */}
          <div className="border border-cyber-blue/20 rounded-lg p-3 bg-cyber-dark/50">
            <h3 className="text-cyber-blue font-rajdhani font-medium mb-2 text-sm">Navigation</h3>
            <div className="text-cyber-text space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span>Mode:</span>
                <span className="text-cyber-blue capitalize">{navigationMode}</span>
              </div>
              <div className="space-y-1 text-cyber-text/60 mt-2">
                <div>⌨️ Controls:</div>
                <div className="grid grid-cols-2 gap-x-4">
                  <span>↑↓←→</span>
                  <span>Navigate</span>
                  <span>Enter</span>
                  <span>Toggle Mode</span>
                </div>
              </div>
              <div className="border-t border-cyber-blue/20 my-2"></div>
              <div className="space-y-1">
                <div className="text-cyber-text/60">Stats:</div>
                <div className="grid grid-cols-2 gap-1">
                  <span>Total Racks:</span>
                  <span className="text-cyber-blue text-right">{racks.length}</span>
                  <span>Active:</span>
                  <span className="text-cyber-green text-right">
                    {racks.filter(r => r.status === 'active').length}
                  </span>
                  <span>Zones:</span>
                  <span className="text-cyber-blue text-right">{zones.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Details Panel - Shows when something is selected */}
          {selection.type && (
            <div className="border border-cyber-blue/20 rounded-lg p-3 bg-cyber-dark/50">
              <h3 className="text-cyber-blue font-rajdhani font-medium mb-2 text-sm">
                {selection.type === 'zone' && 'Zone Details'}
                {selection.type === 'column' && 'Column Details'}
                {selection.type === 'rack' && 'Rack Details'}
              </h3>
              <div className="text-cyber-text space-y-2 font-mono text-xs">
                {selection.type === 'zone' && (
                  <>
                    <div className="flex justify-between">
                      <span>Zone:</span>
                      <span className="text-cyber-blue">
                        {zones.find(z => z.id === selection.id)?.name}
                      </span>
                    </div>
                    {(() => {
                      const stats = getZoneStats(selection.id!);
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>Racks Online:</span>
                            <span className="text-cyber-green">
                              {stats.activeRacks}/{stats.totalRacks}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Power:</span>
                            <span className="text-cyber-blue">
                              {stats.totalPower.toFixed(1)} kW
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Temp:</span>
                            <span className="text-cyber-blue">
                              {stats.avgTemp.toFixed(1)}°F
                            </span>
                          </div>
                          <div className="border-t border-cyber-blue/20 my-2"></div>
                          <div className="text-cyber-text/60">Systems:</div>
                          <div className="flex justify-between">
                            <span>GPUs:</span>
                            <span className="text-cyber-green">
                              {stats.activeGPUs}/{stats.totalGPUs}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Network:</span>
                            <span className="text-cyber-green">Online</span>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}

                {selection.type === 'column' && (
                  <>
                    <div className="flex justify-between">
                      <span>Column:</span>
                      <span className="text-cyber-blue">
                        {parseInt(selection.id!) + 1}
                      </span>
                    </div>
                    {(() => {
                      const stats = getColumnStats(selection.id!);
                      return (
                        <>
                          <div className="flex justify-between">
                            <span>Racks Online:</span>
                            <span className="text-cyber-green">
                              {stats.activeRacks}/{stats.totalRacks}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Power:</span>
                            <span className="text-cyber-blue">
                              {stats.totalPower.toFixed(1)} kW
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Temp:</span>
                            <span className="text-cyber-blue">
                              {stats.avgTemp.toFixed(1)}°F
                            </span>
                          </div>
                          <div className="border-t border-cyber-blue/20 my-2"></div>
                          <div className="text-cyber-text/60">Systems:</div>
                          <div className="flex justify-between">
                            <span>GPUs:</span>
                            <span className="text-cyber-green">
                              {stats.activeGPUs}/{stats.totalGPUs}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Network:</span>
                            <span className="text-cyber-green">Online</span>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}

                {selection.type === 'rack' && selection.id?.startsWith('eda') && (
                  <>
                    <div className="flex justify-between">
                      <span>Rack ID:</span>
                      <span className="text-cyber-blue">{selection.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Power Draw:</span>
                      <span className="text-cyber-blue">
                        {racks.find(r => r.id === selection.id)?.powerDraw?.toFixed(1)} kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="text-cyber-blue">
                        {racks.find(r => r.id === selection.id)?.temperature?.toFixed(1)}°F
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={
                        racks.find(r => r.id === selection.id)?.status === 'active' 
                          ? "text-cyber-green" 
                          : "text-red-500"
                      }>
                        {racks.find(r => r.id === selection.id)?.status === 'active' 
                          ? 'Online' 
                          : 'Offline'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>GPUs:</span>
                      <span className={
                        racks.find(r => r.id === selection.id)?.status === 'active' 
                          ? "text-cyber-green" 
                          : "text-red-500"
                      }>
                        {racks.find(r => r.id === selection.id)?.status === 'active' 
                          ? `${GPUS_PER_RACK}/${GPUS_PER_RACK}` 
                          : '0/32'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 