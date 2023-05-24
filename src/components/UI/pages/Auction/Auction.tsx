import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuctionHouse, AuctionLoginForm } from "@/components/UI/sections";

const queryClient = new QueryClient();

export default function Auction() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AuctionLoginForm setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuctionHouse />
    </QueryClientProvider>
  );
}
