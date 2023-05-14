import { Handler } from "@netlify/functions";
import { GoogleSpreadsheet } from "google-spreadsheet";

interface PlayerRegistration {
  type: string;
  firstName: string;
  lastName: string;
  address: string;
  tel: string;
  dob: string;
  email: string;
  healthCard: string;
  playingRole: string;
  tshirtSize: string;
  batsmanRating: string;
  handedBatsman: string;
  battingComment: string;
  bowlerRating: string;
  armBowler: string;
  typeBowler: string;
  bowlingComment: string;
  fielderRating: string;
  fielderComment: string;
  terms: "on" | undefined;
  imageUrl: string;
}

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || "");

const headerValues = [
  "Type",
  "First name",
  "Last name",
  "Address",
  "Phone number",
  "Email",
  "Playing role",
  "Batsman rating",
  "Which handed batsman?",
  "Batting comment",
  "Bowling rating",
  "Which arm bowler?",
  "Type of bowler",
  "Bowling comment",
  "Fielding rating",
  "Fielding comment",
  "Date of birth",
  "Health card",
  "T-shirt size",
  "Image Url",
] as const;

const handler: Handler = async (event) => {
  try {
    const {
      type,
      firstName,
      lastName,
      address,
      tel,
      dob,
      email,
      healthCard,
      playingRole,
      tshirtSize,
      batsmanRating,
      handedBatsman,
      battingComment,
      bowlerRating,
      armBowler,
      typeBowler,
      bowlingComment,
      fielderRating,
      fielderComment,
      terms,
      imageUrl,
    } = JSON.parse(event.body || "") as PlayerRegistration;
    if (terms !== "on") {
      console.log("Error: ", "You must accept the terms and conditions");
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "You must accept the terms and conditions",
        }),
      };
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      private_key: process.env.GOOGLE_PRIVATE_KEY || "",
    });

    await doc.loadInfo();

    const date = new Date();
    const year = date.getFullYear();
    const sheet = doc.sheetsByTitle[year];

    const newRow = await sheet.addRow({
      [headerValues[0]]: type,
      [headerValues[1]]: firstName,
      [headerValues[2]]: lastName,
      [headerValues[3]]: address,
      [headerValues[4]]: tel,
      [headerValues[5]]: email,
      [headerValues[6]]: playingRole,
      [headerValues[7]]: batsmanRating,
      [headerValues[8]]: handedBatsman,
      [headerValues[9]]: battingComment,
      [headerValues[10]]: bowlerRating,
      [headerValues[11]]: armBowler,
      [headerValues[12]]: typeBowler,
      [headerValues[13]]: bowlingComment,
      [headerValues[14]]: fielderRating,
      [headerValues[15]]: fielderComment,
      [headerValues[16]]: dob,
      [headerValues[17]]: healthCard,
      [headerValues[18]]: tshirtSize,
      [headerValues[19]]: imageUrl,
    });

    if (!newRow) {
      console.error("Error: ", "failed at adding new row");
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Something went wrong" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Registration successful" }),
    };
  } catch (error) {
    console.error("Catch Error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong" }),
    };
  }
};

export { handler };
