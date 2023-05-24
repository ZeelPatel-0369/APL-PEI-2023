import { Handler } from "@netlify/functions";
import { Redis } from "@upstash/redis/with-fetch";
import {
  GoogleSpreadsheet,
  type GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

interface PlayerRegistration {
  team: string;
  amount: string;
  id: number;
}

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || "");
const redis = Redis.fromEnv();

export const headerValues = ["Team", "Sold for"] as const;

const handler: Handler = async (event) => {
  try {
    const { amount, team, id } = JSON.parse(
      event.body || ""
    ) as PlayerRegistration;

    if (!amount || !team || !id) {
      console.log("id", id);
      console.log("amount", amount);
      console.log("team", team);
      console.error("Error: ", "Please provide all the required fields.");

      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Please provide all the required fields.",
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

    const rows = await sheet.getRows();
    rows[id][headerValues[0]] = team;
    rows[id][headerValues[1]] = amount;

    await rows[id].save();

    if (!rows[id][headerValues[0]] || !rows[id][headerValues[1]]) {
      console.error("Error: ", `failed updating row ${id}`);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Something went wrong. Please try again.",
        }),
      };
    }

    await redis.set(id.toString(), id);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Done" }),
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
