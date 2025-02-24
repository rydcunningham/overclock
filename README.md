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

## Sample Project Structure
```
overclock/
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt         # Dependencies (SimPy, SciPy, NumPy, etc.)
├── package.json             # Frontend dependencies (React, TypeScript)
│
├── data/                    # Static data (YAML configurations)
│   ├── hardware/
│   │   ├── components/
│   │   │   ├── gpus/
│   │   │   │   ├── nvidia/
│   │   │   │   │   ├── h100.yaml
│   │   │   │   │   ├── b100.yaml
│   │   │   │   │   ├── b200.yaml
│   │   │   │   ├── amd/
│   │   │   │   │   └── mi300x.yaml
│   │   │   ├── cpus/
│   │   │   │   ├── grace_cpu.yaml
│   │   │   │   └── xeon_8480c.yaml
│   │   │   ├── memory/
│   │   │   │   ├── hbm3e.yaml
│   │   │   │   ├── ddr5.yaml
│   │   │   │   └── lpddr5x.yaml
│   │   │   ├── networking/
│   │   │   │   ├── nvlink_switch.yaml
│   │   │   │   ├── infiniband_400g.yaml
│   │   │   │   └── ethernet_100g.yaml
│   │   │   ├── cooling/
│   │   │   │   ├── liquid_cooling.yaml
│   │   │   │   └── air_cooling.yaml
│   │   ├── systems/
│   │   │   ├── dgx_h100.yaml
│   │   │   ├── dgx_b200.yaml
│   │   │   ├── gb200_nvl72.yaml
│   │   ├── racks/
│   │   │   ├── gb200_nvl72_rack.yaml
│   │   │   ├── dell_r760xa.yaml
│   │   │   └── supermicro_8049gp.yaml
│   │
│   ├── llms/                # Stores metadata on LLM models (tokenomics calculations)
│   │   ├── meta/
│   │   │   ├── llama3-70b.yaml
│   │   │   ├── gemma-7b.yaml
│   │   │   └── custom_model.yaml
│   │   ├── performance/
│   │   │   ├── throughput_estimates.yaml
│   │   │   └── cost_per_token.yaml
│   │   ├── datasets/
│   │   │   ├── openai_dataset.yaml
│   │   │   ├── huggingface_common.yaml
│   │   │   └── synthetic_data.yaml
│
├── backend/                 # Backend (Python - FastAPI, SciPy, SimPy)
│   ├── __init__.py
│   ├── main.py              # FastAPI main entry point
│   ├── models/
│   │   ├── __init__.py
│   │   ├── component.py      # Hardware components modeling
│   │   ├── cooling.py
│   │   ├── power.py
│   │   ├── rack.py
│   │   ├── llm.py            # LLM metadata modeling
│   │   └── datacenter.py      # Overall datacenter configuration
│   │
│   ├── optimization/
│   │   ├── __init__.py
│   │   ├── optimizer.py       # Portfolio optimization engine (SciPy)
│   │   ├── constraints.py     # Power, space, cooling constraints
│   │   ├── objectives.py      # Throughput maximization, cost minimization
│   │   ├── llm_optimizer.py   # LLM-based optimization (cost/token analysis)
│   │   └── allocation.py      # Asset allocation strategies
│   │
│   ├── simulation/            # Discrete event simulation (SimPy)
│   │   ├── __init__.py
│   │   ├── thermal.py
│   │   ├── power.py
│   │   ├── costs.py
│   │   ├── tokenomics.py       # Token economics calculations for LLMs
│   │   ├── workload_modeling.py # LLM workload simulation
│   │   └── event_simulation.py # SimPy-based event simulation
│   │
│   ├── data_management/
│   │   ├── __init__.py
│   │   ├── loader.py          # YAML data loader
│   │   ├── hardware_specs.py  # GPU/ASIC spec interfaces
│   │   ├── model_specs.py     # LLM spec interfaces
│   │   ├── rack_specs.py      # Rack configuration interfaces
│   │   └── tokenomics_specs.py # LLM tokenomics interfaces
│   │
│   └── utils/
│       ├── __init__.py
│       ├── constants.py
│       ├── metrics.py         # Performance calculation utilities
│       └── logging.py         # Structured logging
│
├── frontend/                 # Frontend (React, TypeScript)
│   ├── src/
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Simulator.tsx
│   │   │   ├── OptimizationPanel.tsx
│   │   │   ├── HardwareSelector.tsx
│   │   │   ├── LLMSelector.tsx
│   │   │   ├── TokenomicsView.tsx
│   │   │   └── ResultsView.tsx
│   │   ├── hooks/
│   │   │   ├── useSimulation.ts
│   │   │   ├── useOptimization.ts
│   │   │   ├── useLLMTokenomics.ts
│   │   │   └── useDataLoader.ts
│   │   ├── types/
│   │   │   ├── hardware.ts
│   │   │   ├── models.ts
│   │   │   ├── optimization.ts
│   │   │   └── tokenomics.ts
│   │   └── utils/
│   │       └── calculations.ts
│   └── public/
│       └── index.html
│
└── tests/
    ├── backend/
    │   ├── test_optimization.py
    │   ├── test_data_loading.py
    │   ├── test_simulation.py
    │   ├── test_tokenomics.py
    │   ├── test_workload_modeling.py
    │   └── test_event_simulation.py
    └── frontend/
        └── components.test.tsx
```
