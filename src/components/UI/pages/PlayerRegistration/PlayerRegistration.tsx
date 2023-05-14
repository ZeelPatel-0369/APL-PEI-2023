import { PlayerRegistrationForm, Header } from "@/components/UI/sections";

export default function PlayerRegistration() {
  return (
    <>
      <div className="bg-primary">
        <Header type="logo" logo="/APL-logo.png" width="300" height="150" />
      </div>
      <div className="max-w-7xl mx-auto p-5">
        <Header
          type="heading"
          className="text-center from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"
        >
          APL Player Registration 2023
        </Header>
        <PlayerRegistrationForm />
      </div>
    </>
  );
}
