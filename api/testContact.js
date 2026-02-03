
import axios from "axios";

async function testContact() {
    try {
        console.log("Testing POST http://localhost:8800/api/contact...");
        const res = await axios.post("http://localhost:8800/api/contact", {
            name: "Test User",
            email: "test@example.com",
            subject: "Test Subject",
            message: "This is a test message from the debugger script."
        });
        console.log("Success!", res.status);
        console.log("Response:", res.data);
    } catch (error) {
        console.error("Error!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Message:", error.message);
        }
    }
}

testContact();
