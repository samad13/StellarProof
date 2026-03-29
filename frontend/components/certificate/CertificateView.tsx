"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Calendar, Hash, User, ExternalLink, Share2, AlertCircle } from "lucide-react";
import { fetchCertificate, CertificateData } from "../../services/certificate";
import { Skeleton, TextSkeleton } from "../ui/Skeleton";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";

interface CertificateViewProps {
  id: string;
}

export default function CertificateView({ id }: CertificateViewProps) {
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadCert = async () => {
      try {
        setLoading(true);
        const data = await fetchCertificate(id);
        setCert(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCert();
    }
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <div className="space-y-4 w-full md:w-2/3">
            <Skeleton className="h-10 w-48" />
            <TextSkeleton lines={2} className="w-full" />
          </div>
          <Skeleton className="h-32 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Certificate Not Found
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          {error || "The certificate ID you are looking for does not exist or has been removed."}
        </p>
        <Button href="/" className="w-full justify-center py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
          Return to Home
        </Button>
      </div>
    );
  }

  const verificationUrl = typeof window !== 'undefined' ? window.location.href : `https://stellarproof.io/certificate/${id}`;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in zoom-in-95 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800/50 shadow-sm animate-bounce-subtle">
            <ShieldCheck size={20} className="fill-emerald-500/20" />
            <span className="font-bold text-sm tracking-wide uppercase">Verified Authenticity</span>
          </div>
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Provenance Certificate
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl text-lg">
            This certificate provides immutable proof of content authenticity, registered on the Soroban smart contract.
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-white p-2 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-100">
          <QRCodeSVG 
            value={verificationUrl} 
            size={120} 
            level="H"
            includeMargin={false}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DataField 
          icon={<Hash className="text-blue-500" />} 
          label="Certificate ID" 
          value={cert.id} 
          copyable 
        />
        <DataField 
          icon={<User className="text-purple-500" />} 
          label="Owner Address" 
          value={cert.owner} 
          copyable 
        />
        <DataField 
          icon={<Calendar className="text-orange-500" />} 
          label="Minting Timestamp" 
          value={new Date(cert.timestamp).toLocaleString()} 
        />
        <DataField 
          icon={<ShieldCheck className="text-emerald-500" />} 
          label="Manifest Hash" 
          value={cert.manifestHash} 
          mono 
          copyable
        />
        <DataField 
          icon={<Hash className="text-zinc-500" />} 
          label="Content Hash" 
          value={cert.contentHash} 
          mono 
          copyable
        />
        <DataField 
          icon={<ShieldCheck className="text-amber-500" />} 
          label="Attestation Hash" 
          value={cert.attestationHash} 
          mono 
          copyable
        />
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <Button 
          onClick={handleShare}
          className="flex-1 md:flex-none justify-center gap-2 py-3 px-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
        >
          <Share2 size={18} />
          {copied ? "Copied Link!" : "Share Certificate"}
        </Button>
        <Button 
          href={`https://stellar.expert/explorer/testnet/search?term=${cert.id}`}
          target="_blank"
          className="flex-1 md:flex-none justify-center gap-2 py-3 px-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-medium"
        >
          <ExternalLink size={18} />
          View on Explorer
        </Button>
      </div>
    </div>
  );
}

function DataField({ 
  icon, 
  label, 
  value, 
  mono = false, 
  copyable = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  mono?: boolean;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group p-5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className={cn(
          "text-sm font-medium text-zinc-900 dark:text-zinc-100 break-all",
          mono && "font-mono text-[13px]"
        )}>
          {value}
        </span>
        {copyable && (
          <button 
            onClick={handleCopy}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            {copied ? <ShieldCheck size={16} className="text-emerald-500" /> : <Share2 size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
