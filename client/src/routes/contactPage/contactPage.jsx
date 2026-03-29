import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState(""); // "", "loading", "success", "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await apiRequest.post("/contact", formData);
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] focus:bg-white transition-colors";

  return (
    <div
      className="h-[calc(100vh-100px)] flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-playfair font-bold mb-3">Get in Touch</h1>
          <p className="text-base text-white/80">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
        </div>

        <div className="flex gap-8 flex-col md:flex-row">
          <div className="flex flex-col gap-4 md:w-[260px]">
            {[
              { icon: 'fa-map-marker-alt', title: 'Our Location', text: 'Akar, Zanzarda Road, Junagadh, 362001' },
              { icon: 'fa-envelope', title: 'Email Us', text: 'krishpatel3300@gmail.com' },
              { icon: 'fa-phone-alt', title: 'Call Us', text: '9328644165' },
            ].map(card => (
              <div key={card.title} className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl text-center">
                <div className="text-2xl text-[#fece51] mb-2"><i className={`fas ${card.icon}`}></i></div>
                <h3 className="font-semibold text-white mb-1">{card.title}</h3>
                <p className="text-white/70 text-sm">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
            <h2 className="text-xl font-playfair font-bold text-white mb-5">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 outline-none focus:border-[#fece51] transition-colors" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 outline-none focus:border-[#fece51] transition-colors" />
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 outline-none focus:border-[#fece51] transition-colors" />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" required rows={4} className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 outline-none focus:border-[#fece51] transition-colors resize-none"></textarea>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-[#1a1a1a] font-semibold rounded-lg border-none cursor-pointer hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                <span>{status === "loading" ? "Sending..." : "Send Message"}</span>
                <i className="fas fa-paper-plane"></i>
              </button>
              {status === "success" && <span className="text-green-400 text-sm text-center">Message sent successfully!</span>}
              {status === "error" && <span className="text-red-400 text-sm text-center">Something went wrong. Please try again.</span>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage; 