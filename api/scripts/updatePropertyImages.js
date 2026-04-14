import "dotenv/config";
import prisma from "../lib/prisma.js";
import { getPropertyImages } from "../lib/propertyImages.js";

const updatePropertyImages = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (posts.length === 0) {
      console.log("No properties found. Nothing to update.");
      return;
    }

    for (const [index, post] of posts.entries()) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          images: getPropertyImages(index),
        },
      });

      console.log(`Updated images for: ${post.title}`);
    }

    console.log(`Updated ${posts.length} properties with unique image sets.`);
  } catch (error) {
    console.error("Failed to update property images:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

updatePropertyImages();
