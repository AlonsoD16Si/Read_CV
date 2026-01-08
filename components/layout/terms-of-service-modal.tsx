/**
 * Terms of Service Modal component
 * Displays the terms of service in a modal
 */

"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfServiceModal({
  isOpen,
  onClose,
}: TermsOfServiceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms and Conditions of Use"
      size="xl"
    >
      <div className="space-y-8 text-sm leading-relaxed">
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Last updated: 01/31/2025
          </p>
          <p className="text-base">
            Welcome to the Nexary website. By accessing or using this site, you
            agree to be bound by these Terms and Conditions. If you do not agree
            with them, please do not use the site or our services.
          </p>
        </div>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            1. Identity of the owner
          </h3>
          <p className="mb-3">
            This website is operated by Nexary, including its divisions Nexary
            Labs and Nexary Systems (hereinafter, "Nexary").
          </p>
          <p>
            Nexary is a software startup in development and validation phase,
            focused on creating proprietary digital products and custom software
            solutions.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">2. Purpose of the site</h3>
          <p className="mb-3">This website is intended to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Present institutional information about Nexary</li>
            <li>Describe products, services, and business lines</li>
            <li>Allow contact with interested individuals and companies</li>
            <li>
              Share content related to software, technology, and product
              development
            </li>
          </ul>
          <p className="mt-3">
            Use of the site does not imply automatic contracting of any service.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">3. Permitted use</h3>
          <p className="mb-3">
            The user agrees to use the website lawfully and in accordance with
            these Terms.
          </p>
          <p className="mb-3 font-semibold">The following is strictly prohibited:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Using the site for illegal or unauthorized purposes</li>
            <li>Interfering with the technical functioning of the site</li>
            <li>
              Introducing malicious code, automated attacks, or unauthorized
              scraping
            </li>
            <li>
              Using site information to impersonate identity or create
              commercial confusion
            </li>
          </ul>
          <p className="mt-3">
            Nexary reserves the right to restrict or suspend access in case of
            improper use.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            4. Services and products
          </h3>
          <p className="mb-3">
            Nexary offers, by way of example but not limitation:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Custom software development</li>
            <li>Web page creation and internal systems</li>
            <li>
              Proprietary software products (e.g., Admony, in development)
            </li>
            <li>
              Specific technology projects under Nexary Innovation
            </li>
          </ul>
          <p className="mt-3">
            The specific conditions of each service or product will be
            established through agreements, contracts, or particular terms,
            independent of this document.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            5. Intellectual property
          </h3>
          <p className="mb-3">
            All content on the site, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Texts</li>
            <li>Logos</li>
            <li>Trademarks</li>
            <li>Designs</li>
            <li>Conceptual architecture</li>
            <li>Code, interfaces, and documentation</li>
          </ul>
          <p className="mt-3">
            is the property of Nexary or is used under the corresponding
            license. Its reproduction, distribution, or modification without
            express written authorization from Nexary is prohibited.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            6. Information provided by the user
          </h3>
          <p className="mb-3">
            The user guarantees that the information provided through the site is:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
            <li>Truthful</li>
            <li>Current</li>
            <li>Complete</li>
          </ul>
          <p className="mb-3">
            Nexary is not responsible for errors arising from incorrect
            information provided by the user.
          </p>
          <p>
            The processing of personal data is governed by the Privacy Notice
            published on this site.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            7. Limitation of liability
          </h3>
          <p className="mb-3">
            Nexary makes reasonable efforts to keep the site information updated
            and functional. However:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              It does not guarantee that the site is free of errors or
              interruptions
            </li>
            <li>
              It does not guarantee specific results derived from the use of the
              site or published information
            </li>
            <li>
              It does not assume responsibility for decisions made based on the
              site content
            </li>
          </ul>
          <p className="mt-3">
            Use of the site is at the user's responsibility.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">8. Third-party links</h3>
          <p className="mb-3">
            The site may contain links to third-party websites. Nexary does not
            control or is responsible for the content, policies, or practices of
            such sites.
          </p>
          <p>Access to external links is at the user's responsibility.</p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">9. Modifications</h3>
          <p className="mb-3">
            Nexary reserves the right to modify these Terms and Conditions at any
            time.
          </p>
          <p>
            Modifications will take effect from their publication on the website.
            Continued use of the site implies acceptance of such changes.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            10. Applicable law and jurisdiction
          </h3>
          <p className="mb-3">
            These Terms and Conditions are governed by the laws of the United
            Mexican States.
          </p>
          <p>
            Any dispute will be submitted to the competent courts of Mexican
            territory, with the parties waiving any other jurisdiction that might
            correspond to them.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">11. Contact</h3>
          <p className="mb-3">
            For any questions related to these Terms and Conditions, you can
            contact us at:
          </p>
          <div className="space-y-2">
            <p>
              <a
                href="mailto:contacto@nexary.mx"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                contacto@nexary.mx
              </a>
            </p>
            <p>[Nexary]</p>
          </div>
        </section>
      </div>
    </Modal>
  );
}
