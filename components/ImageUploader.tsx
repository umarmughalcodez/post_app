"use client";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useState } from "react";
import { Button } from "./ui/button";

interface ImageUploaderProps {
  onUpload: (publicId: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [error, setError] = useState<string>("");

  // const handleUploadSuccess = async (event: any) => {
  //   setError("");
  //   const uploadedPublicId = event.info.public_id;

  //   onUpload(uploadedPublicId);
  // };

  const handleUploadSuccess = async (event: CloudinaryUploadWidgetResults) => {
    setError("");

    // Check if event.info is of type CloudinaryUploadWidgetInfo
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
      setError(
        "File size exceeds the 2MB limit. Please upload a smaller file."
      );
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("An unexpected error has occured");
    }
  };

  return (
    <div>
      <p className="text-white">Upload an Image</p>
      <CldUploadWidget
        uploadPreset="nextjs_posts"
        // onSuccess={(event: CloudinaryUploadWidgetResults) => {
        //   setError("");
        //   const uploadedPublicId = event?.info?.public_id;

        //   onUpload(uploadedPublicId);
        // }}
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        options={{
          sources: ["local"],
          maxFileSize: 2097152,
        }}
      >
        {({ open }) => (
          <Button
            onClick={() => open?.()}
            className="bg-blue-400 hover:bg-opacity-80"
          >
            Upload Image
          </Button>
        )}
      </CldUploadWidget>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default ImageUploader;
