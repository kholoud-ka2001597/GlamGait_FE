import { findProducts } from "@/dataRepo/products"; // Assuming products data is imported from a data repository

export async function POST(req) {
  const { productName,type } =  await req.json();
  
  try {
      let product = await findProducts(productName,type)
      if (product) {
        const responseBody = JSON.stringify(product);
        return new Response(responseBody, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        return new Response(`Products not found`, {
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
