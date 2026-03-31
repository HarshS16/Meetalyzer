import Image from "next/image";

interface Props {
  title: string;
  description: string;
  image?: string;
}

export const EmptyState = ({
  title,
  description,
  image = "/empty.svg",
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        <Image
          src={image}
          alt="Empty"
          width={240}
          height={240}
          className="opacity-80"
        />

        <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-b from-primary/40 to-transparent" />
      </div>
      <div className="flex flex-col gap-y-3 max-w-md mx-auto text-center mt-6">
        <h6 className="text-xl font-semibold text-white">{title}</h6>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
