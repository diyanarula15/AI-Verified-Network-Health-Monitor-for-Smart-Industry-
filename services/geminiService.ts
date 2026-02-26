import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      genAI = new GoogleGenerativeAI(apiKey);
    }
  }
  return genAI;
};

export const queryPulseGuard = async (
  query: string, 
  contextData: any
): Promise<string> => {
  const ai = getGenAI();
  if (!ai) {
    return "PulseGuard Error: API Key not configured. Unable to connect to neural core.";
  }

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemContext = `
    You are "PulseGuard", an advanced Industrial IoT AI assistant for a smart factory network.
    
    Current System State:
    - Critical Alert: Physical Layer Fault on Link Switch_Core <-> Robot_PLC.
    - Diagnosis: TDR confirms open circuit at 32m.
    - Affected Assets: Robot_PLC_Cell_2 (Siemens S7-1500).
    - Recent Telemetry: High latency (>120ms), Packet loss (>15%).
    
    Style:
    - Tone: Professional, technical, concise, slightly futuristic ("Cyberpunk").
    - Use technical terms: Modbus TCP, Profinet, CRC errors, Signal-to-Noise Ratio (SNR), TDR.
    - Be helpful and prescriptive.
    
    User Query: "${query}"
  `;

  try {
    const result = await model.generateContent(systemContext);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "PulseGuard Connection Error: Unable to reach central processing unit.";
  }
};

export const generatePredictiveInsights = async (): Promise<string> => {
  const ai = getGenAI();
  if (!ai) return "Unable to connect to Neural Prediction Core. Check API Key.";

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const context = `
    Analyze the following Industrial IoT Telemetry Trend:
    - Target: Robot_PLC_Cell_2 (Production Line B)
    - Condition: Critical Packet Loss (15%) & Latency Spikes (150ms).
    - Root Cause: Physical Cable degradation/breakage.
    
    Task: Predict the operational impact over the next 4 hours if not resolved.
    
    Constraints:
    - Keep it under 40 words.
    - Be predictive and specific (e.g., mention "Keep Alive timeout", "Safety Stop", or "Production Halt").
    - Tone: Urgent, Predictive, Analytical.
  `;

  try {
    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return "Neural Core Offline: Prediction Unavailable.";
  }
};