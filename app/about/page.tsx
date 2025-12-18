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

			<Link
				href="/"
				className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug select-none"
				style={{
					color: "var(--text-color)",
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				work
			</Link>
		</div>
	);
}
