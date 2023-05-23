import { Heading, Image, Paragraph } from "@/components/UI/atoms";
import { FormInput } from "@/components/UI/molecules";

export default function AuctionHouse() {
  return (
    <div className="p-5 grid grid-rows-2 gap-4 h-screen from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r">
      <div className="flex gap-4">
        <Image
          src="https://ik.imagekit.io/kcnylgdo8c/apl-pei-23/arpitdalal21_gmail.com"
          alt="placeholder"
          className="object-cover rounded-lg object-center shadow-lg w-1/4"
        />
        <div className="rounded-lg shadow-lg w-3/4 p-5 flex flex-col gap-3 justify-between bg-primary-foreground/60 backdrop-blur-sm">
          <div>
            <Heading level={2}>Arpit Dalal</Heading>
          </div>
          <div className="flex flex-col gap-3">
            <Heading level={5}>arpitdalalm@gmail.com - 226-504-3991</Heading>
            {/* <Heading level={5}>
              Batsman/Bowler/All Rounder/Wicket Keeper
            </Heading> */}
            {/* <Heading level={5}>Right handed/Left handed Batsman</Heading> */}
            {/* <Heading level={5}>
              Right arm/Left arm Bowler - Spin/Medium Pace/Fast Pace Bowler
            </Heading> */}
            <Heading level={5}>Wicket Keeper</Heading>
            <Heading level={5}>Right handed Batsman</Heading>
            <Heading level={5}>Right arm Bowler - Spin Bowler</Heading>
          </div>
        </div>
      </div>
      <div className="rounded-lg shadow-lg p-5 bg-primary-foreground/60 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex gap-1 items-center">
            {/* <FormInput
              inputType="slider"
              labelProps={{ children: "Batsman Rating" }}
              id="batsman-rating"
              name="batsman-rating"
              min={0}
              max={10}
              step={1}
              value={[5]}
              label="Batsman Rating"
              disabled
            /> */}
            <Paragraph>Batsman Rating: </Paragraph>
            <Heading level={6}>5</Heading>
          </div>
          <div>
            <FormInput
              labelProps={{ children: "Batting comment" }}
              inputType="textarea"
              id="battingComment"
              name="battingComment"
              value="asd"
              rows={2}
              className="disabled:opacity-100 border-primary-foreground/60"
              disabled
            />
          </div>

          <div className="flex gap-1 items-center">
            {/* <FormInput
              labelProps={{ children: "Bowler Rating" }}
              inputType="slider"
              id="bowlerRating"
              name="bowlerRating"
              min={0}
              max={10}
              step={1}
              label="Bowler Rating"
              value={[5]}
              disabled
            /> */}
            <Paragraph>Bowler Rating: </Paragraph>
            <Heading level={6}>5</Heading>
          </div>
          <div>
            <FormInput
              labelProps={{ children: "Bowling comment" }}
              inputType="textarea"
              id="bowlingComment"
              name="bowlingComment"
              placeholder="Bowling comment"
              value="asdad"
              rows={2}
              className="disabled:opacity-100 border-primary-foreground/60"
              disabled
            />
          </div>

          <div className="flex gap-1 items-center">
            {/* <FormInput
              labelProps={{ children: "Fielder Rating" }}
              inputType="slider"
              id="fielderRating"
              name="fielderRating"
              min={0}
              max={10}
              step={1}
              value={[5]}
              label="Fielder Rating"
              disabled
            /> */}
            <Paragraph>Fielder Rating: </Paragraph>
            <Heading level={6}>5</Heading>
          </div>
          <div>
            <FormInput
              labelProps={{ children: "Fielder comment" }}
              inputType="textarea"
              id="fielderComment"
              name="fielderComment"
              value="asdasd"
              rows={2}
              className="disabled:opacity-100 border-primary-foreground/60"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}
