"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { BookingEmbed } from "@/components/forms/BookingEmbed";
import { Footer } from "@/components/layout/Footer";
import { contactInfo } from "@/data/contact";
import Script from "next/script";
import { generateJsonLd, siteConfig } from "@/lib/seo";

const easeOut = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const contactJsonLd = generateJsonLd({
  type: "Organization",
  name: "Compiled Tech - Contact",
  description: "Start a project with Compiled Tech. We reply within one working day.",
  url: "https://compiled.tech/contact",
  address: "Hasilpur, Punjab, Pakistan",
  telephone: "+1 555 000 0000",
  email: "hello@compiled.tech",
});

export default function ContactPage() {
  return (
    <>
      <Script
        id="json-ld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [contactJsonLd] }) }}
      />
      <section className="bg-linear-to-b from-ink via-night/50 to-ink py-16 lg:py-26">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <h1 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              Start a project
            </h1>
            <p className="text-mist text-[1.125rem] leading-[1.65]">
              Tell us what you want to build. We reply within one working day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-26">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:pr-8"
            >
              <motion.div variants={itemVariants}>
                <ContactForm />
              </motion.div>
            </motion.div>

            <motion.aside
              variants={itemVariants}
              className="block lg:sticky lg:top-24 lg:self-start"
            >
              <div className="space-y-8">
                <div className="rounded-[20px] border border-line bg-night p-6 lg:p-8">
                  <h3 className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-6">
                    Get in touch
                  </h3>
                  <div className="space-y-6">
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-center gap-4 group text-mist hover:text-frost transition-colors"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-line bg-slate/50 text-steel group-hover:text-frost group-hover:border-steel/50 transition-colors">
                        <Mail className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span>{contactInfo.email}</span>
                    </a>
                    <a
                      href={contactInfo.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 group text-mist hover:text-frost transition-colors"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-line bg-slate/50 text-steel group-hover:text-frost group-hover:border-steel/50 transition-colors">
                        <MessageSquare className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span>WhatsApp</span>
                    </a>
                    <div className="flex items-center gap-4 text-mist">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-line bg-slate/50 text-steel">
                        <MapPin className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <span>{contactInfo.location}</span>
                    </div>
                  </div>
                </div>

                <BookingEmbed />
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}