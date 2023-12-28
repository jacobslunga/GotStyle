import { FC } from "react";

interface PrivacyProps {}

const Privacy: FC<PrivacyProps> = ({}) => {
  return (
    <div className="max-w-screen-lg mx-auto px-8 py-20">
      <h1 className="font-bas-bold text-5xl mb-4">
        Privacy Policy for GotStyle
      </h1>
      <p className="font-bas-reg text-sm mb-4">
        <em>Last Updated: 16 September 2023</em>
      </p>

      <h2 className="font-bas-semi text-3xl mb-3">Introduction</h2>
      <p className="font-bas-reg mb-4">
        Welcome to GotStyle! This Privacy Policy explains how we collect, use,
        and safeguard your personal information. By using our app, you consent
        to the data practices described in this policy.
      </p>

      <h2 className="font-bas-semi text-3xl mb-3">Information We Collect</h2>
      <ul className="font-bas-reg list-disc list-inside mb-4">
        <li>Username</li>
        <li>Name</li>
        <li>Email</li>
        <li>Bio</li>
        <li>Gender</li>
        <li>
          Interactions within the app, such as likes, saves, comments, and
          posts.
        </li>
      </ul>

      <h2 className="font-bas-semi text-3xl mb-3">
        How We Collect Information
      </h2>
      <p className="font-bas-reg mb-4">
        We collect your personal information through forms and based on your
        interactions within the app.
      </p>

      <h2 className="font-bas-semi text-3xl mb-3">
        How We Use Your Information
      </h2>
      <p className="font-bas-reg mb-4">
        We use your personal information for the following purposes:
      </p>
      <ul className="font-bas-reg list-disc list-inside mb-4">
        <li>Personalization of content</li>
        <li>Marketing</li>
        <li>AI model training for improving the app</li>
      </ul>

      <h2 className="font-bas-semi text-3xl mb-3">Data Sharing</h2>
      <p className="font-bas-reg mb-4">
        We do not share your data with any third parties at this moment.
      </p>

      <h2 className="font-bas-semi text-3xl mb-3">Data Retention</h2>
      <p className="font-bas-reg mb-4">
        We will retain your personal information until you choose to delete your
        account.
      </p>

      <h2 className="font-bas-semi text-3xl mb-3">Security</h2>
      <p className="font-bas-reg mb-4">
        We use industry standard encryption and tokenization methods to keep
        your data secure.
      </p>

      <h2 className="font-bas-semi text-3xl mb-3">Contact Us</h2>
      <p className="font-bas-reg">
        For any questions or concerns regarding this Privacy Policy, you can
        reach us at{" "}
        <a href="mailto:info@gotstyle.app" className="text-blue-500">
          info@gotstyle.app
        </a>
        .
      </p>
    </div>
  );
};

export default Privacy;
