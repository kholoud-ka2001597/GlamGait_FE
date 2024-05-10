const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export async function authenticateUser(username, password) {
  try {
    // Find user with the given username and password
    const user = await prisma.user.findFirst({
      where: {
        username: username,
        password: password
      }
    });

    if (user) {
      console.log(`User ${username} authenticated successfully.`);
      return user;
    } else {
      console.log(`User ${username} not found or incorrect password.`);
      return null;
    }
  } catch (error) {
    console.error(`Error authenticating user: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function updateUserWallet(userID, deductionAmount) {
  try {
    // Find the user by userID
    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
    });

    if (!user) {
      console.log(`User '${userID}' not found.`);
      return null;
    }

    if (parseInt(user.wallet) < parseInt(deductionAmount)) {
      console.log(`Insufficient balance for user '${userID}'.`);
      return null;
    }

    // Deduct the specified amount from the wallet balance
    const updatedUser = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        wallet: (parseInt(user.wallet) - parseInt(deductionAmount)).toString()
      },
    });

    console.log(`Wallet updated for user '${userID}'.`);
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user wallet: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getTotalUserCount() {
  try {
    const totalCount = await prisma.user.count();

    console.log(`Total number of users: ${totalCount}`);
    return totalCount;
  } catch (error) {
    console.error(`Error fetching total user count: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}
export async function getUserCountByType(userType) {
  try {
    const userCount = await prisma.user.count({
      where: {
        type: userType
      }
    });

    console.log(`Count of users with type '${userType}': ${userCount}`);
    return userCount;
  } catch (error) {
    console.error(`Error fetching user count by type: ${error}`);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}