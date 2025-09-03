import type { PageCopy } from "../types";
const same = (s: string) => ({ learn: s, build: s, operate: s });
const sameArray = (arr: string[]) => ({ learn: arr, build: arr, operate: arr });

export const privacyCopy: PageCopy = {
  heroTitle:  same("Privacy Notice"),
  heroSub:    same("What we collect, why we collect it, and the choices you have. Short summary first, full notice below."),

  pillars: [
    { title: same("Data we collect"), body: same("Basic site telemetry, support messages you send us, and operational logs needed to provide the service.") },
    { title: same("Why we collect it"), body: same("To secure the platform, improve documentation, and respond to support requests. We don’t sell personal data.") },
    { title: same("Your choices"), body: same("You can contact us to access, correct, or delete your information, subject to legal/operational limits.") },
  ],

  sections: [
    {
      heading: same("1. Categories of data"),
      paragraphs: sameArray([
        "Account/contact details you provide; operational logs (timestamps, IPs, user agent); optional diagnostic info when you opt-in.",
      ]),
    },
    {
      heading: same("2. Use and retention"),
      paragraphs: sameArray([
        "We use data to operate, secure, and improve MXTK. Retention is limited to what’s necessary for these purposes or legal obligations.",
      ]),
    },
    {
      heading: same("3. Sharing"),
      paragraphs: sameArray([
        "We may share with service providers under contract (e.g., hosting, security) and when required by law. We do not sell personal data.",
      ]),
    },
    {
      heading: same("4. Security"),
      paragraphs: sameArray([
        "We apply reasonable technical and organizational measures proportional to risk, including access controls and audit logging.",
      ]),
    },
    {
      heading: same("5. Your rights & contact"),
      paragraphs: sameArray([
        "Depending on your location, you may request access, correction, deletion, or portability. Contact details are on the Contact page.",
      ]),
    },
  ],
};


