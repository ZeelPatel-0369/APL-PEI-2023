import { useState } from "react";
import axios from "axios";
import { Button, Heading, Paragraph } from "@/components/UI/atoms";
import { FormInput } from "@/components/UI/molecules";
import { type RadioOptions } from "@/components/UI/molecules/FormInput";
import { uploadImage } from "@/lib/imagekit-upload-image";
import { Loader2Icon } from "lucide-react";
import { CheckboxProps } from "@/components/UI/atoms/Checkbox";

const healthCardOptions = [
  {
    label: "Yes, I do have health card",
    value: "Yes health card",
    id: "healthCard",
  },
  {
    label: "No, I don't have health card",
    value: "No health card",
    id: "noHealthCard",
  },
] satisfies Array<RadioOptions>;

export default function Form() {
  const [playerPicture, setPlayerPicture] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isConsentChecked, setIsConsentChecked] =
    useState<CheckboxProps["checked"]>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      let imageUploadError = false;
      let imageUrl = "";
      let isPlayerRegistered = false;

      // Check if player is already registered
      const playerEmail = formData.get("email") as string;
      const playerRegisteredData = await axios.get(
        "/.netlify/functions/get-player-by-email",
        {
          params: {
            email: playerEmail,
          },
        }
      );
      if (
        playerRegisteredData.status === 200 &&
        !(playerRegisteredData.data.message === "Player not found")
      ) {
        isPlayerRegistered = true;
        setError("You're already registered");
      }

      if (playerPicture && !isPlayerRegistered) {
        const res = await uploadImage({
          file: playerPicture,
          fileName: formData.get("email") as string,
        });
        if (!res.success) {
          imageUploadError = true;
          setError("Picture upload failed");
        } else {
          imageUrl = res.url;
        }
      }

      if (!imageUploadError && !isPlayerRegistered) {
        formData.delete("player-picture");
        const data = Object.fromEntries(formData);
        setError("");

        const postData = await axios.post(
          "/.netlify/functions/player-registration",
          { ...data, imageUrl }
        );
        if (postData.status !== 200) {
          setError(postData.data.message || "Something went wrong");
        } else {
          setError("");
          setSuccess(true);
        }
      }
    } catch (error) {
      setError("Picture upload failed");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  const isSubmitDisabled = !isConsentChecked || isLoading;

  return (
    <>
      {success ? (
        <div className="mt-5">
          <Paragraph className="text-success" size="lg">
            Your registration is <b>NOT</b> yet confirmed. Please send{" "}
            <b>$50</b> to <b>atmiyapei@gmail.com</b> to complete your
            registration.
          </Paragraph>
        </div>
      ) : (
        <>
          <div className="mt-5">
            <Paragraph size="lg" className="mb-5">
              APL Auction is on <b>Saturday, June 17</b> and will be played on{" "}
              <b>Saturday, July 1</b> and <b>Sunday, July 2</b>. Please make
              sure you're available on those dates before registering.
            </Paragraph>
            {error ? <Error error={error} /> : null}
          </div>
          <form className="mt-5" onSubmit={handleSubmit}>
            <div>
              <Paragraph className="text-destructive">
                * All fields are required
              </Paragraph>
            </div>
            <div className="flex flex-col gap-5 md:grid-cols-2 md:grid md:gap-3 mt-3">
              <div className="flex flex-col gap-5">
                <div className="hidden">
                  <FormInput
                    labelProps={{ children: "Type" }}
                    inputType="input"
                    type="hidden"
                    id="type"
                    name="type"
                    value="Player"
                    required
                  />
                </div>
                {/* Personal info */}
                <div className="flex flex-col gap-3">
                  <div className="grid-cols-2 grid gap-3">
                    <div>
                      <FormInput
                        labelProps={{ children: "First Name" }}
                        inputType="input"
                        type="text"
                        id="firstName"
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <FormInput
                        labelProps={{ children: "Last Name" }}
                        inputType="input"
                        type="text"
                        id="lastName"
                        name="lastName"
                        autoComplete="family-name"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid-cols-2 grid gap-3">
                    <div>
                      <FormInput
                        labelProps={{ children: "Full Address" }}
                        inputType="input"
                        type="text"
                        id="address"
                        name="address"
                        autoComplete="address-level4"
                        placeholder="123 Main St, City, Province, Postal Code"
                        required
                      />
                    </div>
                    <div>
                      <FormInput
                        labelProps={{ children: "Mobile Number" }}
                        inputType="input"
                        type="tel"
                        id="tel"
                        name="tel"
                        autoComplete="tel"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        placeholder="123-456-7890"
                        required
                      />
                      <Paragraph variant="muted" size="sm">
                        accepted format is 123-456-7890
                      </Paragraph>
                    </div>
                  </div>
                  <div className="grid-cols-2 grid gap-3">
                    <div>
                      <FormInput
                        labelProps={{ children: "Date of Birth" }}
                        inputType="input"
                        type="date"
                        id="dob"
                        name="dob"
                        max={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div>
                      <FormInput
                        labelProps={{ children: "Email" }}
                        inputType="input"
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        placeholder="test@test.com"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* Health card */}
                <div>
                  <FormInput
                    labelProps={{ children: "Health Card" }}
                    inputType="radio"
                    className="flex"
                    radioOptions={healthCardOptions}
                    name="healthCard"
                    required
                  />
                </div>
                {/* Player Picture */}
                <div>
                  <FormInput
                    labelProps={{ children: "Picture" }}
                    inputType="input"
                    type="file"
                    id="playerPicture"
                    name="playerPicture"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file) {
                        setPlayerPicture(file);
                      }
                    }}
                    required
                  />
                  <Paragraph variant="muted" size="sm">
                    Please upload your photo as playing cricket
                  </Paragraph>
                </div>
                {/* Playing role */}
                <div>
                  <FormInput
                    labelProps={{ children: "Playing Role" }}
                    inputType="select"
                    id="playingRole"
                    name="playingRole"
                    selectOptions={[
                      "Batsman",
                      "Bowler",
                      "All Rounder",
                      "Wicket Keeper",
                    ]}
                    selectLabel="Select Playing Role"
                    selectValue="Batsman"
                    required
                  />
                </div>
                {/* T-shirt sizes */}
                <div>
                  <FormInput
                    labelProps={{ children: "T-shirt sizes" }}
                    inputType="select"
                    id="tshirtSize"
                    name="tshirtSize"
                    selectOptions={["S", "M", "L", "XL"]}
                    selectLabel="Select Playing Role"
                    selectValue="S"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {/* Batsman */}
                <Heading level={4}>Batting</Heading>
                <div>
                  <FormInput
                    labelProps={{ children: "Rate yourself as a batsman" }}
                    inputType="slider"
                    id="batsmanRating"
                    name="batsmanRating"
                    min={0}
                    max={10}
                    step={1}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    labelProps={{ children: "Which handed?" }}
                    inputType="radio"
                    className="flex"
                    radioOptions={[
                      {
                        label: "Right handed",
                        value: "Right handed",
                        id: "rightHanded",
                      },
                      {
                        label: "Left handed",
                        value: "Left handed",
                        id: "leftHanded",
                      },
                    ]}
                    name="handedBatsman"
                    required
                  />
                </div>
                <div>
                  <FormInput
                    labelProps={{ children: "Batting comment" }}
                    inputType="textarea"
                    id="battingComment"
                    name="battingComment"
                    placeholder="Batting comment"
                    required
                  />
                </div>
                {/* Bowler */}
                <Heading level={4}>Bowling</Heading>
                <div>
                  <FormInput
                    labelProps={{ children: "Rate yourself as a bowler" }}
                    inputType="slider"
                    id="bowlerRating"
                    name="bowlerRating"
                    min={0}
                    max={10}
                    step={1}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    labelProps={{ children: "Which arm?" }}
                    inputType="radio"
                    className="flex"
                    radioOptions={[
                      {
                        label: "Right arm",
                        value: "Right arm",
                        id: "rightArm",
                      },
                      {
                        label: "Left arm",
                        value: "Left arm",
                        id: "leftArm",
                      },
                    ]}
                    name="armBowler"
                    required
                  />
                </div>
                <div>
                  <FormInput
                    labelProps={{ children: "What type?" }}
                    inputType="radio"
                    className="flex"
                    radioOptions={[
                      {
                        label: "Spin",
                        value: "Spin",
                        id: "spin",
                      },
                      {
                        label: "Medium Pace",
                        value: "Medium Pace",
                        id: "mediumPace",
                      },
                      {
                        label: "Fast Pace",
                        value: "Fast Pace",
                        id: "fastPace",
                      },
                    ]}
                    name="typeBowler"
                    required
                  />
                </div>
                <div>
                  <FormInput
                    labelProps={{ children: "Bowling comment" }}
                    inputType="textarea"
                    id="bowlingComment"
                    name="bowlingComment"
                    placeholder="Bowling comment"
                    required
                  />
                </div>
                {/* Fielder */}
                <Heading level={4}>Fielding</Heading>
                <div>
                  <FormInput
                    labelProps={{ children: "Rate yourself as a fielder" }}
                    inputType="slider"
                    id="fielderRating"
                    name="fielderRating"
                    min={0}
                    max={10}
                    step={1}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    labelProps={{ children: "Fielder comment" }}
                    inputType="textarea"
                    id="fielderComment"
                    name="fielderComment"
                    placeholder="Fielder comment"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 justify-center items-center mt-5">
              <div className="flex items-center">
                <FormInput
                  inputType="checkbox"
                  id="terms"
                  name="terms"
                  required
                  labelProps={{
                    children:
                      "I understand that I'll have to send $50 to atmiyapei@gmail.com to confirm my registration for APL 2023",
                  }}
                  onCheckedChange={(checked) => setIsConsentChecked(checked)}
                  checked={isConsentChecked}
                />
              </div>
              <Button type="submit" disabled={isSubmitDisabled}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Register
              </Button>
            </div>
          </form>
          {error ? <Error error={error} /> : null}
        </>
      )}
    </>
  );
}

function Error({ error }: { error: string }) {
  return (
    <div className="mt-5">
      <Paragraph className="text-destructive font-bold" size="lg">
        ERROR
      </Paragraph>
      <Paragraph className="text-destructive" size="lg">
        {error}
      </Paragraph>
    </div>
  );
}
