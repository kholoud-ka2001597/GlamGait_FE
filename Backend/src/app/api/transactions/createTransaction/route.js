import { updateUserWallet } from "@/dataRepo/Users";
import { updateProductQuantity } from "@/dataRepo/products";
import { addTransaction } from "@/dataRepo/transactions";

export async function POST(req) {
  const { transactionData } =  await req.json();
  console.log(transactionData)
  
  try {
      let transaction = await addTransaction(transactionData)
       await updateUserWallet(transaction.buyerId,transaction.transactionPrice)
      const updatePromises = [];
      for (const entry of transaction.metadata) {
        const { product_id, quantity } = entry;
        const updatePromise = updateProductQuantity(product_id, quantity);
        updatePromises.push(updatePromise);
      }
    
      if (transaction) {
        await Promise.all(updatePromises);
        const responseBody = JSON.stringify(transaction);
        return new Response(responseBody, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        return new Response(`transaction not added`, {
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
