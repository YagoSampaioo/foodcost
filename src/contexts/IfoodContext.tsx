import { createContext, useState, ReactNode, useCallback } from "react";
import { ifoodService } from "../services/ifoodService";
import { IfoodSalesResponse } from "../types/ifood";

// Tipos simplificados
interface Merchant {
  id: string;
  name: string;
}

interface IfoodContextType {
  isConnected: boolean;
  status: "disconnected" | "connecting" | "connected" | "error";
  merchants: Merchant[];
  sales: IfoodSalesResponse[];
  loading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  fetchSales: (merchantId: string, beginDate: string, endDate: string) => Promise<void>;
}

export const IfoodContext = createContext<IfoodContextType | undefined>(undefined);

export const IfoodProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected" | "error">(
    ifoodService.isConnected() ? "connected" : "disconnected"
  );
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [sales, setSales] = useState<IfoodSalesResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    const success = await ifoodService.authenticate();
    if (success) {
      setLoading(true);
      const merchantList = await ifoodService.getMerchants();
      if (merchantList.length > 0) {
        setMerchants(merchantList);
        setStatus("connected");
      } else {
        setError("Nenhuma loja (merchant) encontrada.");
        setStatus("error");
      }
      setLoading(false);
    } else {
      setError("Falha na autenticação com o iFood.");
      setStatus("error");
    }
  }, []);

  const disconnect = useCallback(() => {
    ifoodService.disconnect();
    setStatus("disconnected");
    setMerchants([]);
    setSales([]);
  }, []);

  const fetchSales = useCallback(async (merchantId: string, beginDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    const salesData = await ifoodService.getSales(merchantId, beginDate, endDate);
    setSales(salesData);
    setLoading(false);
    if (salesData.length === 0) {
      // Poderíamos setar uma mensagem em vez de um alert
      console.log("Nenhuma venda encontrada para o período.");
    }
  }, []);

  return (
    <IfoodContext.Provider
      value={{
        isConnected: status === "connected",
        status,
        merchants,
        sales,
        loading,
        error,
        connect,
        disconnect,
        fetchSales,
      }}>
      {children}
    </IfoodContext.Provider>
  );
};
