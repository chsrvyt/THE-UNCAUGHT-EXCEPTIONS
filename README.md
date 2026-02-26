
  # Untitled

  This is a code bundle for Untitled. The original project is available at https://www.figma.com/design/wxjOLVYyMW0ldI5qutbRBt/Untitled.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

# 🚨 Problem Statement

India is one of the world’s largest agricultural producers — yet **30–40% of agricultural output is lost post-harvest**, not due to weak farming practices, but due to poor decision intelligence between harvest and market realization.

The issue is not production capacity.

The issue is **profit optimization.**

---

## 🔍 Core Structural Gaps

Farmers currently face:

- Harvest timing decisions made without predictive weather intelligence  
- Mandi selection based on informal networks rather than data  
- No visibility into price volatility and mandi arrival volumes  
- Absence of transport-adjusted net profit calculation  
- High spoilage risk due to storage and transit uncertainty  
- Limited transparency behind advisory recommendations  

This creates a systemic **information asymmetry**, where:

- Traders track supply inflows  
- Corporates forecast demand  
- Markets react dynamically  
- Farmers operate reactively  

---

## ⚠️ Fragmented Ecosystem

Existing solutions remain disconnected:

- Weather applications provide forecasts, not harvest strategy  
- Price portals show mandi rates, not profitability insights  
- Advisory tools lack explainability and transparency  
- No unified system integrates farm conditions with real-time market economics  

---

## 📉 Resulting Impact

Due to this intelligence gap, farmers often:

- Harvest too early or too late  
- Sell in oversupplied mandis  
- Incur unnecessary logistics costs  
- Experience preventable spoilage losses  

This leads to:

- Reduced net income  
- Increased financial volatility  
- Lower bargaining power  
- Long-term economic stress  

---

## 🌍 Sustainability Disconnect

Additionally, sustainability practices such as:

- Soil health improvement  
- Residue management  
- Regenerative farming  

remain disconnected from profitability intelligence systems, limiting long-term productivity gains and access to future carbon-linked incentive programs.

---

> The core challenge is to build a transparent, AI-driven farm-to-market intelligence platform that transforms agricultural production into optimized, explainable, and profitable market realization — while aligning with sustainable agricultural practices.

---

```mermaid
graph TD
A[Farmer Inputs] --> B[Weather API Integration]
A --> C[Soil & Crop Data]
A --> D[Mandi Price Database]

B --> E[Harvest Prediction Engine]
C --> E
D --> F[Mandi Intelligence Engine]

E --> G[Decision Layer]
F --> G

G --> H[Spoilage Risk Module]
H --> I[Recommendation Dashboard]

I --> J[Farmer Mobile Interface]
