import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

const assignProperties = async () => {
    try {
        const email = "seller123@gmail.com";
        const password = "seller123";
        const username = "seller123";

        // 1. Find or Create Seller
        let seller = await prisma.user.findUnique({
            where: { email },
        });

        if (!seller) {
            console.log("Seller not found. Creating new seller...");
            const hashedPassword = await bcrypt.hash(password, 10);
            seller = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    userType: "seller",
                },
            });
            console.log("Seller created:", seller.id);
        } else {
            console.log("Seller found:", seller.id);
        }

        // 2. Update all Posts
        console.log("Updating all properties to belong to this seller...");
        const updateResult = await prisma.post.updateMany({
            data: {
                userId: seller.id,
            },
        });

        console.log(`Updated ${updateResult.count} properties.`);

    } catch (err) {
        console.error("Error assigning properties:", err);
    } finally {
        await prisma.$disconnect();
    }
};

assignProperties();
