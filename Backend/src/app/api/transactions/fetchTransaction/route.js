import { getTransactionsByBuyerId } from "@/dataRepo/transactions";

export async function POST(req) {
  const { buyerID } =  await req.json();
  
  try {
      let transactions = await getTransactionsByBuyerId(buyerID)
      if (transactions) {
        const responseBody = JSON.stringify(transactions);
        return new Response(responseBody, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        return new Response(`Product  with id ${buyerID} not found`, {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response("Internal server error", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
