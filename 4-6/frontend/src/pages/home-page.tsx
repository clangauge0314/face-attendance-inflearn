import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Loader2 } from "lucide-react";
import { FaceRegistrationForm } from "../components/face/face-registration-form";
import { useFaceDetection } from "../hooks/useFaceDetection";
import { useFaceRegistration } from "../hooks/useFaceRegistration";
import { useWebcam } from "../hooks/useWebcam";
import { useThemeStore } from "../stores/theme-store";
import { verifyFacePreview, detectFacePublic } from "../api/face";

const HomePage = () => {
  const { isDark } = useThemeStore();
  const webcamRef = useRef<Webcam>(null);

  const {
    hasFaceData,
    isRegistering,
    capturedImage,
    checkFaceData,
    capture,
    retake,
    registerFace,
  } = useFaceRegistration();

  const {
    webcamError,
    availableDevices,
    selectedDeviceId,
    isLoadingDevices,
    setSelectedDeviceId,
    handleUserMedia,
    handleUserMediaError,
    requestCameraPermission,
  } = useWebcam();

  useEffect(() => {
    checkFaceData();
  }, [checkFaceData]);

  const handleCapture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        console.log("Image captured successfully");
        capture(imageSrc);
      }
    } catch (error) {
      console.error("Capture error:", error);
    }
  }, [capture]);

  const handleAutoCapture = useCallback(
    (imageSrc: string) => {
      capture(imageSrc);
    },
    [capture]
  );

  const { resetDetection } = useFaceDetection({
    isOpen: !hasFaceData && !capturedImage && !webcamError && !isLoadingDevices,
    capturedImage: capturedImage,
    webcamRef: webcamRef as React.RefObject<Webcam>,
    onAutoCapture: handleAutoCapture,
    verifyFn: async (image: string) => {
      if (!hasFaceData) {
        const response = await detectFacePublic({ image });
        return {
          similarity: 1.0,
          verified: response.detected,
          detected: response.detected,
        };
      } else {
        const response = await verifyFacePreview({ image });
        return {
          similarity: response.similarity,
          verified: response.verified,
          detected: response.detected,
        };
      }
    },
  });

  useEffect(() => {
    checkFaceData();
  }, [checkFaceData]);

  const handleRetake = useCallback(() => {
    retake();
    resetDetection();
  }, [retake, resetDetection]);

  if (hasFaceData === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2
          className={`animate-spin ${isDark ? "text-white" : "text-zinc-900"}`}
          size={48}
        />
      </div>
    );
  }

  if (!hasFaceData) {
    return (
      <FaceRegistrationForm
        webcamRef={webcamRef as React.RefObject<Webcam>}
        capturedImage={capturedImage}
        isRegistering={isRegistering}
        webcamError={webcamError}
        availableDevices={availableDevices}
        selectedDeviceId={selectedDeviceId}
        isLoadingDevices={isLoadingDevices}
        onDeviceChange={setSelectedDeviceId}
        onCapture={handleCapture}
        onRetake={handleRetake}
        onRegister={registerFace}
        onRequestPermission={requestCameraPermission}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl"></div>
      </div>
    </div>
  );
};

export default HomePage;
