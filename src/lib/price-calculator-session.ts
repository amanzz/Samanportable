import { PriceCalculatorPrintPayload } from "./price-calculator-config";

const estimateSessions = new Map<string, PriceCalculatorPrintPayload>();

const MAX_SESSION_MINUTES = 15;
const MAX_SESSION_SIZE = 150;
const MAX_SESSION_AGE_MS = MAX_SESSION_MINUTES * 60 * 1000;

const cleanupStaleSessions = () => {
  const now = Date.now();
  for (const [token, payload] of estimateSessions.entries()) {
    const createdAt = Date.parse(payload.createdAt);
    if (Number.isNaN(createdAt) || now - createdAt > MAX_SESSION_AGE_MS) {
      estimateSessions.delete(token);
    }
  }
  if (estimateSessions.size > MAX_SESSION_SIZE) {
    const staleKeys = Array.from(estimateSessions.keys()).slice(0, estimateSessions.size - MAX_SESSION_SIZE);
    staleKeys.forEach((key) => estimateSessions.delete(key));
  }
};

export const createEstimateSession = (payload: PriceCalculatorPrintPayload): string => {
  cleanupStaleSessions();
  const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  estimateSessions.set(token, {
    ...payload,
    createdAt: payload.createdAt || new Date().toISOString(),
  });
  return token;
};

export const fetchEstimateSession = (token: string): PriceCalculatorPrintPayload | undefined => {
  cleanupStaleSessions();
  const payload = estimateSessions.get(token);
  return payload;
};
