function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <header className="text-center py-16 bg-gradient-to-r from-[#040404] to-[#2d2d2d] text-white rounded-2xl mb-12">
        <h1 className="text-4xl font-playfair font-bold mb-4">About VirtuView Properties</h1>
        <p className="text-lg text-white/80">Where luxury meets technology for your perfect home.</p>
      </header>

      <section className="flex gap-10 items-center mb-16 flex-col md:flex-row">
        <div className="flex-1">
          <h2 className="text-2xl font-playfair font-bold text-[#040404] mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At VirtuView Properties, our mission is to transform the real estate
            landscape by combining cutting-edge virtual experiences with world-class
            property listings. We help clients discover, explore, and secure their dream properties from anywhere in the world.
          </p>
        </div>
        <img src="./mission.jpg" alt="Our Mission" className="flex-1 rounded-xl object-cover h-[250px] w-full" />
      </section>

      <section className="flex gap-10 items-center mb-16 flex-col-reverse md:flex-row">
        <img src="./vision.jpg" alt="Our Vision" className="flex-1 rounded-xl object-cover h-[250px] w-full" />
        <div className="flex-1">
          <h2 className="text-2xl font-playfair font-bold text-[#040404] mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a future where luxury properties can be experienced virtually
            with stunning detail, making property discovery seamless, global, and innovative.
          </p>
        </div>
      </section>

      <section className="py-10 text-center">
        <h2 className="text-3xl font-playfair font-bold text-[#040404] mb-8">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[{title:'Innovation',desc:'We lead with technology to provide next-level real estate experiences.'},{title:'Transparency',desc:'Clear, honest communication with clients at every stage.'},{title:'Excellence',desc:'High-end service, quality listings, and exceptional client care.'},{title:'Global Reach',desc:'Connecting clients with luxury properties worldwide.'}].map(v => (
            <div key={v.title} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-[#040404] mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="bg-gray-50 rounded-xl p-10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-playfair font-bold text-[#040404] mb-6">Why Choose VirtuView?</h2>
          <ul className="flex flex-col gap-3 text-gray-600">
            <li>🏡 Exclusive luxury listings</li>
            <li>👓 Virtual tours in HD</li>
            <li>📜 End-to-end documentation assistance</li>
            <li>🛡️ Safe and secure transactions</li>
            <li>🌐 Global network of elite properties</li>
          </ul>
        </div>
      </section>

      <section className="text-center py-16 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white rounded-2xl mt-10">
        <h2 className="text-3xl font-playfair font-bold mb-4">Ready to Find Your Dream Property?</h2>
        <p className="text-white/90 mb-8">Contact VirtuView Properties and let us guide you home.</p>
        <a href="/contact" className="px-8 py-3 bg-white text-[#f0b400] font-semibold rounded-full no-underline hover:bg-gray-100 transition-colors">Contact Us</a>
      </section>
    </div>
  );
}

export default AboutPage; 