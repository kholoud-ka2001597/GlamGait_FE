import { findProductById } from "@/dataRepo/products"; // Assuming products data is imported from a data repository
import { getTransactionsBySellerId } from "@/dataRepo/transactions";

export async function POST(req) {
  const { productID, sellerId } = await req.json();

  try {
    let product = await findProductById(productID);
    let transactions = await getTransactionsBySellerId(sellerId);
    if (product) {
      let allTx = [];
      transactions.map((tx) => {
        tx.metadata.map((m) => {
          if (m.product_id == productID) allTx.push(tx);
        });
      });
      console.log("allTx",allTx)
      const responseBody = JSON.stringify({allTx,product});
      return new Response(responseBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(`Product  with id ${productID} not found`, {
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
