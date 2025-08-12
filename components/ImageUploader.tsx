"use client";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useState } from "react";
import { Button } from "./ui/button";
import { TiUpload } from "react-icons/ti";

interface ImageUploaderProps {
  onUpload: (publicId: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [error, setError] = useState<string>("");

  const handleUploadSuccess = async (event: CloudinaryUploadWidgetResults) => {
    setError("");

    if (event?.info && (event.info as CloudinaryUploadWidgetInfo).public_id) {
      const uploadedPublicId = (event.info as CloudinaryUploadWidgetInfo)
        .public_id;
      onUpload(uploadedPublicId);
    } else {
      setError("There was an issue with the image upload.");
    }
  };

  const handleUploadError = (error: unknown) => {
    if (typeof error === "string" && error.includes("exceeds")) {
      setError("File size exceeds the 2MB limit. Please upload a smaller file");
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("File size exceeds the 2MB limit. Please upload a smaller file");
    }
  };

  return (
    <div>
      <CldUploadWidget
        uploadPreset="nextjs_posts"
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        options={{
          sources: ["local"],
          maxFileSize: 2097152,
          styles: {
            palette: {
              window: "#222", // Background color
              windowBorder: "#222", // Border color
              sourceBg: "#333",
              buttonPrimary: "#ffffff", // Button color
              button: "#ffffff",
              link: "#ffffff",
              menuIcons: "#ffffff",
              text: "#ffffff",
              primaryText: "#ffffff",
              textPrimary: "#ffffff",
            },
          },
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            onClick={() => open()}
            className="bg-blue-400 hover:bg-opacity-80"
          >
            <TiUpload /> Upload Image
          </Button>
        )}
      </CldUploadWidget>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default ImageUploader;
