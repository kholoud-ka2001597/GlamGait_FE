const fs = require("fs/promises");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function insertUsersFromFile(filePath) {
  try {
    await prisma.user.deleteMany()
    const userData = await fs.readFile(filePath, "utf8");
    const users = JSON.parse(userData);
    

    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          username: user.username,
          password: user.password,
          type: user.type,
          firstName: user.firstName,
          lastName: user.lastName,
          wallet: user.wallet,
        },
      });

      console.log(`User ${user.username} inserted successfully.`);
    }
  } catch (error) {
    console.error(`Error inserting users: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function insertProductsFromFile(filePath) {
  try {
    await prisma.product.deleteMany()
    // Read product data from the file
    const productData = await fs.readFile(filePath, "utf8");
    const products = JSON.parse(productData);

    // Insert each product into the database
    for (const product of products) {
      await prisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          image: product.image,
          rating: parseInt(product.rating),
          price: product.price,
          description: product.description,
          seller: {
            connect: { id: product.seller_id },
          },
          quantity: product.quantity,
          type: product.type,
          createdAt : product.createdAt
        },
      });

      console.log(`Product ${product.name} inserted successfully.`);
    }
  } catch (error) {
    console.error(`Error inserting products: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function insertTransactionsFromFile(filePath) {
  try {
    await prisma.transaction.deleteMany()
    // Read transaction data from the file
    const transactionsData = await fs.readFile(filePath, "utf8");
    const transactions = JSON.parse(transactionsData);

    for (const transaction of transactions) {
      const {
        metadata,
        sellerID,
        buyer_id,
        transaction_time,
        transaction_price,
        order_id,
      } = transaction;

      // Create the transaction record
      const newTransaction = await prisma.transaction.create({
        data: {
          id: order_id,
          metadata: { set: metadata },
          sellerIds: { set: sellerID },
          buyerId: buyer_id,
          transactionTime: new Date(transaction_time),
          transactionPrice: parseInt(transaction_price),
        },
      });

      console.log(`Transaction ${order_id} inserted successfully.`);
    }
  } catch (error) {
    console.error(`Error inserting transactions: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}


async function insertData() {
  let usersPath = "./Data/users/user.json";
  await insertUsersFromFile(usersPath);
  let productsPath = "./Data/products/products.json";
  await insertProductsFromFile(productsPath)
  let transactionPath = "./Data/transaction/transaction.json";
  await insertTransactionsFromFile(transactionPath)
}

insertData()
