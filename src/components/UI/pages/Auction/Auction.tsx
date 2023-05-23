import { useState } from "react";
import { AuctionHouse, AuctionLoginForm } from "@/components/UI/sections";

export default function Auction() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AuctionLoginForm setIsLoggedIn={setIsLoggedIn} />;
  }

  return <AuctionHouse />;
}
