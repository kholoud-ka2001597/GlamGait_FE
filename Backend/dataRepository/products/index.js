import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findProducts(productName,type) {
  try {
    let query = {
      where: {
        quantity :{
          gt : 0
        }
      }
    };
    if(type){
      query  = {
        where: {
          quantity :{
            gt : 0
          },
          type : type
        }
      }
    }
    if (productName) {
      query = {
        where: {
          name: {
            contains: productName,
            mode: "insensitive", // Case-insensitive search
          },
          quantity : {
            gt : 0
          }
        },
      };
    }
    const product = await prisma.product.findMany(query);

    if (product) {
      console.log(`Product '${productName}' found.`);
      return product;
    } else {
      console.log(`Product '${productName}' not found.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching product: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function findProductById(productId) {
  try {
    if (!productId) {
      console.error("Product ID is required.");
      return null;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product) {
      console.log(`Product with ID '${productId}' found.`);
      return product;
    } else {
      console.log(`Product with ID '${productId}' not found.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching product: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function findProductsBySellerId(sellerId) {
  try {
    if (!sellerId) {
      console.error("Seller ID is required.");
      return null;
    }

    const products = await prisma.product.findMany({
      where: {
        sellerId: sellerId,
      },
    });

    if (products && products.length > 0) {
      console.log(`Products found for seller ID '${sellerId}'.`);
      return products;
    } else {
      console.log(`No products found for seller ID '${sellerId}'.`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching products: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function updateProductQuantity(productId, quantityToSubtract) {
  try {
    // Find the product by ID
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      console.log(`Product with ID ${productId} not found.`);
      return null;
    }

    const currentQuantity = product.quantity;
    const newQuantity = currentQuantity -  parseInt(quantityToSubtract);

    if (newQuantity < 0) {
      console.log(`Insufficient quantity for product '${product.name}'.`);
      return null;
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        quantity: newQuantity,
      },
    });

    console.log(`Product quantity updated successfully for '${updatedProduct.name}'.`);
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product quantity: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function addProduct(product) {
  try {
    const newProduct = await prisma.product.create({
      data: product,
    });

    console.log(`Product added successfully: ${newProduct.id}`);
    return newProduct;
  } catch (error) {
    console.error(`Error adding Product: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getTotalProducts() {
  try {
    const totalCount = await prisma.product.count();

    console.log(`Total number of products: ${totalCount}`);
    return totalCount;
  } catch (error) {
    console.error(`Error fetching total products count: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getProductCountBySeller() {
  try {
    const productCounts = await prisma.product.groupBy({
      by: ["sellerId", "type"],
      _count: {
        id: true,
      },
    });

    console.log("Product counts by type with seller info:", productCounts);

    const countsBySeller = {};

    productCounts.forEach(({ sellerId, type, _count }) => {
      const { id } = _count;
      if (!countsBySeller[sellerId]) {
        countsBySeller[sellerId] = { sellerId };
        countsBySeller[sellerId]["men"] = 0;
        countsBySeller[sellerId]["woman"] = 0;
      }
      countsBySeller[sellerId][type] = id;
    });

    const productCountsBySeller = await Promise.all(
      Object.values(countsBySeller).map(async (sellerData) => {
        const { sellerId } = sellerData;
        const seller = await prisma.user.findUnique({
          where: { id: sellerId },
          select: { firstName: true, lastName: true },
        });
        const sellerName = `${seller.firstName} ${seller.lastName}`;
        delete sellerData.sellerId;
        return { sellerName, ...sellerData };
      })
    );

    console.log("Product counts by seller with types:", productCountsBySeller);
    return productCountsBySeller;
  } catch (error) {
    console.error("Error fetching product counts by type:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getProductTypeCountsByMonth() {
  try {
    const result = await prisma.$queryRaw`SELECT
    type,
    date_part('month', "createdAt") AS month,
    SUM("quantity"::bigint) AS total_quantity
FROM
"public"."Product"
GROUP BY
    date_part('month', "createdAt"),
    type
ORDER BY
    type,
    month;`;

    console.log("Product counts by type with creation month:", result);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const transformedData = {};
    result.map((r) => {
      const { type, month, total_quantity } = r;
      let monthName = months[month - 1];
      if (!transformedData[monthName]) {
        transformedData[monthName] = { month: monthName, men: 0, woman: 0 };
      }
      if (type === "men") {
        transformedData[monthName].men += parseInt(total_quantity);
      } else if (type === "woman") {
        transformedData[monthName].woman += parseInt(total_quantity);
      }
    });
    let productCountByMonth = Object.values(transformedData);
    return productCountByMonth;
  } catch (error) {
    console.error("Error fetching product counts by type:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getProductCountByType() {
  try {
    const productCounts = await prisma.product.groupBy({
      by: ["type"],
      _count: {
        id: true,
      },
    });

    console.log("Product counts by type ", productCounts);

    const countByType = [];

    productCounts.forEach(({ type, _count }) => {
      const { id } = _count;
      countByType.push({
        type: type,
        value: id,
      });
    });
    return countByType;
  } catch (error) {
    console.error("Error fetching product counts by type:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
