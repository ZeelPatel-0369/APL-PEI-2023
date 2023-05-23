import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/atoms";
import { ErrorMessage, FormInput } from "@/components/UI/molecules";
import axios from "axios";

export interface AuctionLoginFormProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuctionLoginForm({
  setIsLoggedIn,
}: AuctionLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setIsLoggedIn(false);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      setError("");
      console.log(data);

      const postData = await axios.post("/api/auth", {
        ...data,
      });
      if (postData.status !== 200) {
        setError(postData.data.message || "Something went wrong");
      } else {
        setError("");
        setIsLoggedIn(true);
      }
    } catch (error) {
      setError("Something went wrong");
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog defaultOpen open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-5 md:grid-cols-2 md:grid md:gap-3 mt-3">
            <div>
              <FormInput
                labelProps={{ children: "Username" }}
                inputType="input"
                type="text"
                id="username"
                name="username"
                placeholder="username"
                required
              />
            </div>
            <div>
              <FormInput
                labelProps={{ children: "Password" }}
                inputType="input"
                type="password"
                id="password"
                name="password"
                placeholder="password"
                required
              />
            </div>
          </div>
          <div className="mt-5">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Register
            </Button>
          </div>
        </form>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      </DialogContent>
    </Dialog>
  );
}
