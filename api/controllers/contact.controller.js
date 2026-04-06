import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export const addContactMsg = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Save to database
        const newMsg = await prisma.contactMsg.create({
            data: {
                name,
                email,
                subject,
                message,
            },
        });

        // Email configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin (or self if not specified)
            subject: `New Contact Message: ${escapeHtml(subject)}`,
            html: `
                <h3>New Message from VirtueView Contact Form</h3>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <p><strong>Message:</strong></p>
                <p>${escapeHtml(message)}</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json(newMsg);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to send message!" });
    }
};

