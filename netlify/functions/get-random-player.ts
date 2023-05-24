import { Handler } from "@netlify/functions";
import { Redis } from "@upstash/redis/with-fetch";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || "");
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

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
  const randomInt = getRandomInt(maxCount);
  console.log(randomInt);
  await redis.set(randomInt.toString(), randomInt);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" }),
  };
};

export { handler };

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
