import { Metadata } from "next";
import CertificateView from "@/components/certificate/CertificateView";
import Header from "@/components/Header";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Certificate ${id} | StellarProof`,
    description: `View immutable provenance certificate ${id} on StellarProof.`,
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] font-sans selection:bg-primary/30">
      <Header />
      <main className="w-full pt-24 pb-12">
        <CertificateView id={id} />
      </main>
    </div>
  );
}
