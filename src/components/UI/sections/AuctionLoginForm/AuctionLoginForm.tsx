import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/components/UI/atoms";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/organisms";
import { ErrorMessage } from "@/components/UI/molecules";

const formSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(2, "Username must contain at least 2 characters"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(2, "Password must contain at least 2 characters"),
});

export interface AuctionLoginFormProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuctionLoginForm({
  setIsLoggedIn,
}: AuctionLoginFormProps) {
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const { formState } = form;

  async function handleLogin(values: z.infer<typeof formSchema>) {
    setError("");
    setIsLoggedIn(false);

    try {
      setError("");

      const postData = await axios.post("/api/auth", {
        ...values,
      });
      if (postData.status !== 200) {
        setError(
          postData.data.message || "Something went wrong. Please try again."
        );
      } else {
        setError("");
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.response?.status !== 200) {
          setError(
            error.response?.data.message ||
              "Something went wrong. Please try again."
          );
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
      setIsLoggedIn(false);
    }
  }

  return (
    <Dialog defaultOpen open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Login
            </Button>
          </form>
        </Form>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      </DialogContent>
    </Dialog>
  );
}
