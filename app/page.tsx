import Link from "next/link";

const projects = [
	{
		name: "writer",
		url: "https://writer.place/",
		year: 2025,
		description: "write today, forever",
	},
	{
		name: "/tip",
		url: "https://syndicate.slack.tips",
		year: 2025,
		description: "onchain slack tips",
	},
	{
		name: "ethcall.org",
		url: "https://ethcall.org",
		year: 2025,
		description: "http eth_call",
	},
	{
		name: "vono",
		url: "https://vono.dev/",
		year: 2025,
		description: "onchain toolkit",
	},
	{
		name: "doge pixels",
		url: "https://pixels.ownthedoge.com/",
		year: 2021,
		description: "pixels of The Doge",
	},
	{
		name: "nebula",
		url: "https://youtu.be/wSmsm1jLle0",
		year: 2019,
		description: "music video game",
	},
	{
		name: "bloonnoise",
		url: "https://youtu.be/yKZbCIlSwHc",
		year: 2019,
		description: "touchable balloons",
	},
	{
		name: "user",
		url: "https://youtu.be/NBI_6D5yV3c",
		year: 2019,
		description: "interactive phone fear factory",
	},
	{
		name: "painthead",
		url: "https://painthead.vercel.app/",
		year: 2018,
		description: "online yelling installation",
	},
	{
		name: "wordplay",
		url: "https://wordplay.vercel.app/",
		year: 2018,
		description: "word conglomorator",
	},
];

export default function Home() {
	return (
		<div className="flex flex-col items-start justify-between min-h-screen">
			<section id="content">
				<div className="flex flex-col items-start">
					{projects.map((project) => (
						<Link
							target="_blank"
							rel="noopener noreferrer"
							href={project.url}
							key={project.name}
							className="text-3xl md:text-6xl font-normal md:hover:font-bold leading-snug transition-colors hover:text-(--text-color-hover)! select-none group inline-flex gap-2"
							style={{
								color: "var(--text-color)",
								fontFamily: "'Merchant Copy', monospace",
							}}
						>
							{project.name}
							<span className="text-3xl hidden group-hover:block self-center italic opacity-65 text-white">
								({project.year})
							</span>
							<span className="text-3xl hidden group-hover:block self-center opacity-65 text-white">
								{project.description}
							</span>
						</Link>
					))}
				</div>
			</section>

			<Link
				href="/about"
				className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug select-none md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
				style={{
					color: "var(--text-color)",
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				calebguy
			</Link>
		</div>
	);
}
