import { findProductsBySellerId } from "@/dataRepo/products"; // Assuming products data is imported from a data repository
import { getTransactionsBySellerId } from "@/dataRepo/transactions";

export async function POST(req) {
  const { sellerId } = await req.json();

  try {
    let transactions = await getTransactionsBySellerId(sellerId);
    let products = await findProductsBySellerId(sellerId);

    if (products) {
      let metaData = [];
      transactions.map((tx) => {
        tx.metadata.map((m) => {
          metaData.push(m.product_id);
        });
      });
      let userProducts = products.filter((prod) => metaData.includes(parseInt(prod.id)));
      const responseBody = JSON.stringify(userProducts);
      return new Response(responseBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(`Product  with id ${sellerId} not found`, {
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
