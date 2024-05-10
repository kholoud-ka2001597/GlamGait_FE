import { authenticateUser } from "@/dataRepo/Users";

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return new Response("Username and password are required", {
      status: 400,
    });
  }

  try {
    const user = await authenticateUser(username, password);
    if (user) {
      const responseBody = JSON.stringify(user);
      return new Response(responseBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response("Invalid username or password", {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response("Internal server error", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
