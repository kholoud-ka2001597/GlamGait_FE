import { getTotalUserCount, getUserCountByType } from "@/dataRepo/Users";
import { getProductCountBySeller, getProductTypeCountsByMonth, getTotalProducts } from "@/dataRepo/products";
import { getProductsSoldByQuantity, getTransactionsByDay } from "@/dataRepo/transactions";

export async function POST(req) {
  try {
    const [userCount, buyerCount, sellerCount, productsCount, productBySeller,productCountByMonth,productsSoldByQuantity,transactionPerDay] = await Promise.all([
        getTotalUserCount(),
        getUserCountByType("buyer"),
        getUserCountByType("seller"),
        getTotalProducts(),
        getProductCountBySeller(),
        getProductTypeCountsByMonth(),
        getProductsSoldByQuantity(),
        getTransactionsByDay()
      ]);
      console.log(productCountByMonth)
    let body = {
      dashboardData: {
        userCount,
        buyerCount,
        sellerCount,
        productsCount,
        productBySeller,
        productCountByMonth,
        productsSoldByQuantity,
        transactionPerDay
      },
    };
    const responseBody = JSON.stringify(body);
    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
