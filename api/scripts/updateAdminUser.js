import prisma from "../lib/prisma.js";

async function updateAdminUser() {
  try {
    console.log("🔍 Searching for user 'admin'...");

    const user = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (!user) {
      console.log("❌ User 'admin' not found in database.");
      console.log("💡 Please register a user with username 'admin' first, then run this script.");
      await prisma.$disconnect();
      return;
    }

    console.log("✅ User 'admin' found!");
    console.log("📝 Current status:", {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      accountStatus: user.accountStatus || "N/A",
    });

    // Update user to admin
    const updatedUser = await prisma.user.update({
      where: { username: "admin" },
      data: {
        isAdmin: true,
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

    console.log("\n🎉 SUCCESS! User updated to admin!");
    console.log("📋 New status:", updatedUser);
    console.log("\n✅ You can now login with:");
    console.log("   Username: admin");
    console.log("   Password: admin");
    console.log("   URL: http://localhost:5173/login");
    console.log("\n🚀 After login, you'll be redirected to /admin dashboard");

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating admin user:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateAdminUser();
