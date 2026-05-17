function Contact() {
  return (
    <div className="pt-32 px-6 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-6">Contact Us</h1>

      <form className="space-y-6 mt-10">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700"
        />

        <textarea
          rows="6"
          placeholder="Your Message"
          className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700"
        ></textarea>

        <button className="bg-cyan-400 text-slate-900 px-8 py-4 rounded-full font-semibold">
          Send Message
        </button>
      </form>
    </div>
  )
}

export default Contact