import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const parsePropertyText = (text) => {
    const properties = [];
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    let currentProperty = {};

    lines.forEach((line) => {
        if (line.startsWith("Property")) {
            if (Object.keys(currentProperty).length > 0) {
                properties.push(currentProperty);
            }
            currentProperty = {};
        } else if (line.startsWith("City:")) {
            // Extract City and maybe neighborhood? Keeping simple for now
            // "City: Ahmedabad (Satellite)" -> City: Ahmedabad
            const parts = line.replace("City:", "").trim();
            const city = parts.split("(")[0].trim();
            currentProperty.city = city;
        } else if (line.startsWith("Address:")) {
            currentProperty.address = line.replace("Address:", "").trim();
        } else if (line.startsWith("Basic Info:")) {
            // Basic Info: Title: Heritage Loft | Price: ₹45,000 | Type: Rent | Property Type: Apartment | Bedrooms: 3 | Bathrooms: 3
            const info = line.replace("Basic Info:", "").trim();
            const parts = info.split("|").map(p => p.trim());
            parts.forEach(part => {
                const [key, value] = part.split(":").map(s => s.trim());
                if (key === "Title") currentProperty.title = value;
                if (key === "Price") currentProperty.price = parseInt(value.replace(/[^0-9]/g, ''));
                if (key === "Type") currentProperty.type = value.toLowerCase(); // buy/rent
                if (key === "Property Type") currentProperty.property = value.toLowerCase(); // apartment/house/etc
                if (key === "Bedrooms") currentProperty.bedroom = parseInt(value);
                if (key === "Bathrooms") currentProperty.bathroom = parseInt(value);
            });
        } else if (line.startsWith("Map:")) {
            // Map: Lat: 23.0248 | Long: 72.5298
            const mapInfo = line.replace("Map:", "").trim();
            const parts = mapInfo.split("|").map(p => p.trim());
            parts.forEach(part => {
                const [key, value] = part.split(":").map(s => s.trim());
                if (key === "Lat") currentProperty.latitude = value;
                if (key === "Long") currentProperty.longitude = value;
            });
        } else if (line.startsWith("Details:")) {
            // Details: Size: 1850 sqft | Utilities: Tenant | Pets: Allowed | Income: 3x Rent | Schools: 400m | Bus: 100m | Restaurant: 50m
            const details = line.replace("Details:", "").trim();
            const parts = details.split("|").map(p => p.trim());
            currentProperty.postDetail = {};

            parts.forEach(part => {
                const [key, rawValue] = part.split(":").map(s => s.trim());
                const value = rawValue; // Keep raw for some, parse others

                if (key === "Size") currentProperty.postDetail.size = parseInt(value);
                // Map utilities values to enum/expected strings if needed
                if (key === "Utilities") {
                    if (value.includes("Tenant")) currentProperty.postDetail.utilities = "tenant";
                    else if (value.includes("Owner")) currentProperty.postDetail.utilities = "owner";
                    else currentProperty.postDetail.utilities = "shared";
                }
                if (key === "Pets") {
                    currentProperty.postDetail.pet = value === "Allowed" ? "allowed" : "not-allowed";
                }
                if (key === "Income") currentProperty.postDetail.income = value;

                // Distances
                if (key === "Schools") currentProperty.postDetail.school = parseInt(value);
                if (key === "Bus") currentProperty.postDetail.bus = parseInt(value);
                if (key === "Restaurant") currentProperty.postDetail.restaurant = parseInt(value);
            });
        } else if (line.startsWith("Description:")) {
            currentProperty.postDetail.desc = line.replace("Description:", "").trim();
        }
    });

    if (Object.keys(currentProperty).length > 0) {
        properties.push(currentProperty);
    }

    return properties;
};

const main = async () => {
    try {
        // 1. Read file
        const filePath = path.join(__dirname, "..", "detail.txt.txt");
        console.log(`Reading file from ${filePath}`);
        if (!fs.existsSync(filePath)) {
            throw new Error("detail.txt.txt not found!");
        }
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // 2. Parse Properties
        const properties = parsePropertyText(fileContent);
        console.log(`Parsed ${properties.length} properties.`);

        // 3. Get or Create Seller User
        let user = await prisma.user.findFirst({
            where: { userType: "seller" }
        });

        if (!user) {
            console.log("No seller found. Creating a placeholder seller...");
            // Use a random email to avoid collision if run multiple times without cleanup, 
            // though findFirst should prevent that.
            user = await prisma.user.create({
                data: {
                    username: "AdminSeller",
                    email: "admin_seller@example.com",
                    password: "placeholder_password_hash",
                    userType: "seller"
                }
            });
            console.log(`Created seller: ${user.username}`);
        } else {
            console.log(`Using existing seller: ${user.username} (${user.id})`);
        }

        // 4. Insert Properties
        for (const prop of properties) {
            console.log(`Inserting: ${prop.title}`);
            const { postDetail, ...postData } = prop;

            await prisma.post.create({
                data: {
                    ...postData,
                    images: ["https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"], // Placeholder images as requested "I will upload image later" (but code requires array)
                    userId: user.id,
                    postDetail: {
                        create: postDetail
                    }
                }
            });
        }

        console.log("Successfully imported all properties!");

    } catch (err) {
        console.error("Error seeding properties:", err);
    } finally {
        await prisma.$disconnect();
    }
};

main();
