import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crop } from "lucide-react";

interface ImageCropperProps {
  onImageCropped: (croppedFile: File) => void;
  onCropStatusChange: (status: boolean) => void; // Callback untuk mengirim status crop
  initialImage?: string;
  className?: string;
}

export interface ImageCropperRef {
  reset: () => void; // Function to reset the cropper
}

const ImageCropper = forwardRef<ImageCropperRef, ImageCropperProps>(
  ({ onImageCropped, onCropStatusChange, initialImage, className }, ref) => {
    const cropperRef = useRef<HTMLImageElement & { cropper?: Cropper }>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(
      initialImage || null
    );
    const [showCropper, setShowCropper] = useState(false);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // Expose the reset function via ref
    useImperativeHandle(ref, () => ({
      reset: () => {
        setCurrentImage(null);
        setUploadedImage(null);
        setCroppedImage(null);
        setShowCropper(false);
        onCropStatusChange(false); // Update crop status saat di-reset
      },
    }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result as string;
          setCurrentImage(imageData);
          setUploadedImage(imageData); // Store the original uploaded image
          setShowCropper(true);
          setCroppedImage(null);
          onCropStatusChange(false); // Update crop status saat gambar diupload
        };
        reader.readAsDataURL(file);
      }
    };

    const cropImage = () => {
      const cropper = cropperRef.current?.cropper;
      if (cropper) {
        cropper.getCroppedCanvas().toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const timestamp = new Date().getTime();
              const croppedFile = new File(
                [blob],
                `cropped-image-${timestamp}.png`,
                {
                  type: "image/png",
                  lastModified: timestamp,
                }
              );

              const croppedImageUrl = URL.createObjectURL(blob);
              setCroppedImage(croppedImageUrl);
              setShowCropper(false);
              onImageCropped(croppedFile);
              onCropStatusChange(true); // Update crop status menjadi true
            }
          },
          "image/png",
          1
        );
      }
    };

    const resetImage = () => {
      // Return to cropping state with the previously uploaded image
      setCurrentImage(uploadedImage);
      setCroppedImage(null);
      setShowCropper(true);
      onCropStatusChange(false); // Update crop status saat gambar direset
    };

    return (
      <div className={className}>
        <div className="relative bg-muted dark:bg-background aspect-square flex items-center justify-center rounded-md overflow-hidden">
          {!currentImage && !croppedImage && (
            <p className="text-sm text-muted-foreground">Upload an image</p>
          )}

          {showCropper && currentImage && (
            <Cropper
              src={currentImage}
              style={{ height: "100%", width: "100%" }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
            />
          )}

          {!showCropper && (croppedImage || currentImage) && (
            <div className="w-full h-full relative">
              <img
                src={croppedImage || currentImage || ""}
                alt="Profile"
                className="w-full h-full object-cover rounded-full p-1"
              />
            </div>
          )}
        </div>

        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-4"
        />

        <div className="flex flex-col gap-2 mt-2">
          {showCropper && (
            <Button type="button" onClick={cropImage} className="w-full">
              <Crop />
              Crop Image
            </Button>
          )}

          {croppedImage && (
            <Button
              type="button"
              variant="outline"
              onClick={resetImage}
              className="w-full"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    );
  }
);

ImageCropper.displayName = "ImageCropper";

export default ImageCropper;
