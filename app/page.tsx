import Link from "next/link";

const projects = [
	{ name: "writer", url: "https://writer.place/" },
	{ name: "/tip", url: "https://syndicate.slack.tips" },
	{ name: "ethcall.org", url: "https://ethcall.org" },
	{ name: "vono", url: "https://vono.dev/" },
	{ name: "painthead", url: "https://painthead.vercel.app/" },
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
							className="text-3xl md:text-6xl font-normal md:hover:font-bold leading-snug transition-colors hover:text-(--text-color-hover)! select-none"
							style={{
								color: "var(--text-color)",
								fontFamily: "'Merchant Copy', monospace",
							}}
						>
							{project.name}
						</Link>
					))}
				</div>
			</section>

			<Link
				href="/about"
				className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug select-none"
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
