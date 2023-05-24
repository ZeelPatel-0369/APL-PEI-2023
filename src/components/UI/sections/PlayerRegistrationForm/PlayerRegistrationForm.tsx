import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";

import {
  Button,
  Heading,
  Input,
  Paragraph,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Checkbox,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/UI/atoms";
import { uploadImage } from "@/lib/imagekit-upload-image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/organisms";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  address: z.string().min(1, {
    message: "Full address is required.",
  }),
  tel: z
    .string()
    .min(10, {
      message: "Phone number must be 10 characters.",
    })
    .max(10, {
      message: "Phone number must be 10 characters.",
    }),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date of birth."),
  email: z.string().email("Invalid email address."),
  healthCard: z.enum(["Yes health card", "No health card"], {
    required_error: "Please select an option.",
  }),
  playerPicture: z.string({
    required_error: "Please upload a player picture.",
  }),
  playingRole: z.string({
    required_error: "Please select a playing role.",
  }),
  tshirtSize: z.string({
    required_error: "Please select a t-shirt size.",
  }),
  batsmanRating: z
    .number({
      required_error: "Please select a batsman rating.",
    })
    .array()
    .min(0, "Batsman rating must be between 0 and 10.")
    .max(10, "Batsman rating must be between 0 and 10."),
  handedBatsman: z.enum(["Right handed", "Left handed"], {
    required_error: "Please select batting hand.",
  }),
  battingComment: z
    .string({
      required_error: "Please enter a comment.",
    })
    .min(15, "Comment must be at least 15 characters."),
  bowlerRating: z
    .number({
      required_error: "Please select a bowler rating.",
    })
    .array()
    .min(0, "Bowler rating must be between 0 and 10.")
    .max(10, "Bowler rating must be between 0 and 10."),
  armBowler: z.enum(["Right arm", "Left arm"], {
    required_error: "Please select bowling arm.",
  }),
  typeBowler: z.enum(["Fast Pace", "Medium Pace", "Spin"], {
    required_error: "Please select bowling type.",
  }),
  bowlingComment: z
    .string({
      required_error: "Please enter a comment.",
    })
    .min(15, "Comment must be at least 15 characters."),
  fielderRating: z
    .number({
      required_error: "Please select a fielder rating.",
    })
    .array()
    .min(0, "Fielder rating must be between 0 and 10.")
    .max(10, "Fielder rating must be between 0 and 10."),
  fielderComment: z
    .string({
      required_error: "Please enter a comment.",
    })
    .min(15, "Comment must be at least 15 characters."),
  terms: z.literal<boolean>(true, {
    required_error: "Please accept.",
  }),
});

export default function PlayerRegistrationForm() {
  const [playerPicture, setPlayerPicture] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const { formState } = form;

  async function handlePlayerRegistration(values: z.infer<typeof formSchema>) {
    setError("");
    setSuccess(false);

    try {
      let imageUploadError = false;
      let imageUrl = "";
      let isPlayerRegistered = false;

      // Check if player is already registered
      const playerRegisteredData = await axios.get("/api/get-player-by-email", {
        params: {
          email: values.email,
        },
      });
      if (
        playerRegisteredData.status === 200 &&
        !(playerRegisteredData.data.message === "Player not found")
      ) {
        isPlayerRegistered = true;
        setError("You're already registered");

        form.setError(
          "email",
          {
            type: "custom",
            message: "This email is already registered.",
          },
          { shouldFocus: true }
        );
      }

      if (playerPicture && !isPlayerRegistered) {
        const res = await uploadImage({
          file: playerPicture,
          fileName: values.email,
        });
        if (!res.success) {
          imageUploadError = true;
          setError("Picture upload failed. Please try again.");
          form.setError(
            "playerPicture",
            {
              type: "custom",
              message: "Picture upload failed. Please try again.",
            },
            { shouldFocus: true }
          );
        } else {
          imageUrl = res.url;
        }
      }

      if (!imageUploadError && !isPlayerRegistered) {
        setError("");

        const postData = await axios.post("/api/player-registration", {
          ...values,
          type: "Player",
          imageUrl,
        });
        if (postData.status !== 200) {
          setError(
            postData.data.message || "Something went wrong. Please try again."
          );
        } else {
          setError("");
          setSuccess(true);
        }
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
      setSuccess(false);
    }
  }

  if (success) {
    return (
      <div className="mt-5">
        <Paragraph className="text-success" size="lg">
          Your registration is <b>NOT</b> yet confirmed. Please send <b>$50</b>{" "}
          to <b>atmiyapei@gmail.com</b> to complete your registration.
        </Paragraph>
      </div>
    );
  }

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
      <div className="mt-5">
        <Paragraph size="lg" className="mb-5">
          APL Auction is on <b>Saturday, June 17</b> and will be played on{" "}
          <b>Saturday, July 1</b> and <b>Sunday, July 2</b>. Please make sure
          you're available on those dates before registering.
        </Paragraph>
      </div>
      <Form {...form}>
        <form
          className="mt-5"
          onSubmit={form.handleSubmit(handlePlayerRegistration)}
        >
          <div>
            <Paragraph className="text-destructive">
              * All fields are required
            </Paragraph>
          </div>
          <div className="flex flex-col gap-5 md:grid-cols-2 md:grid md:gap-3 mt-3">
            <div className="flex flex-col gap-5">
              {/* Personal info */}
              <div className="flex flex-col gap-3">
                <div className="grid-cols-2 grid gap-3">
                  <div>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>First Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              autoComplete="given-name"
                              placeholder="John"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              autoComplete="family-name"
                              placeholder="Doe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid-cols-2 grid gap-3">
                  <div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Full address</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              autoComplete="address-level4"
                              placeholder="123 Main St, City, Province, Postal Code"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="tel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Mobile Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              autoComplete="tel"
                              placeholder="123-456-7890"
                              pattern="[0-9]{10}"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Accepted format is 1234567890
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid-cols-2 grid gap-3">
                  <div>
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              max={new Date().toISOString().split("T")[0]}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="test@test.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              {/* Health card */}
              <div>
                <FormField
                  control={form.control}
                  name="healthCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Do you have health card?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Yes health card" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Yes, I do have health card
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="No health card" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              No, I don't have health card
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Player Picture */}
              <div>
                <FormField
                  control={form.control}
                  name="playerPicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          {...field}
                          onChange={(e) => {
                            const file = e.currentTarget.files?.[0];
                            if (file) {
                              setPlayerPicture(file);
                            }
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Photo should be portrait and face should be visible
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Playing role */}
              <div>
                <FormField
                  control={form.control}
                  name="playingRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Playing Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select playing role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Batsman">Batsman</SelectItem>
                          <SelectItem value="Bowler">Bowler</SelectItem>
                          <SelectItem value="All Rounder">
                            All Rounder
                          </SelectItem>
                          <SelectItem value="Wicket Keeper">
                            Wicket Keeper
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* T-shirt sizes */}
              <div>
                <FormField
                  control={form.control}
                  name="tshirtSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>T-shirt size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select t-shirt size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {/* Batsman */}
              <Heading level={4}>Batting</Heading>
              <div>
                <FormField
                  control={form.control}
                  name="batsmanRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Rate yourself as a batsman</FormLabel>
                      <FormControl>
                        <Slider
                          className="mt-2"
                          min={0}
                          max={10}
                          step={1}
                          label="Rating"
                          onValueChange={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="handedBatsman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Which handed?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Right handed" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Right handed
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Left handed" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Left handed
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="battingComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Batting comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Batting comment"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Bowler */}
              <Heading level={4}>Bowling</Heading>
              <div>
                <FormField
                  control={form.control}
                  name="bowlerRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Rate yourself as a bowler</FormLabel>
                      <FormControl>
                        <Slider
                          className="mt-2"
                          min={0}
                          max={10}
                          step={1}
                          label="Rating"
                          onValueChange={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="armBowler"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Which arm?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Right arm" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Right arm
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Left arm" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Left arm
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="typeBowler"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>What type?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Fast Pace" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Fast Pace
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Medium Pace" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Medium Pace
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Spin" />
                            </FormControl>
                            <FormLabel className="font-normal">Spin</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="bowlingComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Bowling comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bowling comment"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Fielder */}
              <Heading level={4}>Fielding</Heading>
              <div>
                <FormField
                  control={form.control}
                  name="fielderRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Rate yourself as a fielder</FormLabel>
                      <FormControl>
                        <Slider
                          className="mt-2"
                          min={0}
                          max={10}
                          step={1}
                          label="Rating"
                          onValueChange={field.onChange}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="fielderComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Fielder comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Fielder comment"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 justify-center items-center mt-5">
            <div>
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I understand that I'll have to send $50 to
                        atmiyapei@gmail.com to confirm my registration for APL
                        2023
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Register
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
