import { addProduct } from "@/dataRepo/products";
import { uploadImage } from "../../../../../utils/uploadImage";

export async function POST(req) {
  try {
    let data = await req.formData();
    let image = await uploadImage(data.get("image"));

    const productData = {
      name: data.get("name"),
      sellerId: data.get("sellerId"),
      quantity: parseInt(data.get("quantity")),
      description: data.get("description"),
      price: data.get("price"),
      image: image,
      rating: 5,
      type: data.get("type"),
    };

    let result = await addProduct(productData);

    if (result) {
      const responseBody = JSON.stringify(result);
      return new Response(responseBody, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(`Product not added`, {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error processing product data:", error);
    return new Response("Internal server error", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
