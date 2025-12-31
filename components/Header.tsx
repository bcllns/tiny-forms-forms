import Image from "next/image";

interface HeaderProps {
  text: string;
  image?: string;
  description?: string;
}

export default function Header({ text, image, description }: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <div className="mb-6">
        {image && (
          <div className="flex justify-center mb-6">
            <div className="relative h-24 w-auto" style={{ width: '300px' }}>
              <Image
                src={image}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
        {!image && text && (
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{text}</h1>
        )}
        {description && (
          <p className="text-lg text-gray-600">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
