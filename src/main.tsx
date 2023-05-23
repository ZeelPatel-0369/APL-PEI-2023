import * as React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Auction, PlayerRegistration } from "@/components/UI/pages";
import { Image, Paragraph } from "@/components/UI/atoms";
import { Header } from "@/components/UI/sections";
import "./index.css";

const prodRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <main>
        {import.meta.env.VITE_ACTIVE !== "true" ? (
          <NoShow />
        ) : (
          <PlayerRegistration />
        )}
      </main>
    ),
  },
  {
    path: "auction",
    element: (
      <main>
        {import.meta.env.VITE_ACTIVE !== "true" ? <NoShow /> : <Auction />}
      </main>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {import.meta.env.VITE_ACTIVE !== "true" ? (
      <Paragraph>Sorry, come again next year</Paragraph>
    ) : (
      <RouterProvider router={prodRouter} />
    )}
  </React.StrictMode>
);

function NoShow() {
  return (
    <>
      <div className="bg-primary">
        <Header className="bg-primary flex items-center justify-center">
          <Image src="/APL-logo.png" alt="APL Logo" width="300" height="150" />
        </Header>
      </div>
      <div className="flex justify-center items-center p-5">
        <Paragraph size="lg">Sorry, come again later.</Paragraph>
      </div>
    </>
  );
}
