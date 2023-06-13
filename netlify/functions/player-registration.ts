import { Handler } from "@netlify/functions";
import { sendEmail } from "@netlify/emails";
import {
  GoogleSpreadsheet,
  type GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

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
  batsmanRating: Array<number>;
  handedBatsman: string;
  battingComment: string;
  bowlerRating: Array<number>;
  armBowler: string;
  typeBowler: string;
  bowlingComment: string;
  fielderRating: Array<number>;
  fielderComment: string;
  terms: boolean;
  imageUrl: string;
}

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || "");

export const headerValues = [
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
  "Team",
  "Sold for",
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

    if (!terms) {
      console.error("You must accept the terms.");
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "You must accept the terms.",
        }),
      };
    }

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      private_key: process.env.GOOGLE_PRIVATE_KEY || "",
    });

    await doc.loadInfo();

    let sheet: GoogleSpreadsheetWorksheet;
    const date = new Date();
    const year = date.getFullYear();

    if (process.env.MY_ENV !== "production") {
      sheet = doc.sheetsByTitle["dev"];
    } else {
      sheet = doc.sheetsByTitle[year];
    }

    const newRow = await sheet.addRow({
      [headerValues[0]]: type,
      [headerValues[1]]: firstName,
      [headerValues[2]]: lastName,
      [headerValues[3]]: address,
      [headerValues[4]]: tel,
      [headerValues[5]]: email,
      [headerValues[6]]: playingRole,
      [headerValues[7]]: batsmanRating[0],
      [headerValues[8]]: handedBatsman,
      [headerValues[9]]: battingComment,
      [headerValues[10]]: bowlerRating[0],
      [headerValues[11]]: armBowler,
      [headerValues[12]]: typeBowler,
      [headerValues[13]]: bowlingComment,
      [headerValues[14]]: fielderRating[0],
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
        body: JSON.stringify({
          message: "Something went wrong. Please try again.",
        }),
      };
    }

    // send email
    await sendEmail({
      from: "atmiyapei@gmail.com",
      to: email,
      subject: "APL 2023 player registration",
      template: "player-registered",
      parameters: {
        year: year,
        name: `${firstName} ${lastName}`,
        fee: "50",
        feeEmail: "atmiyapei@gmail.com",
        auctionDate: "17th June 2023",
        playDate: "1st and 2nd July 2023",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Registration successful" }),
    };
  } catch (error) {
    console.error("Catch Error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong. Please try again.",
      }),
    };
  }
};

export { handler };
