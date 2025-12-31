
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GeneratedImage } from "../types";

export const generateSecurityInfographic = async (topic: 'MCP' | 'A2A'): Promise<GeneratedImage> => {
  // Create a new instance right before the call to ensure fresh API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompts = {
    MCP: `Detailed technical infographic about Model Context Protocol (MCP) Security. 
          Show an MCP server node, tool registry, and an AI agent. 
          Visual themes: cyber-security, data flows, glowing nodes, 'poisoned' tool descriptions with malicious XML tags.
          Cinematic lighting, 4k detail, architectural diagram style but immersive and dark.`,
    A2A: `Detailed technical infographic about Agent-to-Agent (A2A) Security. 
          Show two AI agents communicating with 'AgentCards' and 'Session State' packets. 
          Visual themes: session smuggling, multi-turn conversation threads, unauthorized delegation, cryptographic signatures.
          Blue and purple neon aesthetic, futuristic UI elements, intricate data pathways.`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompts[topic] }] },
      config: {
        imageConfig: {
          aspectRatio: '16:9',
          imageSize: '1K'
        },
      },
    });

    let imageBase64: string | undefined;
    let mimeType = 'image/png';

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
            imageBase64 = part.inlineData.data;
            mimeType = part.inlineData.mimeType || 'image/png';
            break;
        }
      }
    }

    if (!imageBase64) throw new Error("No image generated.");

    return { base64: imageBase64, mimeType };
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_REQUIRED");
    }
    throw error;
  }
};

export const analyzeSecurityImage = async (topic: string, imageBase64: string): Promise<AnalysisResult> => {
  // Create a new instance right before the call to ensure fresh API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
Analyze this security infographic about ${topic}. Identify exactly 5 critical vulnerability areas shown in the image.
For each area, specify its coordinates in the image.

VULNERABILITIES TO LOOK FOR:
${topic === 'MCP' ? 'Tool Poisoning, Cross-Server Shadowing, Malicious Servers, Insecure Auth' : 'AgentCard Poisoning, Session Smuggling, Privilege Escalation'}

For each segment:
- label: The specific vulnerability name.
- format: "detailed" or "stats".
- description: 2-3 sentences explaining the threat.
- category: "vulnerability" or "risk".
- icon: A relevant security emoji (🛡️, ☣️, ⚠️, 🔒, 📡).
- stats: Provide "Risk Level" (High/Critical) and "Detection Method".
- bounds: Coordinates as percentages (0-100) of the total image width/height.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/png', data: imageBase64 } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  format: { type: Type.STRING, description: "Must be 'detailed' or 'stats'" },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Must be 'vulnerability' or 'risk'" },
                  icon: { type: Type.STRING },
                  stats: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.STRING }
                      },
                      required: ["label", "value"]
                    }
                  },
                  bounds: {
                    type: Type.OBJECT,
                    properties: {
                      x: { type: Type.NUMBER, description: "Percentage from left (0-100)" },
                      y: { type: Type.NUMBER, description: "Percentage from top (0-100)" },
                      width: { type: Type.NUMBER, description: "Width percentage (0-100)" },
                      height: { type: Type.NUMBER, description: "Height percentage (0-100)" }
                    },
                    required: ["x", "y", "width", "height"]
                  }
                },
                required: ["label", "format", "description", "category", "icon", "bounds"]
              }
            }
          },
          required: ["segments"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
