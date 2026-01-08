/**
 * Privacy Policy Modal component
 * Displays the privacy policy in a modal
 */

"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Notice"
      size="xl"
    >
      <div className="space-y-8 text-sm leading-relaxed">
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Last updated: 01/31/2025
          </p>
          <p className="text-base">
            At Nexary we value clarity, order, and trust. This Privacy Notice
            describes how we collect, use, and protect the personal data of
            individuals who interact with our products, services, and website.
          </p>
        </div>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            1. Identity of the responsible party
          </h3>
          <p className="mb-3">
            Nexary (hereinafter, "Nexary"), including its divisions Nexary Labs
            and Nexary Systems, is responsible for the processing of personal
            data collected through this website and the services we offer.
          </p>
          <p className="mb-3">
            For the purposes of this Notice, Nexary acts as the responsible
            party in accordance with the Federal Law on Protection of Personal
            Data Held by Private Parties and its regulations.
          </p>
          <div className="space-y-2">
            <p>
              <strong>Contact:</strong>
            </p>
            <p>Email: privacidad@nexary.mx</p>
            <p>Website: [Nexary]</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            2. Personal data we collect
          </h3>
          <p className="mb-3">
            Nexary may collect the following personal data, directly or through
            our digital forms:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company or project</li>
            <li>
              Information related to contact requests, quotes, or support
            </li>
            <li>
              Technical browsing data (IP address, browser type, operating
              system, pages visited)
            </li>
          </ul>
          <p className="mt-3">
            Nexary does not intentionally collect sensitive personal data.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            3. Purposes of processing
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">
                Primary purposes (necessary):
              </h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Handle contact, information, or quote requests</li>
                <li>
                  Provide software development services, digital products, and
                  custom solutions
                </li>
                <li>Manage commercial and professional relationships</li>
                <li>
                  Follow up on projects, products, and technical support
                </li>
                <li>Comply with applicable legal obligations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                Secondary purposes (optional):
              </h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Send information related to Nexary products, improvements, or
                  content
                </li>
                <li>
                  Internal analysis to improve our products and services
                </li>
              </ul>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                If you do not wish your data to be used for secondary purposes,
                you can notify us at any time at the email indicated in this
                Notice.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            4. Use of cookies and similar technologies
          </h3>
          <p className="mb-3">
            Our website may use cookies and similar technologies to improve
            browsing experience and analyze site usage.
          </p>
          <p className="mb-3">
            These technologies allow, among other things:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Remember user preferences</li>
            <li>Analyze site usage patterns</li>
            <li>
              Improve performance and clarity of information presented
            </li>
          </ul>
          <p className="mt-3">
            Users can disable the use of cookies directly from their browser
            settings.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            5. Transfer of personal data
          </h3>
          <p className="mb-3">
            Nexary does not sell or rent personal data.
          </p>
          <p className="mb-3">
            Personal data may be shared only in the following cases:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              With technology providers that support the operation of our
              services (hosting, analytics tools, communication platforms), under
              confidentiality agreements
            </li>
            <li>
              When required by a competent authority, in accordance with the law
            </li>
          </ul>
          <p className="mt-3">
            Under no circumstances will transfers be made that compromise the
            confidentiality or legitimate use of information.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">6. ARCO Rights</h3>
          <p className="mb-3">The data subject has the right to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
            <li>Access their data</li>
            <li>Rectify it when it is inaccurate or incomplete</li>
            <li>Cancel it when they consider it unnecessary</li>
            <li>Object to its use for specific purposes</li>
          </ul>
          <p className="mb-3">
            To exercise these rights, the data subject must send a request to the
            email:{" "}
            <a
              href="mailto:privacidad@nexary.mx"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              privacidad@nexary.mx
            </a>
          </p>
          <p className="mb-3 font-semibold">The request must include:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Name of the data subject</li>
            <li>Means to receive response</li>
            <li>
              Clear description of the right they wish to exercise
            </li>
            <li>Identification that proves their identity</li>
          </ul>
          <p className="mt-3">
            Nexary will respond in accordance with the deadlines established by
            applicable legislation.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">7. Security measures</h3>
          <p>
            At Nexary we implement reasonable technical, administrative, and
            organizational measures to protect personal data against damage,
            loss, alteration, unauthorized use, or access. Our approach is simple:
            treat information with the same level of responsibility with which
            we build our software.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">
            8. Changes to the Privacy Notice
          </h3>
          <p className="mb-3">
            This Privacy Notice may be updated to reflect changes in our
            processes, products, or applicable legislation.
          </p>
          <p>
            Any modification will be published on this same website and will take
            effect from its publication.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">9. Acceptance</h3>
          <p>
            By using this website or providing your personal data to Nexary, you
            acknowledge having read and understood this Privacy Notice.
          </p>
        </section>
      </div>
    </Modal>
  );
}
