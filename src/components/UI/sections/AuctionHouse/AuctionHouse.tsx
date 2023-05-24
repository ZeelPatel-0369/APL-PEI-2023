import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Loader2Icon } from "lucide-react";

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
  Paragraph,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/atoms";
import { FormInput } from "@/components/UI/molecules";
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

interface Player {
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
}

export default function AuctionHouse() {
  const [error, setError] = useState("");

  const {
    data: player,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["player"],
    queryFn: async () => {
      const res = await axios.get("/api/get-random-player");
      return res.data.player as Player;
    },
    retry: 10,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  console.log(isRefetching);
  console.log(isLoading);

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

  if (isError || !player) {
    return <div>Error...</div>;
  }

  const sellPlayer = async (values: z.infer<typeof formSchema>) => {
    const data = await axios.post("/api/sell-player", {
      ...values,
      id: player.id,
    });
    if (data.status === 200) {
      form.reset();
      refetch();
    } else {
      setError(data.data.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {error ? (
        <Dialog defaultOpen>
          <DialogContent
            className="sm:max-w-[425px]"
            portalClassName="items-center"
          >
            <DialogHeader>
              <DialogTitle>Oops</DialogTitle>
              <DialogDescription>{error}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : null}
      <div className="p-5 grid grid-rows-2 gap-4 h-screen from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r">
        <div className="flex gap-4">
          <Image
            src={player.imageUrl}
            alt={`${player.firstName} ${player.lastName}`}
            className="object-cover rounded-lg object-top shadow-lg w-1/4"
          />
          <div className="rounded-lg shadow-lg w-3/4 p-5 flex flex-col gap-3 justify-between bg-primary-foreground/60 backdrop-blur-sm">
            <div className="flex flex-col gap-3">
              <Heading level={2}>
                {player.firstName} {player.lastName}
              </Heading>
              <div className="max-w-xs">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(sellPlayer)}
                    className="flex flex-col gap-2"
                  >
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="$"
                              className="bg-primary-foreground"
                              {...field}
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
                                <SelectTrigger className="bg-primary-foreground">
                                  <SelectValue placeholder="Select a team" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Team 1">Team 1</SelectItem>
                                <SelectItem value="Team 2">Team 2</SelectItem>
                                <SelectItem value="Team 3">Team 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={formState.isSubmitting}>
                      {formState.isSubmitting ? (
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Sell
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Heading level={5}>
                {player.email} - {player.tel}
              </Heading>
              <Heading level={5}>{player.playingRole}</Heading>
              <Heading level={5}>{player.handedBatsman}</Heading>
              <Heading level={5}>
                {player.armBowler} - {player.typeBowler}
              </Heading>
            </div>
          </div>
        </div>
        <div className="rounded-lg shadow-lg p-5 bg-primary-foreground/60 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <div className="flex gap-1 items-center">
              <Paragraph>Batsman Rating: </Paragraph>
              <Heading level={6}>{player.batsmanRating}</Heading>
            </div>
            <div>
              <FormInput
                labelProps={{ children: "Batting comment" }}
                inputType="textarea"
                id="battingComment"
                name="battingComment"
                value={player.battingComment}
                rows={1}
                className="disabled:opacity-100 border-primary-foreground/60"
                disabled
              />
            </div>

            <div className="flex gap-1 items-center">
              <Paragraph>Bowler Rating: </Paragraph>
              <Heading level={6}>{player.bowlerRating}</Heading>
            </div>
            <div>
              <FormInput
                labelProps={{ children: "Bowling comment" }}
                inputType="textarea"
                id="bowlingComment"
                name="bowlingComment"
                placeholder="Bowling comment"
                value={player.bowlingComment}
                rows={1}
                className="disabled:opacity-100 border-primary-foreground/60"
                disabled
              />
            </div>

            <div className="flex gap-1 items-center">
              <Paragraph>Fielder Rating: </Paragraph>
              <Heading level={6}>{player.fielderRating}</Heading>
            </div>
            <div>
              <FormInput
                labelProps={{ children: "Fielder comment" }}
                inputType="textarea"
                id="fielderComment"
                name="fielderComment"
                value={player.fielderComment}
                rows={1}
                className="disabled:opacity-100 border-primary-foreground/60"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
