import { Heading, Image } from "@/components/UI/atoms";
import { Header, PlayerRegistrationForm } from "@/components/UI/sections";

export default function PlayerRegistration() {
  return (
    <>
      <Header className="bg-primary flex items-center justify-center">
        <Image src="/APL-logo.png" alt="APL Logo" width="300" height="150" />
      </Header>
      <div className="max-w-7xl mx-auto p-5">
        <Heading
          level={1}
          className="text-center from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"
        >
          APL Player Registration 2023
        </Heading>
        <PlayerRegistrationForm />
      </div>
    </>
  );
}
