import prisma from "../lib/prisma.js";

export const addContactMsg = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const newMsg = await prisma.contactMsg.create({
            data: {
                name,
                email,
                subject,
                message,
            },
        });

        res.status(200).json(newMsg);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to send message!" });
    }
};
