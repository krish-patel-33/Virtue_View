import prisma from "../lib/prisma.js";

// Get all contact messages
export const getContactMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMsg.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get contact messages" });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await prisma.contactMsg.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const updatedMessage = await prisma.contactMsg.update({
      where: { id },
      data: { status: "read" },
    });

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark message as read" });
  }
};

// Mark message as resolved
export const resolveMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await prisma.contactMsg.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const updatedMessage = await prisma.contactMsg.update({
      where: { id },
      data: { status: "resolved" },
    });

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resolve message" });
  }
};

// Delete contact message
export const deleteContactMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await prisma.contactMsg.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await prisma.contactMsg.delete({
      where: { id },
    });

    res.status(200).json({ message: "Contact message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete message" });
  }
};
