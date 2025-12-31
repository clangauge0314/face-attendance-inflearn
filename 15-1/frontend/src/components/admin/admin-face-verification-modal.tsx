import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { useWebcam } from "../../hooks/useWebcam";
import { useFaceDetection } from "../../hooks/useFaceDetection";
import { useFacePreview } from "../../hooks/useFacePreview";
import { useThemeStore } from "../../stores/theme-store";
import { previewAdminFace } from "../../api/admin";
import { CameraSelector } from "../access/camera-selector";
import { AccessCamera } from "../access/access-camera";
import { CameraStatus } from "../access/camera-status";
import { CameraActions } from "../access/camera-actions";

interface AdminFaceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (imageSrc: string) => void;
  webcamRef: React.RefObject<Webcam | null>;
  userId: string;
}

export const AdminFaceVerificationModal = ({
  isOpen,
  onClose,
  onVerified,
  webcamRef,
  userId,
}: AdminFaceVerificationModalProps) => {
  const { isDark } = useThemeStore();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const {
    availableDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    handleUserMedia,
    handleUserMediaError,
  } = useWebcam();

  const {
    similarity,
    isPreviewing,
    previewError,
    previewSimilarity,
    resetPreview,
  } = useFacePreview({
    verifyFn: async (image: string) => {
      const response = await previewAdminFace({ userId, image });
      return {
        similarity: response.similarity,
        verified: response.verified,
        detected: true,
      };
    },
    onSuccess: (imageSrc) => {
      setCapturedImage(imageSrc);
    },
  });

  const { similarity: detectedSimilarity, resetDetection } = useFaceDetection({
    isOpen,
    capturedImage,
    webcamRef,
    onAutoCapture: (imageSrc) => {
      setCapturedImage(imageSrc);
      previewSimilarity(imageSrc);
    },
    verifyFn: async (image: string) => {
      const response = await previewAdminFace({ userId, image });
      return {
        similarity: response.similarity,
        verified: response.verified,
        detected: true,
      };
    },
  });

  const handleCapture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        previewSimilarity(imageSrc);
      }
    } catch (error) {
      console.error("Capture error:", error);
      toast.error("사진 촬영 실패", {
        description: "웹캠에서 이미지를 가져올 수 없습니다.",
      });
    }
  }, [webcamRef, previewSimilarity]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    resetDetection();
    resetPreview();
  }, [resetDetection, resetPreview]);

  const handleConfirm = useCallback(() => {
    if (capturedImage) {
      onVerified(capturedImage);
    }
  }, [capturedImage, onVerified]);

  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      resetDetection();
      resetPreview();
    }
  }, [isOpen, resetDetection, resetPreview]);

  if (!isOpen) return null;

  const currentSimilarity = capturedImage ? similarity : detectedSimilarity;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative z-10 w-full max-w-2xl rounded-3xl border p-6 shadow-2xl ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-zinc-200 bg-white"
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute right-4 top-4 rounded-lg p-2 transition-colors ${
              isDark ? "hover:bg-slate-800" : "hover:bg-zinc-100"
            }`}
          >
            <X
              size={20}
              className={isDark ? "text-slate-400" : "text-zinc-600"}
            />
          </button>

          <h2
            className={`mb-4 text-xl font-semibold ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            관리자 얼굴 인증
          </h2>

          <div className="mb-4">
            <CameraSelector
              availableDevices={availableDevices}
              selectedDeviceId={selectedDeviceId}
              onDeviceChange={setSelectedDeviceId}
            />
          </div>

          <AccessCamera
            webcamRef={webcamRef}
            selectedDeviceId={selectedDeviceId}
            capturedImage={capturedImage}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
          />

          <CameraStatus
            similarity={currentSimilarity}
            isPreviewing={isPreviewing}
            previewError={previewError}
          />

          <CameraActions
            capturedImage={capturedImage}
            isChecking={isPreviewing}
            onCapture={handleCapture}
            onRetake={handleRetake}
            onCheckIn={handleConfirm}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
