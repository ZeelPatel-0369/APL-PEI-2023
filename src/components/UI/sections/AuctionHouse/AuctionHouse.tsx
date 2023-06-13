import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import Confetti from "react-confetti";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Heading,
  Image,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/atoms";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/UI/organisms";

const formSchema = z.object({
  amount: z.string({
    required_error: "Amount is required",
  }),
  team: z.string({
    required_error: "Team is required",
  }),
});

const teams = [
  "Summerside Mustang",
  "Lighthouse Lions",
  "Stratford Strikers",
  "Rustico Titans",
  "Charlottetown Eagles",
  "Cornwall Knight Riders",
];

interface Data {
  player: {
    id: number;
    firstName: string;
    lastName: string;
    tel: string;
    email: string;
    playingRole: string;
    batsmanRating: Array<number>;
    handedBatsman: string;
    battingComment: string;
    bowlerRating: Array<number>;
    armBowler: string;
    typeBowler: string;
    bowlingComment: string;
    fielderRating: Array<number>;
    fielderComment: string;
    imageUrl: string;
  };
  message: string;
}

export default function AuctionHouse() {
  const [error, setError] = useState("");
  const [sold, setSold] = useState(false);
  const [soldTo, setSoldTo] = useState("");

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["player"],
    queryFn: async () => {
      const res = await axios.get("/api/get-random-player");
      return res.data as Data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const { formState } = form;

  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="mr-2 h-52 w-52 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return <div>Something went wrong. Please reload.</div>;
  }

  const { player, message } = data;

  async function sellPlayer(values: z.infer<typeof formSchema>) {
    const data = await axios.post("/api/sell-player", {
      ...values,
      id: player.id,
    });
    if (data.status === 200) {
      setSoldTo(values.team);
      setSold(true);
      setError("");
      form.reset();
    } else {
      setError(data.data.message || "Something went wrong. Please try again.");
    }
  }

  async function nextPlayer() {
    setSold(false);
    setSoldTo("");
    setError("");
    refetch();
  }

  if (message) {
    return (
      <>
        <Confetti />
        <div className="flex items-center justify-center h-screen">
          <Heading level={2}>{message}</Heading>
        </div>
      </>
    );
  }

  return (
    <>
      {sold ? (
        <>
          <Confetti style={{ zIndex: 999, pointerEvents: "none" }} />
          <Dialog open>
            <DialogContent
              className="sm:max-w-[425px]"
              portalClassName="items-center"
            >
              <DialogHeader>
                <DialogTitle>
                  <Heading level={4}>
                    {player.firstName} {player.lastName} sold to {soldTo}
                  </Heading>
                </DialogTitle>
                <DialogDescription className="pt-3">
                  <Button onClick={nextPlayer}>Next player</Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      ) : null}

      {error ? (
        <Dialog defaultOpen>
          <DialogContent
            className="sm:max-w-[425px]"
            portalClassName="items-center"
          >
            <DialogHeader>
              <DialogTitle>Oops</DialogTitle>
              <DialogDescription>{error}</DialogDescription>
              <DialogDescription>Please refresh the page</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : null}

      <div className="p-5 grid grid-rows-2 gap-4 h-screen from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r">
        <div className="grid grid-rows-1 grid-cols-4 gap-4">
          <div className="w-full h-full rounded-[40px] overflow-hidden">
            <Image
              src={player.imageUrl}
              alt={`${player.firstName} ${player.lastName}`}
              className="object-cover object-top rounded-[40px]"
            />
          </div>
          <div className="flex justify-between flex-col items-center bg-primary-foreground/60 rounded-[40px] p-3">
            <Image src="/batting.png" alt="Batting" className="h-3/4" />
            <div className="flex flex-col justify-center items-center">
              <Heading level={5}>
                Batsman Rating: {player.batsmanRating}
              </Heading>
              <Heading level={6}>{player.handedBatsman}</Heading>
            </div>
          </div>
          <div className="flex justify-between flex-col items-center bg-primary-foreground/60 rounded-[40px] p-3">
            <Image src="/bowling.png" alt="Bowling" className="h-3/4" />
            <div className="flex flex-col justify-center items-center">
              <Heading level={5}>Bowling Rating: {player.bowlerRating}</Heading>
              <Heading level={6}>
                {player.armBowler} | {player.typeBowler}
              </Heading>
            </div>
          </div>
          <div className="flex justify-between flex-col items-center bg-primary-foreground/60 rounded-[40px] p-3">
            <Image src="/fielding.png" alt="fielding" className="h-3/4" />
            <div className="flex flex-col justify-center items-center">
              <Heading level={5}>
                Fielding Rating: {player.batsmanRating}
              </Heading>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-4 grid-cols-4 gap-4">
          <div className="bg-primary-foreground/60 rounded-[40px] p-3 flex justify-center items-center">
            <Heading level={2}>
              {player.firstName} {player.lastName}
            </Heading>
          </div>
          <div className="col-span-3 bg-primary-foreground/60 rounded-[40px] p-3 flex justify-center items-center">
            <Heading level={3}>Playing role: {player.playingRole}</Heading>
          </div>
          <div className="row-span-2 bg-primary-foreground/60 rounded-[40px] p-3 flex justify-center items-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(sellPlayer)}
                className="flex flex-col justify-center gap-2 w-full h-full"
                id="sellForm"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="$1000"
                          {...field}
                          className="bg-primary text-primary-foreground rounded-[40px] w-full ring-offset-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="bg-red">
                            <SelectTrigger className="bg-primary text-primary-foreground rounded-[40px] w-full ring-offset-primary">
                              <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-primary text-primary-foreground">
                            {teams.map((team) => (
                              <SelectItem key={team} value={team}>
                                {team}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className="col-span-3 bg-primary-foreground/60 rounded-[40px] p-3 flex justify-center items-center">
            <Heading level={3}>Email: {player.email}</Heading>
          </div>
          <div className="col-span-3 bg-primary-foreground/60 rounded-[40px] p-3 flex justify-center items-center">
            <Heading level={3}>Phone: {player.tel}</Heading>
          </div>
          <div className="col-span-4">
            <Button
              type="submit"
              form="sellForm"
              className="w-full rounded-[40px]"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sell
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
