// Run this script to create or update an admin user
// Usage: node createAdmin.js

import prisma from "./lib/prisma.js";
import bcrypt from "bcrypt";

async function createAdmin() {
  try {
    const username = "admin";
    const password = "admin";
    const email = "admin@virtueview.com";

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      // Update existing user to make them admin
      const updatedUser = await prisma.user.update({
        where: { username },
        data: {
          isAdmin: true,
          accountStatus: "active", // Make sure they're active
        },
        select: {
          id: true,
          username: true,
          email: true,
          isAdmin: true,
          userType: true,
          accountStatus: true,
        },
      });

      console.log("✅ Admin user updated successfully!");
      console.log("User details:", updatedUser);
      console.log("\nYou can now login with:");
      console.log("Username: admin");
      console.log("Password: admin");
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          isAdmin: true,
          userType: "seller", // Admins can be sellers too
          accountStatus: "active",
        },
        select: {
          id: true,
          username: true,
          email: true,
          isAdmin: true,
          userType: true,
          accountStatus: true,
        },
      });

      console.log("✅ Admin user created successfully!");
      console.log("User details:", newAdmin);
      console.log("\nYou can now login with:");
      console.log("Username: admin");
      console.log("Password: admin");
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
