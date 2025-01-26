import Button from "./Button";

interface ArticleProps {
  input: string;
}

export default function ArticleDetails({ input }: ArticleProps) {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-4xl text-center text-gray-800 mb-6">
          Here is a summary for you
        </h3>
        <p className="text-lg text-gray-700">
          {/* CHANGE LATER WITH AI INPUT */}
          {input}
        </p>
      </div>
    </section>
  );
}
