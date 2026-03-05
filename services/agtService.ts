
/**
 * Utility to generate the AGT (Angola) compliant QR Code string for electronic invoices.
 * Based on the technical specifications for certified software in Angola.
 */
export const generateAGTQRCodeString = (data: {
  issuerNif: string;
  customerNif: string;
  invoiceType: string; // e.g., FT, FR
  invoiceStatus: string; // N (Normal), S (Self-billing), etc.
  date: string; // YYYY-MM-DD
  invoiceNumber: string; // e.g., FT 2026/0001
  hash: string; // 4-character hash from signature
  certificationNumber: string;
  totalIva: number;
  totalGross: number;
  totalNet: number;
}) => {
  // Format: A:IssuerNIF*B:CustomerNIF*C:InvoiceType*D:InvoiceStatus*E:Date*F:InvoiceNumber*G:Hash*H:CertificationNumber*I:TotalIVA*J:TotalGross*K:TotalNet
  return `A:${data.issuerNif}*B:${data.customerNif}*C:${data.invoiceType}*D:${data.invoiceStatus}*E:${data.date}*F:${data.invoiceNumber}*G:${data.hash}*H:${data.certificationNumber}*I:${data.totalIva.toFixed(2)}*J:${data.totalGross.toFixed(2)}*K:${data.totalNet.toFixed(2)}`;
};

/**
 * Simulates the hashing process required by AGT.
 * In a real scenario, this would involve RSA signing and taking the 1st, 11th, 21st, and 31st characters.
 */
export const simulateAGTHash = (previousHash: string, invoiceData: string) => {
  // Mock hash generation
  const fullHash = btoa(previousHash + invoiceData).substring(0, 4).toUpperCase();
  return fullHash;
};
