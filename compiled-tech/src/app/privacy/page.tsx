import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | Compiled Tech",
  description: "Compiled Tech privacy policy — what we collect, how we use it, and your rights.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        lead="Last updated: 8 October 2026"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy" },
        ]}
        showHexagon={false}
      />

      <Section id="privacy" className="pb-12 pt-8 lg:pb-20 lg:pt-12">
        <Container className="max-w-3xl space-y-12">
          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              1. Who we are
            </h2>
            <p className="text-mist text-[1.125rem] leading-[1.65]">
              Compiled Tech (&quot;we&quot;, &quot;us&quot;) is a software and AI studio run by three co-founders in Hasilpur, Punjab, Pakistan. You can reach us at{" "}
              <a href="mailto:hello@compiledtech.io" className="text-steel hover:text-frost underline">
                hello@compiledtech.io
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              2. What we collect
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                  Project inquiries
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  When you use our contact form, we collect your name, email address, company (optional), the service you are interested in, your budget range, your timeline, and the details you write.
                </p>
              </div>
              <div>
                <h3 className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                  Booking a call
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  If you book a discovery call, our scheduling provider collects your name, email address, and the time you choose.
                </p>
              </div>
              <div>
                <h3 className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                  Newsletter
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  If you subscribe, we collect your email address.
                </p>
              </div>
              <div>
                <h3 className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                  Emails and messages
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  If you email or message us, we keep the conversation so we can help you.
                </p>
              </div>
              <div>
                <h3 className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                  Chatbot
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  If we offer an AI chatbot on the site, we process the messages you type into it. Do not enter passwords, payment details, or other sensitive information.
                </p>
              </div>
              <div>
                <h3 className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                  Analytics
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  We use Plausible Analytics. It does not use cookies and does not track you across other websites. It records page views, the referring site, browser, device type, and approximate country in aggregate form.
                </p>
              </div>
              <div>
                <h3 className="font-display uppercase text-[0.78rem] tracking-[0.1em] text-steel mb-2">
                  Technical data
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Our hosting and security tools process your IP address and basic request data to deliver the site, block spam and abuse, and keep security logs.
                </p>
              </div>
              <p className="text-mist text-base leading-[1.65]">
                We do not ask for sensitive personal data through this site, and we do not want it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              3. How we use your information
            </h2>
            <ul className="space-y-3 list-disc list-inside text-mist text-base leading-[1.65]">
              <li>To reply to your inquiry and prepare a proposal or quote.</li>
              <li>To schedule and hold calls with you.</li>
              <li>To deliver and support a project once you hire us.</li>
              <li>To send our newsletter, only if you subscribed, and you can unsubscribe at any time.</li>
              <li>To protect the site against spam, abuse, and security threats.</li>
              <li>To understand which pages are useful and improve the site.</li>
              <li>To meet legal and accounting obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              4. Our legal reasons (for visitors from the EU and UK)
            </h2>
            <p className="text-mist text-base leading-[1.65]">
              We use your information because you asked us to take steps toward a contract (for example, to answer a project inquiry), because you gave consent (for example, the newsletter), because we have a legitimate interest in running and securing a business website, or because the law requires it.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              5. Who we share it with
            </h2>
            <p className="text-mist text-base leading-[1.65] mb-4">
              We do not sell your personal information. We use trusted providers to run the site, and they process data only to provide their service to us:
            </p>
            <ul className="space-y-3 list-disc list-inside text-mist text-base leading-[1.65]">
              <li>Vercel for hosting</li>
              <li>Supabase for our database</li>
              <li>Resend for sending email</li>
              <li>Cloudflare Turnstile for spam protection</li>
              <li>Cal.com for booking calls</li>
              <li>Plausible for analytics</li>
              <li>An AI provider, such as Anthropic, if the chatbot is enabled</li>
            </ul>
            <p className="text-mist text-base leading-[1.65] mt-4">
              We may also share information when the law requires it or to protect our rights, our clients, or the public.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              6. International transfers
            </h2>
            <p className="text-mist text-base leading-[1.65]">
              Our providers may store and process data in other countries, including outside Pakistan. We choose providers that protect data with security measures and contract terms, and we share only what each one needs.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              7. How long we keep it
            </h2>
            <ul className="space-y-3 list-disc list-inside text-mist text-base leading-[1.65]">
              <li>Project inquiries that do not become a project: up to 24 months after our last contact.</li>
              <li>Project records: for the life of the project, then as long as needed for support, accounting, and legal reasons.</li>
              <li>Newsletter email addresses: until you unsubscribe.</li>
              <li>Chatbot conversations: up to 30 days.</li>
              <li>Analytics: kept only in aggregate form, with no personal data.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              8. Cookies
            </h2>
            <p className="text-mist text-base leading-[1.65]">
              We do not use advertising or tracking cookies. Third-party tools we embed, such as the Cal.com booking widget and Cloudflare Turnstile, may set cookies that they need to work or to protect the site from abuse. You can block cookies in your browser, but the booking widget or contact form may stop working.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              9. Your rights
            </h2>
            <p className="text-mist text-base leading-[1.65] mb-4">
              You can ask us to show you the personal information we hold about you, correct it, delete it, limit how we use it, or send it to you in a common format. You can also object to our use of it and withdraw your consent at any time. To do any of this, email
              <a href="mailto:hello@compiledtech.io" className="text-steel hover:text-frost underline">
                hello@compiledtech.io
              </a>
              . We reply within 30 days, and we may ask you to confirm your identity first. If you are in the EU or UK, you can also complain to your local data protection authority.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              10. Security
            </h2>
            <p className="text-mist text-base leading-[1.65]">
              We use HTTPS, limit access to the data to the people who need it, and keep our tools up to date. No system is completely secure, so we cannot promise absolute security. If a breach affects your information, we will tell you as the law requires.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              11. Children
            </h2>
            <p className="text-mist text-base leading-[1.65]">
              This website is for businesses and is not meant for anyone under 16. We do not knowingly collect information from children. If you think a child has sent us information, email us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              12. Links to other sites
            </h2>
            <p className="text-mist text-base leading-[1.65]">
              Our site may link to other websites, such as GitHub and LinkedIn. We do not control them and are not responsible for their privacy practices.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              13. Changes to this policy
            </h2>
            <p className="text-mist text-base leading-[1.65]">
              When we change this policy, we post the new version here and update the date at the top. If a change is significant, we will say so on the site.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-4">
              14. Contact
            </h2>
            <p className="text-mist text-base leading-[1.65]">
              Compiled Tech, Hasilpur, Punjab, Pakistan. Email:{" "}
              <a href="mailto:hello@compiledtech.io" className="text-steel hover:text-frost underline">
                hello@compiledtech.io
              </a>
            </p>
          </section>
        </Container>
      </Section>

      <Footer />
    </>
  );
}