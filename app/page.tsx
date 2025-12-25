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
		url: "https://slack.tips",
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
		description: "fullstack onchain app framework",
	},
	{
		name: "e+",
		url: "/e+",
		year: 2022,
		description: "internet image curation",
	},
	{
		name: "wanwan",
		url: "https://wanwan-roan.vercel.app/",
		year: 2022,
		description: "meme competitions for communities",
	},
	{
		name: "doge pixels",
		url: "https://pixels.ownthedoge.com/",
		year: 2021,
		description: "pixels of Kobosu the Doge",
	},
	{
		name: "nebula",
		url: "https://nebula-kappa-rust.vercel.app/",
		year: 2019,
		description: "playable music video",
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
		name: "decisions",
		url: "https://decisions-navy.vercel.app/",
		year: 2019,
		description: "decision visualization",
	},
	{
		name: "painthead",
		url: "https://painthead.vercel.app/",
		year: 2018,
		description: "online yelling installation",
	},
	{
		name: "wordplay",
		url: "https://wordplay-beta.vercel.app/",
		year: 2018,
		description: "word conglomorator",
	},
];

export default function Home() {
	return (
		<>
			<section
				id="content"
				className="flex flex-col items-start gap-2 md:gap-0 overflow-y-scroll max-h-dvh"
			>
				{projects.map((project) => {
					const isExternal = project.url.startsWith("http");
					return (
						<Link
							key={project.name}
							{...(isExternal && {
								target: "_blank",
								rel: "noopener noreferrer",
							})}
							href={project.url}
							className="text-3xl md:text-6xl font-normal md:hover:font-bold leading-snug transition-colors hover:text-(--text-color-hover)! select-none group flex flex-col md:flex-row md:gap-2"
							style={{
								color: "var(--text-color)",
								fontFamily: "'Merchant Copy', monospace",
							}}
						>
							{project.name}
							<span className="text-xl md:text-3xl md:hidden opacity-65 text-white">
								<span className="italic">({project.year})</span>{" "}
								{project.description}
							</span>
							<span className="text-3xl hidden md:group-hover:block self-center italic opacity-65 text-white">
								({project.year})
							</span>
							<span className="text-3xl hidden md:group-hover:block self-center opacity-65 text-white">
								{project.description}
							</span>
						</Link>
					);
				})}
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
		</>
	);
}
