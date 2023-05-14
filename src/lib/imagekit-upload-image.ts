import { IKCore } from "imagekitio-react";

if (!import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY) {
  throw new Error("IMAGEKIT_PUBLIC_KEY is not defined");
}
if (!import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT) {
  throw new Error("IMAGEKIT_AUTH_ENDPOINT is not defined");
}

const imagekit = new IKCore({
  publicKey: "public_UA6I0D9tPS6Mbe4aqOToufAmIQw=",
  urlEndpoint: "https://ik.imagekit.io/kcnylgdo8c/",
  authenticationEndpoint:
    "http://localhost:8888/.netlify/functions/imagekit-auth",
});

interface UploadImageErrorResponse {
  success: false;
}
interface UploadImageSuccessResponse {
  success: true;
  url: string;
}
export type UploadImageResponse =
  | UploadImageErrorResponse
  | UploadImageSuccessResponse;
export function uploadImage({
  file,
  fileName,
}: {
  file: File;
  fileName: string;
}): Promise<UploadImageResponse> {
  return imagekit
    .upload({
      file,
      fileName,
      tags: ["player"],
      folder: "/apl-pei-23",
      overwriteFile: true,
      useUniqueFileName: false,
    })
    .then((data) => {
      return {
        success: true,
        url: data.url,
      };
    })
    .catch((err) => {
      console.log("Imagekit upload error: ", err);
      return {
        success: false,
      };
    });
}
