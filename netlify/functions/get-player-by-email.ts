import { Handler } from "@netlify/functions";
import { GoogleSpreadsheet } from "google-spreadsheet";

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || "");

const handler: Handler = async (event) => {
  const email = event.queryStringParameters?.email;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email is required" }),
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
  await sheet.loadCells("F1:F1000");

  const registeredEmails: Array<string> = [];
  for (let i = 0; i < sheet.rowCount; i++) {
    const cell = sheet.getCellByA1(`F${i + 1}`);
    if (cell.value) {
      registeredEmails.push(cell.value.toString());
    }
  }

  if (registeredEmails.includes(email)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Player is registered" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Player not found" }),
  };
};

export { handler };
