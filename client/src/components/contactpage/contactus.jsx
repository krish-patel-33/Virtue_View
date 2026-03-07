import React from "react";
import { motion } from "framer-motion";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <motion.section
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-10 my-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-playfair font-bold text-[#040404] mb-3">Contact Our Real Estate Experts</h2>
        <p className="text-gray-500 mb-8">
          Whether you&apos;re buying, selling, or investing, our team is here to help. Fill out the form and we&apos;ll connect with you soon!
        </p>
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Your Full Name" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] transition-colors" />
          <input type="email" placeholder="Your Email Address" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] transition-colors" />
          <input type="text" placeholder="Phone Number (Optional)" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] transition-colors" />
          <input type="text" placeholder="Subject" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] transition-colors" />
          <textarea placeholder="Your Message" rows="5" required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] transition-colors resize-none"></textarea>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg border-none cursor-pointer"
          >
            Submit Inquiry
          </motion.button>
        </form>
      </motion.section>
    </div>
  );
};

export default ContactUs;