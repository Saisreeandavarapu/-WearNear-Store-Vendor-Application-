import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  Flashlight,
  FlashlightOff,
  SwitchCamera,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Keyboard,
  Sparkles,
  Zap
} from 'lucide-react';
import { playScanSuccessSound, playScanErrorSound } from '../../utils/barcodeUtils';
import { useData } from '../../context/DataContext';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  continuous?: boolean;
  pauseDurationMs?: number;
  className?: string;
  showSimulatedBarcodes?: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  continuous = false,
  pauseDurationMs = 1200,
  className = '',
  showSimulatedBarcodes = true
}) => {
  const scannerContainerId = useRef(`barcode-reader-${Math.random().toString(36).substring(2, 9)}`);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { products } = useData();

  // Hardware USB/Bluetooth scanner buffer detection
  const keyBufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      const cleanCode = decodedText.trim();
      if (!cleanCode) return;

      playScanSuccessSound();
      setLastScannedCode(cleanCode);
      setIsPaused(true);

      onScan(cleanCode);

      if (continuous) {
        setTimeout(() => {
          setIsPaused(false);
          setLastScannedCode(null);
        }, pauseDurationMs);
      }
    },
    [onScan, continuous, pauseDurationMs]
  );

  // Initialize and start camera scanner
  const startScanner = useCallback(async () => {
    try {
      setCameraError(null);

      // Stop previous instance if running
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
        } catch {
          // ignore
        }
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId.current, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.QR_CODE
        ],
        verbose: false
      });

      html5QrCodeRef.current = html5QrCode;

      const qrConfig = {
        fps: 15,
        qrbox: { width: 260, height: 160 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: facingMode },
        qrConfig,
        (decodedText) => {
          if (!isPaused) {
            handleScanSuccess(decodedText);
          }
        },
        () => {
          // Frame parsed without barcode - normal scanning loop
        }
      );

      setIsScanning(true);

      // Check torch capabilities
      try {
        const track = (html5QrCode as any).getRunningTrackCameraCapabilities?.();
        if (track && 'torch' in track) {
          setHasTorch(true);
        }
      } catch {
        setHasTorch(false);
      }
    } catch (err: any) {
      setIsScanning(false);
      const msg = err?.message || String(err);
      if (msg.includes('NotAllowedError') || msg.includes('Permission denied')) {
        setCameraError('Camera access denied. Please permit camera access in your browser settings.');
      } else if (msg.includes('NotFoundError') || msg.includes('No camera')) {
        setCameraError('No camera found on this device. You can enter barcodes manually or use a USB scanner.');
      } else {
        setCameraError('Unable to start camera preview. Please check device permissions or use manual entry.');
      }
    }
  }, [facingMode, isPaused, handleScanSuccess]);

  // Cleanup on unmount or facingMode switch
  useEffect(() => {
    startScanner();

    return () => {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch(() => {});
          }
          html5QrCodeRef.current.clear();
        } catch {
          // ignore
        }
      }
    };
  }, [startScanner]);

  // Hardware USB/Bluetooth Barcode Scanner Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is actively typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;

      if (e.key === 'Enter') {
        if (keyBufferRef.current.length >= 3 && timeDiff < 100) {
          e.preventDefault();
          const barcode = keyBufferRef.current.trim();
          keyBufferRef.current = '';
          handleScanSuccess(barcode);
        } else {
          keyBufferRef.current = '';
        }
      } else if (e.key.length === 1) {
        // If keystroke arrived within 55ms of previous, it's almost certainly a hardware scanner
        if (timeDiff > 80 && keyBufferRef.current.length > 0) {
          keyBufferRef.current = ''; // reset buffer if human typing
        }
        keyBufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleScanSuccess]);

  // Flashlight toggle
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current) return;
    try {
      const nextTorch = !isTorchOn;
      await (html5QrCodeRef.current as any).applyVideoConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setIsTorchOn(nextTorch);
    } catch {
      setHasTorch(false);
    }
  };

  // Flip camera between back/front
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Quick test barcodes list
  const testBarcodes = [
    { label: 'Silk Kurta (M)', code: '8901234567028', color: 'bg-indigo-50 border-indigo-200 text-[#172B82]' },
    { label: 'Selvedge Denim (32)', code: '8901234567066', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { label: 'Linen Shirt (L)', code: '8901234567110', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { label: 'Kolhapuri (8)', code: '8901234567158', color: 'bg-amber-50 border-amber-200 text-amber-800' },
    { label: 'Out of Stock (Anarkali)', code: '8901234567202', color: 'bg-rose-50 border-rose-200 text-rose-800' },
    { label: 'Unknown Barcode', code: '8909999999999', color: 'bg-purple-50 border-purple-200 text-purple-800' }
  ];

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* Scanner Viewport Card */}
      <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-black rounded-3xl overflow-hidden border border-[#DDD7CA] shadow-inner flex items-center justify-center">
        {/* HTML5 QR Code Mount Element */}
        <div id={scannerContainerId.current} className="w-full h-full object-cover" />

        {/* Ambient Dark Overlay with transparent center viewport */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Target Reticle Frame */}
          <div className="relative w-64 h-40 sm:w-72 sm:h-44 rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.52)] flex items-center justify-center overflow-hidden">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#3155D8] rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#3155D8] rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#3155D8] rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#3155D8] rounded-br-lg" />

            {/* Subtle Animated Vertical Laser Scanning Line */}
            {isScanning && !isPaused && (
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{
                  y: [ -70, 70, -70 ],
                  opacity: [ 0.4, 0.95, 0.4 ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut'
                }}
                className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#3155D8] to-transparent shadow-[0_0_12px_#3155D8]"
              />
            )}

            {/* Success Feedback Pulse */}
            <AnimatePresence>
              {isPaused && lastScannedCode && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 bg-[#16A34A]/30 backdrop-blur-[2px] flex flex-col items-center justify-center text-white"
                >
                  <CheckCircle2 className="w-12 h-12 text-[#16A34A] drop-shadow-md" />
                  <span className="text-xs font-bold tracking-wider mt-1 bg-black/60 px-2.5 py-0.5 rounded-full">
                    {lastScannedCode}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Camera Permission / Unavailable State */}
        {cameraError && (
          <div className="absolute inset-0 bg-[#172033]/90 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center text-white z-20 space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="max-w-xs">
              <h4 className="font-bold text-sm">Camera Unavailable</h4>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">{cameraError}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={startScanner}
                className="px-4 py-2 bg-[#172B82] hover:bg-[#243FBA] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
              </button>
            </div>
          </div>
        )}

        {/* Top Camera Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Retail Scanner Ready</span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasTorch && (
              <button
                onClick={toggleTorch}
                title="Toggle Flashlight"
                className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center text-white transition-colors ${
                  isTorchOn ? 'bg-amber-500 shadow-md shadow-amber-500/30' : 'bg-black/60 hover:bg-black/80'
                }`}
              >
                {isTorchOn ? <Flashlight className="w-4 h-4 text-black" /> : <FlashlightOff className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={toggleFacingMode}
              title="Switch Camera (Front/Back)"
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white transition-colors"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Status Tip */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10 px-4">
          <p className="text-[11px] font-medium text-white/80 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full text-center border border-white/10 shadow-xs">
            Align barcode inside frame • USB/Bluetooth scanners supported
          </p>
        </div>
      </div>

      {/* QUICK 1-CLICK TEST SIMULATOR CHIPS (for dev, desktop, & instant verification) */}
      {showSimulatedBarcodes && (
        <div className="mt-3.5 p-3 rounded-2xl bg-[#FFFCF5] border border-[#DDD7CA] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#172033] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#172B82]" />
              Quick Test Barcodes (1-Click Simulator)
            </span>
            <span className="text-[10px] text-[#687085]">Instant scan simulation</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {testBarcodes.map((item) => (
              <motion.button
                key={item.code}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handleScanSuccess(item.code)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all shadow-2xs ${item.color} hover:brightness-95`}
              >
                <span>{item.label}</span>
                <span className="font-mono text-[9px] opacity-75 font-normal">({item.code.slice(-4)})</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
