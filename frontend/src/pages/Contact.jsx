import { motion } from "framer-motion";
import { useState } from "react";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="relative min-h-screen pt-36 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 trip-grid opacity-30" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="text-cyan-300 uppercase tracking-[6px] text-sm">
            Get In Touch
          </p>

          <h1 className="text-6xl md:text-8xl font-black mt-5">Let's Talk.</h1>

          <p className="text-slate-400 max-w-2xl mx-auto mt-6 text-lg leading-8">
            Have a question, suggestion or simply want to say hello? Send us a
            message.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="
            trip-glass
            rounded-[36px]
            p-7
            md:p-10
            max-w-3xl
            mx-auto
          "
        >
          {submitted ? (
            <div className="text-center py-20">
              <div
                className="
                w-20
                h-20
                rounded-full
                bg-cyan-300/10
                border
                border-cyan-300/20
                flex
                items-center
                justify-center
                text-cyan-300
                text-3xl
                mx-auto
              "
              >
                ✓
              </div>

              <h2 className="text-3xl font-bold mt-7">Message received.</h2>

              <p className="text-slate-400 mt-3">
                Thanks for reaching out to TripVerse.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="
                  mt-8
                  px-7
                  py-3
                  rounded-full
                  border
                  border-white/15
                  hover:border-cyan-300/40
                  hover:text-cyan-300
                  transition
                "
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="trip-input"
                  required
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  className="trip-input"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="trip-input"
                required
              />

              <textarea
                rows="7"
                placeholder="Tell us what's on your mind..."
                className="trip-input resize-none"
                required
              />

              <button
                type="submit"
                className="
                  trip-button
                  w-full
                  bg-cyan-400
                  text-slate-950
                  py-4
                  rounded-2xl
                  font-bold
                  hover:bg-cyan-300
                  transition
                "
              >
                Send Message →
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default Contact;
