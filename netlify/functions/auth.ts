import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  const body = JSON.parse(event.body || "") as {
    username: string;
    password: string;
  };
  if (!body || !body.username || !body.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No username or password provided" }),
    };
  }

  const { username, password } = body;

  if (
    username === process.env.AUCTION_USERNAME &&
    password === process.env.AUCTION_PASSWORD
  ) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" }),
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify({ message: "username and password doesn't match" }),
  };
};

export { handler };
