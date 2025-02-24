# overclock
A datacenter construction and management simulator that provides detailed technical analysis of infrastructure configurations and their operational implications.

# Overview
Overclock is a simulation tool that enables users to design, build, and manage virtual datacenters while analyzing real-world performance metrics and cost implications. Similar to infrastructure management games, users can experiment with different datacenter configurations in a risk-free environment.

## Key Features
- **Infrastructure Planning**: Design datacenter layouts with customizable rack configurations, cooling systems, and power distribution
- **Cooling System Simulation**: Model multiple cooling methodologies:
	- Air cooling (CRAC/CRAH systems)
	- Direct liquid cooling
	- Immersion cooling
- **Power Analysis**:
	- Real-time power consumption modeling
	- PUE (Power Usage Effectiveness) calculations
	- Power distribution architecture planning
	- Redundancy configuration (N+1, 2N)
- **Financial Modeling**:
	- CapEx calculations for infrastructure components
	- OpEx projections including power, cooling, and maintenance
	- TCO (Total Cost of Ownership) analysis
	- ROI calculations based on various workload scenarios

## Technical Details
- **Simulation Engine**: Physics-based thermal and power modeling
- **Metrics Dashboard**: Real-time monitoring of key performance indicators
- **Component Library**: Extensive database of server, cooling, and power infrastructure specifications
- **Scenario Planning**: Save and compare multiple datacenter configurations
	- Presets include: Air-Cooled, Liquid Cooled, Liquid Immersion, CoLo, Decentralized (Akash Network)

## Project Structure
```
overclock/
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt
├── package.json
│
├── data/
│   ├── hardware/
│   │   ├── gpus/
│   │   │   ├── nvidia/
│   │   │   │   ├── h100.yaml
│   │   │   │   ├── a100.yaml
│   │   │   │   └── l40.yaml
│   │   │   └── amd/
│   │   │       └── mi300x.yaml
│   │   └── asics/
│   │       └── groq/
│   │           └── lpu.yaml
│   ├── models/
│   │   ├── llama/
│   │   │   ├── 3-70b.yaml
│   │   │   └── 3-33b.yaml
│   │   └── gemma/
│   │       ├── 7b.yaml
│   │       └── 2b.yaml
│   └── racks/
│       ├── dell_r760xa.yaml
│       └── supermicro_8049gp.yaml
│
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── component.py
│   │   ├── cooling.py
│   │   ├── power.py
│   │   ├── rack.py
│   │   └── datacenter.py      # Overall datacenter configuration
│   │
│   ├── optimization/
│   │   ├── __init__.py
│   │   ├── optimizer.py       # Portfolio optimization engine
│   │   ├── constraints.py     # Power, space, cooling constraints
│   │   └── objectives.py      # Throughput maximization functions
│   │
│   ├── simulation/
│   │   ├── __init__.py
│   │   ├── thermal.py
│   │   ├── power.py
│   │   └── costs.py
│   │
│   ├── data_management/
│   │   ├── __init__.py
│   │   ├── loader.py          # YAML data loader
│   │   ├── hardware_specs.py  # GPU/ASIC spec interfaces
│   │   ├── model_specs.py     # LLM spec interfaces
│   │   └── rack_specs.py      # Rack configuration interfaces
│   │
│   └── utils/
│       ├── __init__.py
│       ├── constants.py
│       └── metrics.py         # Performance calculation utilities
│
├── frontend/
│   ├── src/
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Simulator.tsx
│   │   │   ├── OptimizationPanel.tsx
│   │   │   ├── HardwareSelector.tsx
│   │   │   └── ResultsView.tsx
│   │   ├── hooks/
│   │   │   ├── useSimulation.ts
│   │   │   └── useOptimization.ts
│   │   ├── types/
│   │   │   ├── hardware.ts
│   │   │   ├── models.ts
│   │   │   └── optimization.ts
│   │   └── utils/
│   │       └── calculations.ts
│   └── public/
│       └── index.html
│
└── tests/
    ├── backend/
    │   ├── test_optimization.py
    │   ├── test_data_loading.py
    │   └── test_simulation.py
    └── frontend/
        └── components.test.tsx
```
