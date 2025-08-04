// Rate limiter server-side para controlo de uso da API
export interface RateLimitInfo {
  isAllowed: boolean;
  remainingRequests: number;
  resetTime: number;
}

// Armazenamento em memória simples (em produção usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(licenseKey: string, clientIP: string): RateLimitInfo {
  const key = `${licenseKey}_${clientIP}`;
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  const maxRequestsPerHour = 50;
  
  // Limpar entradas expiradas periodicamente
  if (Math.random() < 0.01) { // 1% de chance de limpeza
    for (const [k, v] of rateLimitStore.entries()) {
      if (now >= v.resetTime) {
        rateLimitStore.delete(k);
      }
    }
  }
  
  let limitData = rateLimitStore.get(key);
  
  // Inicializar ou resetar se expirado
  if (!limitData || now >= limitData.resetTime) {
    limitData = {
      count: 0,
      resetTime: now + hourInMs
    };
    rateLimitStore.set(key, limitData);
  }
  
  const isAllowed = limitData.count < maxRequestsPerHour;
  const remainingRequests = Math.max(0, maxRequestsPerHour - limitData.count);
  
  if (isAllowed) {
    limitData.count++;
    rateLimitStore.set(key, limitData);
  }
  
  return {
    isAllowed,
    remainingRequests,
    resetTime: limitData.resetTime
  };
}
