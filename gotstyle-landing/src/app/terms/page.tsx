import { FC } from "react";

interface TermsProps {}

const Terms: FC<TermsProps> = () => {
  return (
    <div className="max-w-screen-lg mx-auto px-8 py-20">
      <h1 className="text-5xl font-bas-bold mb-8">Terms and Conditions</h1>

      <section className="mb-6">
        <h2 className="text-3xl font-bas-semi mb-4">User Responsibilities</h2>
        <p className="font-bas-reg">
          Users are prohibited from engaging in hate speech in the comment
          section. Further behavioral guidelines may be updated in the future.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bas-semi mb-4">Content Ownership</h2>
        <p className="font-bas-reg">
          The user owns the data they provide, but by using the app, they grant
          us permission to use this data for marketing, analytics, app
          performance, and AI model training.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bas-semi mb-4">Termination</h2>
        <p className="font-bas-reg">
          Accounts found to be spewing hate content and flagged by other users
          may be suspended pending an assessment.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bas-semi mb-4">
          Liabilities and Disclaimers
        </h2>
        <p className="font-bas-reg">
          We provide this service as-is, without any warranties. We are not
          liable for any damages incurred while using this app.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bas-semi mb-4">Jurisdiction</h2>
        <p className="font-bas-reg">
          The terms are governed by the laws of Sweden.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bas-semi mb-4">Updates or Changes</h2>
        <p className="font-bas-reg">
          Any updates to these terms will be communicated via email.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl font-bas-semi mb-4">Contact Information</h2>
        <p className="font-bas-reg">
          For any terms-related queries, please contact{" "}
          <a href="mailto:info@gotstyle.app" className="text-blue-500">
            info@gotstyle.app
          </a>
        </p>
      </section>
    </div>
  );
};

export default Terms;
