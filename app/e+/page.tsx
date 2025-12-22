import Image from "next/image";
import Link from "next/link";

const images = [
	{ src: "/e+/flows.png", alt: "user flows" },
	{ src: "/e+/e1.png", alt: "e+ screenshot 1" },
	{ src: "/e+/e2.png", alt: "grid view" },
	{ src: "/e+/entropy-the-second-law.png", alt: "upload" },
	{ src: "/e+/e.png", alt: "e+ logo", className: "w-1/2 md:w-1/4 mx-auto" },
];

export default function EPlus() {
	return (
		<div className="flex flex-col h-dvh p-4 pb-24">
			<header className="mb-8">
				<div className="flex items-center gap-4">
					<h1 className="text-3xl md:text-6xl leading-snug select-none">e+</h1>
				</div>
				<p className="text-xl md:text-3xl mt-4 opacity-65 text-white">
					Frontend build for e+, an internet image curation platform.
				</p>
				<Link
					href="https://x.com/ennntropy"
					className="text-xl md:text-3xl mt-4 opacity-65 md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
					target="_blank"
					rel="noopener noreferrer"
				>
					@ennntropy
				</Link>
			</header>

			<section className="flex flex-col grow md:px-42 gap-8 overflow-y-auto">
				{images.map((image) => (
					<div key={image.src} className={`relative ${image.className}`}>
						<Image
							src={image.src}
							alt={image.alt}
							width={1200}
							height={800}
							className="w-full h-auto rounded-lg"
							style={{ objectFit: "contain" }}
						/>
					</div>
				))}
			</section>

			<Link
				href="/"
				className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug select-none md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
			>
				work
			</Link>
		</div>
	);
}
