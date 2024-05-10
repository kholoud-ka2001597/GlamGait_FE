import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addTransaction(transaction) {
  try {
    // Create a new transaction record
    const newTransaction = await prisma.transaction.create({
      data: transaction,
    });

    console.log(`Transaction added successfully: ${newTransaction.id}`);
    return newTransaction;
  } catch (error) {
    console.error(`Error adding transaction: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getTransactionsByBuyerId(buyerId) {
  try {
    // Find transactions associated with the buyer
    const transactions = await prisma.transaction.findMany({
      where: {
        buyerId: buyerId,
      },
    });

    if (!transactions || transactions.length === 0) {
      console.log(`No transactions found for buyerId: ${buyerId}`);
      return [];
    }

    console.log(`Transactions found for buyerId ${buyerId}:`, transactions);
    return transactions;
  } catch (error) {
    console.error(`Error fetching transactions: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getTransactionsBySellerId(sellerId) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        sellerIds: {
          has: sellerId,
        },
      },
      include: {
        buyer: true,
      },
    });

    if (!transactions || transactions.length === 0) {
      console.log(`No transactions found for sellerId: ${sellerId}`);
      return [];
    }

    console.log(`Transactions found for sellerId ${sellerId}:`, transactions);
    return transactions;
  } catch (error) {
    console.error(`Error fetching transactions: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getProductsSoldByQuantity() {
  try {
    const transactions = await prisma.transaction.findMany({
      select: {
        metadata: true,
      },
    });

    const productQuantities = {};

    transactions.forEach((transaction) => {
      if (transaction.metadata && Array.isArray(transaction.metadata)) {
        transaction.metadata.forEach((item) => {
          const { product_id, quantity } = item;
          if (!productQuantities[product_id]) {
            productQuantities[product_id] = 0;
          }

          productQuantities[product_id] += parseInt(quantity);
        });
      }
    });

    const result = [];
    const productIds = Object.keys(productQuantities);

    for (const productId of productIds) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { name: true },
      });

      if (product) {
        result.push({
          productName: product.name,
          quantitySold: productQuantities[productId],
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching products sold:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getTransactionsByDay() {
  try {
    const result = await prisma.$queryRaw`SELECT
    date_part('day', "transactionTime") AS day,
    Count(*) as transactionsCount
FROM
"public"."Transaction"
GROUP BY
date_part('day', "transactionTime");`;
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let transactions = {};
    daysOfWeek.forEach((dow) => {
      transactions[dow] = {
        day: dow,
        transactions: 0,
      };
    });
    console.log(result,transactions);
    result.forEach((r) => {
      let day = r.day % 7
      transactions[daysOfWeek[day]]["transactions"] = Number(
        r.transactionscount
      );
    });
    return Object.values(transactions);
  } catch (error) {
    console.error("Error fetching product counts by type:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
