import { Handler } from "@netlify/functions";
import { Redis } from "@upstash/redis/with-fetch";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

import { headerValues } from "./player-registration";

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || "");
const redis = Redis.fromEnv();

const handler: Handler = async () => {
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

  const maxCount = sheet.rowCount;
  const existingIntsInRedis = await redis.keys("*");
  const randomInt = getRandomInt(
    maxCount,
    existingIntsInRedis.map((i) => parseInt(i))
  );
  if (randomInt === -1) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "No more players to show.",
      }),
    };
  }

  const rows = await sheet.getRows();
  const randomRow = rows[randomInt];

  const player = {
    id: randomInt,
    firstName: randomRow[headerValues[1]],
    lastName: randomRow[headerValues[2]],
    tel: randomRow[headerValues[4]],
    email: randomRow[headerValues[5]],
    playingRole: randomRow[headerValues[6]],
    batsmanRating: randomRow[headerValues[7]],
    handedBatsman: randomRow[headerValues[8]],
    battingComment: randomRow[headerValues[9]],
    bowlerRating: randomRow[headerValues[10]],
    armBowler: randomRow[headerValues[11]],
    typeBowler: randomRow[headerValues[12]],
    bowlingComment: randomRow[headerValues[13]],
    fielderRating: randomRow[headerValues[14]],
    fielderComment: randomRow[headerValues[15]],
    imageUrl: randomRow[headerValues[19]],
  };

  return {
    statusCode: 200,
    body: JSON.stringify({ player }),
  };
};

export { handler };

// function to generate random number between 0 and max excluding the numbers in the array
// return -1 if no number can be generated
function getRandomInt(max: number, exclude: number[]): number {
  const randomInt = Math.floor(Math.random() * Math.floor(max));
  if (exclude.includes(randomInt)) {
    if (exclude.length === max) {
      return -1;
    }
    return getRandomInt(max, exclude);
  }
  return randomInt;
}
