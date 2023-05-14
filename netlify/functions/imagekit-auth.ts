import { Handler } from "@netlify/functions";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.VITE_IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: "https://ik.imagekit.io/kcnylgdo8c/",
});

const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(imagekit.getAuthenticationParameters()),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  };
};

export { handler };
