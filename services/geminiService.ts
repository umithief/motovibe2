import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Client instance holder
let ai: GoogleGenAI | null = null;

// Initialize the client lazily to prevent startup crashes if environment is not ready
const getAiClient = () => {
  if (!ai) {
    // API key must be obtained exclusively from process.env.API_KEY
    if (!process.env.API_KEY) {
      console.error("API Key is missing!");
      throw new Error("API Key eksik");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const SYSTEM_INSTRUCTION = `
Sen MotoVibe adında bir motosiklet aksesuar mağazasının uzman yapay zeka satış danışmanısın.
Amacın, kullanıcıların sürüş tarzına, bütçesine ve ihtiyaçlarına göre mağazamızdaki en uygun ürünleri önermektir.

Aşağıdaki ürün listesine tam erişimin var. Lütfen sadece bu listedeki ürünleri öner, ancak genel motosiklet tavsiyesi de verebilirsin.
Ürün önerirken ürünün adını ve neden o kullanıcı için uygun olduğunu belirt.

ÜRÜN LİSTESİ:
${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price, features: p.features })))}

Kurallar:
1. Çok nazik, "kardeşim", "dostum" gibi samimi ama saygılı bir motorcu dili kullanabilirsin.
2. Kısa ve öz cevaplar ver.
3. Kullanıcı "Merhaba" derse, ona nasıl yardımcı olabileceğini sor (Örn: Hangi motoru sürüyorsun? Hava durumu nasıl? vb.)
4. Sadece Türkçe konuş.
5. Ürün önerdiğinde fiyatını da belirt.
`;

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'model'; text: string }[] = []): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Anahtarı eksik. Lütfen geliştirici ile iletişime geçin.";
  }

  try {
    const client = getAiClient();
    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Yanıt alınamadı.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for specific RPC/Network errors
    // Error code 6 or "Rpc failed" usually indicates a network or proxy issue on the client side
    // or an invalid API key configuration causing the backend to reject the connection abruptly.
    if (error.message && (error.message.includes("Rpc failed") || error.message.includes("xhr error"))) {
        return "Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin (Error: Network/RPC).";
    }
    
    return "Üzgünüm, şu an bağlantımda bir sorun var. Birazdan tekrar dener misin dostum?";
  }
};