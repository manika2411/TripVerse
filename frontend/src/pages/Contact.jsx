import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, pageTransition } from "../utils/animations";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pb-24 pt-32">
      <div className="absolute inset-0 trip-grid opacity-30" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <motion.div {...pageTransition} className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-600">
            Get In Touch
          </p>

          <h1 className="mt-2 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
            Let's Talk.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-500">
            Have a question, suggestion or simply want to say hello? Send us a
            message.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
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
                bg-cyan-50
                border
                border-cyan-200
                flex
                items-center
                justify-center
                text-cyan-600
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
                  border-slate-200
                  hover:border-cyan-300
                  hover:text-cyan-600
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
