"use client";

import { performAnalysis } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Camera, RefreshCcw, SwitchCamera } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import { useAuth } from "../auth-provider";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function AnalysisForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setDetails(`Checking for potential ${category.toLowerCase()}.`);
    }
  }, [searchParams]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const cleanup = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
    
    const startCamera = async () => {
      cleanup(); // Stop any existing stream
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const availableVideoDevices = devices.filter(d => d.kind === 'videoinput');
        setVideoDevices(availableVideoDevices);
        
        if (availableVideoDevices.length === 0) {
            throw new Error("No video input devices found");
        }

        const deviceId = availableVideoDevices[currentDeviceIndex]?.deviceId;
        const constraints: MediaStreamConstraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined,
                // Prioritize rear camera
                facingMode: deviceId ? undefined : { ideal: 'environment' }
            }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);

      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    if (showCamera) {
      startCamera();
    } else {
      cleanup();
    }
    
    return cleanup;

  }, [showCamera, currentDeviceIndex, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
            variant: 'destructive',
            title: 'File too large',
            description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setDataUri(reader.result as string);
        setShowCamera(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const capturedDataUri = canvas.toDataURL('image/jpeg');
        setDataUri(capturedDataUri);
        setPreview(capturedDataUri);
        setShowCamera(false);
      }
    }
  };
  
  const resetForm = () => {
    setPreview(null);
    setDataUri("");
    setShowCamera(false);
  }

  const handleSwitchCamera = () => {
    setCurrentDeviceIndex(prevIndex => (prevIndex + 1) % videoDevices.length);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dataUri) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please select an image to analyze.',
      });
      return;
    }

    const userId = user?.uid || 'anonymous-user';

    const formData = new FormData(event.currentTarget);
    formData.append('mediaDataUri', dataUri);
    formData.append('userId', userId);

    startTransition(async () => {
      const result = await performAnalysis(formData);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: typeof result.error === 'string' ? result.error : 'Please check the form and try again.',
        });
      } else if (result.analysisId) {
        toast({
          title: 'Analysis Started',
          description: 'Your crop image is being analyzed. You will be redirected shortly.',
        });
        router.push(`/dashboard/analysis/${result.analysisId}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="crop-image">Crop Image</Label>
        
        {showCamera ? (
            <div className="w-full h-auto border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center relative overflow-hidden p-4 space-y-4">
               {!hasCameraPermission ? (
                     <Alert variant="destructive">
                       <AlertTitle>Camera Access Denied</AlertTitle>
                       <AlertDescription>
                         Please enable camera permissions in your browser settings and try again.
                       </AlertDescription>
                     </Alert>
               ) : (
                <>
                  <div className="relative w-full">
                     <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                     {videoDevices.length > 1 && (
                       <Button 
                         type="button" 
                         size="icon" 
                         variant="secondary"
                         className="absolute bottom-2 right-2 rounded-full"
                         onClick={handleSwitchCamera}
                       >
                         <SwitchCamera />
                       </Button>
                     )}
                  </div>
                  <Button type="button" onClick={handleCapture} disabled={isPending}>
                      <Camera className="mr-2" /> Capture Photo
                  </Button>
                </>
               )}
            </div>
        ) : (
          <div className="w-full h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center relative overflow-hidden">
            {preview ? (
              <Image src={preview} alt="Crop preview" fill className="object-contain" />
            ) : (
              <div className="text-center text-muted-foreground">
                <UploadCloud className="mx-auto h-12 w-12" />
                <p>Click to browse or drag & drop</p>
                <p className="text-xs">PNG, JPG, WEBP up to 4MB</p>
              </div>
            )}
            <Input
              id="crop-image"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              disabled={isPending}
            />
          </div>
        )}
      </div>

      {!preview && !showCamera && (
         <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
        </div>
      )}


      <div className="flex flex-col sm:flex-row gap-2">
       {!preview && (
        <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowCamera(!showCamera)} 
            disabled={isPending}
        >
            <Camera className="mr-2" /> {showCamera ? 'Close Camera' : 'Use Camera'}
        </Button>
       )}
       {preview && (
        <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={resetForm} 
            disabled={isPending}
        >
            <RefreshCcw className="mr-2" /> Retake / Re-upload
        </Button>
       )}
      </div>
      
      <canvas ref={canvasRef} className="hidden"></canvas>


      <div className="space-y-2">
        <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
        <Textarea
          id="additionalDetails"
          name="additionalDetails"
          placeholder="e.g., 'Corn plant, 2 weeks old, leaves are yellowing'"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !preview}>
        {isPending ? "Analyzing..." : "Start Analysis"}
      </Button>
    </form>
  );
