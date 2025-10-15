"use client";

import { performAnalysis } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

export function AnalysisForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setDetails(`Checking for potential ${category.toLowerCase()}.`);
    }
  }, [searchParams]);

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
      };
      reader.readAsDataURL(file);
    }
  };

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

    const formData = new FormData(event.currentTarget);
    formData.append('mediaDataUri', dataUri);

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
      </div>

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
}
