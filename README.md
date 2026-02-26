# PulseGuard
## AI-Verified Network Health Monitor for Industrial IT/OT

A real-time, dual-perspective simulation of an advanced industrial network monitoring system. PulseGuard demonstrates how AI-driven analysis can detect, diagnose, verify, and resolve complex network faults in an Industry 4.0 environment.

---

### 🚀 Key Features

#### 1. Dual-Persona Simulation
Experience the network from two opposing perspectives:
*   **The Adversary (Backend Login):** A chaotic actor injection panel. Inject faults, simulate cyber attacks, and degrade network performance in real-time.
*   **The Operator (Frontend Dashboard):** A professional monitoring console. Visualize the network's health as it reacts to the adversary's actions, featuring AI-driven diagnostics.

#### 2. Real-Time "Adversary" Injection Portal
Perform targeted attacks on specific network layers:
*   **L1 Physical:** Trigger cable degradation (SNR drop, CRC errors).
*   **L2 Data Link:** Inject jitter to disrupt robot synchronization.
*   **L3 Network:** Launch micro-bursts to cause buffer overflows.
*   **L7 Application:** Force Modbus write timeouts on PLCs.
*   **Advanced Threats:** Simulate physical cable cuts, firmware corruption, MAC spoofing, and WiFi jamming.
*   **Root Cause Scenario:** A complex "Fail Upstream Switch Port 4" event that triggers a cascade of 50+ alerts, designed to test the AI's correlation engine.

#### 3. Intelligent Operator Dashboard
A high-fidelity monitoring interface featuring:
*   **Dynamic Topology Map:** A force-directed graph visualizing network nodes (PLCs, Switches, HMIs).
*   **"X-Ray" Vision Modes:**
    *   **Physical View:** Highlights cabling health and broken links.
    *   **Protocol View:** Visualizes logical data flows (Profinet in purple, WiFi in cyan).
    *   **Security View:** Glows green for trusted devices, red for compromised nodes.
*   **The Intelligence Engine:**
    *   **WATCHDOG (LSTM):** Detects anomalies in real-time telemetry.
    *   **DETECTIVE (GNN):** Correlates hundreds of symptoms to a single root cause.
    *   **ACTIVE VERIFICATION (The Blue Box):** Simulates an AI agent physically checking hardware (e.g., running SSH commands and TDR pulse tests) to verify faults before alerting humans.
    *   **EXPERT (RAG LLM):** Provides actionable repair instructions in plain English.

---

### 🛠️ Technical Stack
*   **Frontend:** React 19, Tailwind CSS, Lucide React (Icons)
*   **Backend:** Node.js, Express, WebSocket (`ws`)
*   **State Management:** React Context + WebSocket real-time event broadcasting
*   **Tooling:** Vite, TypeScript

---

### 🚦 Running the Simulation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the System**
    This command launches both the backend WebSocket server (port 4000) and the frontend client (port 3000/3001).
    ```bash
    npm run server # Starts backend (WebSocket broadcast)
    npm run dev    # Starts frontend app
    ```

3.  **Access the App**
    Open your browser to `http://localhost:3000` (or `http://localhost:3001` if port busy).

4.  **Simulate!**
    *   **Window A:** Login as **Adversary** tab (Adversary View).
    *   **Window B:** Login as **Operator** tab (Shift ID View).
    *   Trigger faults (Adversary) and watch the dashboard (Operator) react instantly.

---

### 📸 Simulation Scenarios to Try

1.  **The "Ghost in the Machine" (Jitter)**
    *   *Action:* Inject **L2 Jitter** on `Robot_PLC`.
    *   *Effect:* See the link degrade amber/red. Watch the "Detective" identify synchronization loss.

2.  **The "Security Breach"**
    *   *Action:* Trigger **MAC Spoofing** or **Firmware Corruption**.
    *   *Effect:* Switch the Operator view to **Security X-Ray**. Watch the compromised node pulse red while the AI flags an intrusion.

3.  **The "Cascading Failure" (Root Cause)**
    *   *Action:* Hit the big **Fail Upstream Switch Port 4** button.
    *   *Effect:* Watch 50+ alarms trigger across the network. Wait for the **Active Verification** engine to "ssh" into the switch, run diagnostics, and correctly identify the single open circuit, suppressing the noise.
