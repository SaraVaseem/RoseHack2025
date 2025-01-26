import Link from "next/link";
interface Props {
  input: string;
}

export default function SaveButton({ input }: Props) {
  return (
    <div className="flex item-center justify-center">
      <Link
        href={{
          pathname: "/dashboard",
          query: {
            summary: input,
          },
        }}
      >
        Save Summary
      </Link>
    </div>
  );
}

{
  /* <button className="bg-blue-500 text-white rounded mt-8 mb-8 px-4 py-2">
        Save SummarysdfsdfsdsdfsdfsYIPPIE
      </button>
*/
}
