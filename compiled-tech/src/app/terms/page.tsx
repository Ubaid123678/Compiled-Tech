import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms and Conditions | Compiled Tech",
  description: "Compiled Tech terms and conditions — website use and project terms.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms and Conditions"
        lead="Last updated: 8 October 2026"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms" },
        ]}
        showHexagon={false}
      />

      <Section id="terms" className="pb-12 pt-8 lg:pb-20 lg:pt-12">
        <Container className="max-w-3xl space-y-12">
          {/* Part A */}
          <section>
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-6">
              Part A. Using this website
            </h2>

            <article className="space-y-8">
              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  1. Who we are
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Compiled Tech (&quot;we&quot;, &quot;us&quot;) is a software and AI studio run by three co-founders in Hasilpur, Punjab, Pakistan. Contact:{" "}
                  <a href="mailto:hello@compiledtech.io" className="text-steel hover:text-frost underline">
                    hello@compiledtech.io
                  </a>
                  . By using this site, you agree to Part A.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  2. Acceptable use
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Do not misuse the site. This means no scraping at scale, no attempts to break, overload, or test the security of the site without our written permission, no uploading malicious code, and no sending spam through our forms.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  3. Our content
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  The text, design, logo, code, and graphics on this site belong to Compiled Tech or its licensors. You may view and share pages for normal personal or business use. You may not copy or reuse our content or branding to present it as your own.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  4. Examples and demos
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Project examples and demos on this site may use sample data and are labeled as samples when they are not client work. AI demos and chatbot answers can be wrong. They are for illustration and are not professional, legal, or financial advice.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  5. No guarantee about the site
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  We work to keep the site accurate and available, but we provide it &quot;as is&quot;. We do not promise that it will always be available, error free, or free from harmful components.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  6. Limit of liability for the site
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  To the extent the law allows, we are not liable for any indirect or consequential loss from using the site or relying on its content. Nothing in these terms limits liability that cannot be limited by law.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  7. Links to other sites
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Links to third-party sites are for convenience. We do not control those sites and are not responsible for them.
                </p>
              </section>
            </article>
          </section>

          {/* Part B */}
          <section className="border-t border-line pt-12">
            <h2 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.15] mb-6">
              Part B. Project terms
            </h2>

            <article className="space-y-8">
              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  8. Proposal and scope
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Every project starts with a written proposal that states the scope, deliverables, price, payment schedule, and delivery dates. Work outside that scope needs a written change request that states the extra cost and any change to the dates. Both sides must agree to it before the extra work starts.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  9. Payment
                </h3>
                <ul className="space-y-3 list-disc list-inside text-mist text-base leading-[1.65]">
                  <li>We start work after we receive the deposit stated in the proposal, usually 40% of the price.</li>
                  <li>The rest is paid in the milestones listed in the proposal. Each invoice is due within 7 days.</li>
                  <li>If an invoice is late, we may pause work until it is paid, and delivery dates move by the length of the pause.</li>
                  <li>We hand over final files, source code, and deployment access once the related payment is complete. Until then, we may withhold them.</li>
                  <li>Prices do not include third-party costs, such as domains, hosting, paid plugins, app store fees, and AI or other API usage, unless the proposal says so.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  10. Your responsibilities
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  You agree to give us the content, access, approvals, and feedback we need, and to reply within 5 business days. If we are waiting on you, delivery dates move by the same amount of time.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  11. Delivery and acceptance
                </h3>
                <ul className="space-y-3 list-disc list-inside text-mist text-base leading-[1.65]">
                  <li>We deliver the work as agreed in the proposal.</li>
                  <li>You have 7 days after each delivery to test it and send written feedback.</li>
                  <li>Your proposal includes 2 rounds of revisions for each deliverable. Further revisions are billed as extra work.</li>
                  <li>We fix any defect where the work does not match the agreed scope.</li>
                  <li>If you send no feedback within the 7 days, the delivery counts as accepted.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  12. Timelines
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Delivery dates in the proposal are our firm plan. They depend on timely payments, content, and feedback from you. If we expect to miss a date, we will tell you early and give you a new date.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  13. Direct contact
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  You can contact the developers working on your project directly, through the channels we agree on (such as email or WhatsApp). We aim to reply within one working day.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  14. Ownership
                </h3>
                <ul className="space-y-3 list-disc list-inside text-mist text-base leading-[1.65]">
                  <li>When you have paid in full, you own the custom code, designs, and content we created specifically for your project.</li>
                  <li>We keep ownership of our own pre-existing tools, libraries, templates, and know-how. You get a permanent license to use them as part of your project.</li>
                  <li>Third-party and open-source components stay under their own licenses.</li>
                  <li>Unless you tell us in writing not to, we may show your project in our portfolio and describe it, without sharing confidential information.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  15. Confidentiality
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Each side will keep the other side&apos;s confidential information private, use it only for the project, and not share it without permission. This does not apply to information that is public, already known to us, or required by law to be disclosed. This duty continues for 2 years after the project ends.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  16. Support after launch
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  After the project goes live, we fix defects in the agreed scope for 30 days at no extra charge. After that, we can keep supporting your project through a maintenance plan or at an agreed rate. We will tell you the cost before we start.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  17. Third-party services
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Your project may depend on services we do not control, such as hosting providers, payment gateways, app stores, Shopify, WordPress plugins, and AI providers. We are not responsible for their outages, price changes, or policy changes, but we will help you deal with them.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  18. Warranties and disclaimers
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  We do the work with reasonable skill and care. We do not guarantee specific business results, such as sales, search ranking, or user numbers. We do not guarantee that software will be free from every error. AI features can produce incorrect output, so you should check important results.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  19. Limit of liability
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  To the extent the law allows, our total liability for any claim connected to a project is limited to the fees you paid us for that project. We are not liable for indirect or consequential losses, such as lost profit or lost data. Nothing in these terms limits liability that cannot be limited by law.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  20. Ending a project
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Either side may end a project with written notice. If either side seriously breaks these terms and does not fix it within 7 days of written notice, the other side may end the project immediately. If you end a project, you pay for the work completed up to that date. If we are unable to deliver a milestone you have paid for, we will refund the amount you paid for that milestone. Deposits for work already started are not refundable.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  21. Events outside our control
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Neither side is responsible for a delay or failure caused by events beyond its control, such as natural disasters, power or internet failures, government actions, or outages of major platforms. The affected side will tell the other side quickly and do what it reasonably can to continue.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  22. Governing law and disputes
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  These terms are governed by the laws of Pakistan. If we have a dispute, we will first try to settle it by talking in good faith for 14 days. If that does not work, the courts of Hasilpur, Punjab, Pakistan will have jurisdiction.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  23. Changes and the whole agreement
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  We may update these terms. Changes do not affect a project that has already started unless both sides agree. The proposal and these terms together are the full agreement for a project, and the proposal comes first if the two conflict.
                </p>
              </section>

              <section>
                <h3 className="font-display font-semibold uppercase tracking-[0.02em] text-frost text-[1.5rem] leading-[1.15] mb-3">
                  24. Contact
                </h3>
                <p className="text-mist text-base leading-[1.65]">
                  Compiled Tech, Hasilpur, Punjab, Pakistan. Email:{" "}
                  <a href="mailto:hello@compiledtech.io" className="text-steel hover:text-frost underline">
                    hello@compiledtech.io
                  </a>
                </p>
              </section>
            </article>
          </section>
        </Container>
      </Section>

      <Footer />
    </>
  );
}