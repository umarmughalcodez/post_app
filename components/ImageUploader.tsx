"use client";
import React, { useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

const ImageUploader = () => {
  const [publicId, setPublicId] = useState("");

  let imageUrl;
  const handleUploadSuccess = async (event: any) => {
    setPublicId(event.info.public_id);
    imageUrl =
      await `https://res.cloudinary.com/xcorpion/image/upload/${publicId}`;
  };

  return (
    <div>
      <p>Upload an Image</p>
      <CldUploadWidget
        uploadPreset="nextjs_posts"
        onSuccess={handleUploadSuccess}
        options={{
          sources: ["local"],
        }}
      >
        {({ open }) => (
          <button type="button" onClick={() => open?.()}>
            Upload Image
          </button>
        )}
      </CldUploadWidget>
      {imageUrl && (
        <Image src={imageUrl} alt="Post's Image" width={150} height={150} />
      )}
      {publicId && (
        <CldImage src={publicId} alt="Post Image" width={150} height={150} />
      )}
    </div>
  );
};

export default ImageUploader;
