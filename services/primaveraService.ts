
/**
 * PRIMAVERA ERP V10 - WEB API SIMULATOR (v2026.1)
 * Este serviço simula os endpoints técnicos do ERP Primavera.
 */

export const PrimaveraAPI = {
  // Endpoint: /Financeiro/Vendas/CriarEncomenda
  createOrderPayload: (order: any) => {
    return {
      Header: {
        TipoDoc: "ECL",
        Serie: "2026",
        Entidade: order.customerId,
        DataDoc: new Date().toISOString(),
        CondPag: "30D",
        Moeda: "AOA",
        CentroCusto: "VENDAS_MOBILE_01"
      },
      Linhas: order.items.map((item: any) => ({
        Artigo: item.id,
        Quantidade: item.quantity,
        PrecUnit: item.price,
        Desconto: 0,
        Lote: item.selectedBatchId,
        RegimeIVA: "NOR",
        TaxaIVA: 14
      })),
      Fiscal: {
        Certificado: "AGT-SVAT-2026",
        Hash: "B1C2A3D4..."
      }
    };
  },

  // Simulação de validação de crédito (ECHO Automation)
  checkCreditLimit: async (customerId: string, requestedAmount: number): Promise<{ approved: boolean; reason?: string }> => {
    // Simulação de chamada API ao Primavera Financeiro
    const customers: Record<string, any> = {
      'usr-3': { limit: 500000, debt: 100000 },
      'usr-4': { limit: 1000000, debt: 950000 },
    };

    const client = customers[customerId];
    if (!client) return { approved: true };

    const available = client.limit - client.debt;
    if (requestedAmount > available) {
      return { 
        approved: false, 
        reason: `Limite excedido. Disponível: ${available.toLocaleString()} Kz` 
      };
    }
    return { approved: true };
  }
};

export const OracleAnalytics = {
  getContributionMargin: () => {
    return [
      { category: 'Fresco', margin: 35 },
      { category: 'Congelado', margin: 22 },
      { category: 'Marisco', margin: 48 },
    ];
  }
};
