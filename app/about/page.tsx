import Link from "next/link";

export default function About() {
	return (
		<div className="flex flex-col items-start justify-between min-h-screen">
			<section id="content">
				<div
					className="text-3xl md:text-6xl leading-snug select-none"
					style={{
						color: "var(--text-color)",
						fontFamily: "'Merchant Copy', monospace",
					}}
				>
					calebguy is a human who uses computers
				</div>
			</section>

			<div
				className="fixed bottom-4 right-4 flex flex-col md:flex-row gap-2 md:gap-4 text-3xl md:text-6xl leading-snug select-none"
				style={{
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				<a
					href="https://github.com/calebguy"
					target="_blank"
					rel="noopener noreferrer"
					className="md:hover:font-bold transition-colors hover:text-(--text-color-hover)! text-white opacity-65 hover:opacity-100"
				>
					github
				</a>
				<a
					href="https://x.com/caleb__guy"
					target="_blank"
					rel="noopener noreferrer"
					className="md:hover:font-bold transition-colors hover:text-(--text-color-hover)! text-white opacity-65 hover:opacity-100"
				>
					twitter
				</a>
				<Link
					href="/"
					className="md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
					style={{ color: "var(--text-color)" }}
				>
					work
				</Link>
			</div>
		</div>
	);
}
