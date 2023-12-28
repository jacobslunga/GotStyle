import { FC } from "react";

interface InfoProps {}

const Info: FC<InfoProps> = ({}) => {
  return (
    <div className="container mx-auto py-40">
      <h1 className="text-4xl font-bas-bold text-center mb-8">
        Expand Your Reach 📈
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bas-semi mb-4">How It Works 💡</h2>
          <p className="text-lg font-bas-reg text-center">
            Brands instruct their models to take selfies wearing the featured
            clothes. These photos integrate seamlessly into our user feed.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bas-semi mb-4">Why Choose Us 😝</h2>
          <p className="text-lg font-bas-reg text-center">
            We leverage user data to show ads to the audience most likely to
            engage with your brand.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bas-semi mb-4">Cost Structure 💵</h2>
          <p className="text-lg font-bas-reg text-center">
            You only pay when a user clicks on the tags in your image,
            redirecting them to your buying page.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bas-semi mb-4">
            Inclusivity and Diversity 🌍
          </h2>
          <p className="text-lg font-bas-reg text-center">
            Open to all types of brands that can advertise with us.
          </p>
        </div>
      </div>

      <div className="text-center mt-12">
        <a
          href="/brands-get-started"
          className="text-white font-bas-med bg-black hover:opacity-75 transition-opacity py-2 px-6 rounded-full"
        >
          See Examples 🤳
        </a>
      </div>
    </div>
  );
};

export default Info;
