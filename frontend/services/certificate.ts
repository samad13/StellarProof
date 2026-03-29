export interface CertificateData {
  id: string;
  owner: string;
  timestamp: string;
  manifestHash: string;
  contentHash: string;
  attestationHash: string;
}

export const mockCertificates: Record<string, CertificateData> = {
  "cert-123": {
    id: "cert-123",
    owner: "GD...3V",
    timestamp: "2024-03-29T10:00:00Z",
    manifestHash: "mhash_7f8e9d0c1b2a3d4e5f6g7h8i9j0k1l2m",
    contentHash: "chash_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
    attestationHash: "ahash_9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k",
  },
  "cert-456": {
    id: "cert-456",
    owner: "GB...4X",
    timestamp: "2024-03-28T15:30:00Z",
    manifestHash: "mhash_0k9j8i7h6g5f4e3d2c1b0a9z8y7x6w5v",
    contentHash: "chash_p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
    attestationHash: "ahash_k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9",
  },
};

export const fetchCertificate = async (
  id: string,
): Promise<CertificateData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const cert = mockCertificates[id];
  if (!cert) {
    throw new Error("Certificate not found");
  }
  return cert;
};
