import "dotenv/config";
import prisma from "../lib/prisma.js";

const DEFAULT_MODEL_URL = "/enhanced_model.glb";

const updatePropertyModels = async () => {
  try {
    const result = await prisma.post.updateMany({
      data: {
        modelUrl: DEFAULT_MODEL_URL,
      },
    });

    console.log(`Updated ${result.count} properties to use ${DEFAULT_MODEL_URL}.`);
  } catch (error) {
    console.error("Failed to update property models:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

updatePropertyModels();
