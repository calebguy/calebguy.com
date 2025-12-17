"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GrainOverlay from "./components/GrainOverlay";

const projects = [
	{ name: "writer", url: "https://writer.place/" },
	{ name: "/tip", url: "https://syndicate.slack.tips" },
	{ name: "ethcall.org", url: "https://ethcall.org" },
	{ name: "vono", url: "https://vono.dev/" },
	{ name: "painthead", url: "https://painthead.vercel.app/" },
];

function hslToHex(h: number, s: number, l: number): string {
	s /= 100;
	l /= 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0");
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

export default function Home() {
	const [hue, setHue] = useState(280);
	const [saturation, setSaturation] = useState(70);
	const [showSliders, setShowSliders] = useState(false);

	// Load from localStorage on mount
	useEffect(() => {
		const savedHue = localStorage.getItem("bgHue");
		const savedSaturation = localStorage.getItem("bgSaturation");
		if (savedHue) setHue(Number(savedHue));
		if (savedSaturation) setSaturation(Number(savedSaturation));
	}, []);

	// Save to localStorage when values change
	useEffect(() => {
		localStorage.setItem("bgHue", String(hue));
		localStorage.setItem("bgSaturation", String(saturation));
	}, [hue, saturation]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "c" || e.key === "C") {
				setShowSliders((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Complementary color: offset hue by 180 degrees for maximum contrast
	const textColor = `hsl(${(hue + 180) % 360}, 100%, 75%)`;
	const textColorHover = `hsl(${(hue + 180) % 360}, 100%, 45%)`;
	const hexColor = hslToHex(hue, saturation, 50);

	return (
		<>
			<div
				className="fixed inset-0"
				style={{ backgroundColor: `hsl(${hue}, ${saturation}%, 50%)` }}
			/>
			<GrainOverlay />
			<div className="relative flex flex-col items-start justify-between min-h-screen">
				<section>
					<div className="flex flex-col items-start">
						{projects.map((project) => (
							<Link
								target="_blank"
								rel="noopener noreferrer"
								href={project.url}
								key={project.name}
								className="text-3xl md:text-6xl font-normal md:hover:font-bold leading-snug transition-colors hover:text-(--hover-color)!"
								style={
									{
										color: textColor,
										fontFamily: "'Merchant Copy', monospace",
										"--hover-color": textColorHover,
									} as React.CSSProperties
								}
							>
								{project.name}
							</Link>
						))}
					</div>
				</section>
				{showSliders && (
					<div className="fixed bottom-4 left-4 right-4 flex flex-col gap-2">
						<div className="flex items-center gap-4">
							<input
								type="range"
								min="0"
								max="360"
								value={hue}
								onChange={(e) => setHue(Number(e.target.value))}
								className="flex-1 h-3 appearance-none cursor-pointer"
								style={{
									background: `linear-gradient(to right,
									hsl(0, ${saturation}%, 50%),
									hsl(60, ${saturation}%, 50%),
									hsl(120, ${saturation}%, 50%),
									hsl(180, ${saturation}%, 50%),
									hsl(240, ${saturation}%, 50%),
									hsl(300, ${saturation}%, 50%),
									hsl(360, ${saturation}%, 50%)
								)`,
								}}
							/>
							<span
								className="font-mono text-sm w-20"
								style={{ color: textColor }}
							>
								{hexColor}
							</span>
						</div>
						<div className="flex items-center gap-4">
							<input
								type="range"
								min="0"
								max="100"
								value={saturation}
								onChange={(e) => setSaturation(Number(e.target.value))}
								className="flex-1 h-3 appearance-none cursor-pointer"
								style={{
									background: `linear-gradient(to right,
									hsl(${hue}, 0%, 50%),
									hsl(${hue}, 50%, 50%),
									hsl(${hue}, 100%, 50%)
								)`,
								}}
							/>
							<span
								className="font-mono text-sm w-20"
								style={{ color: textColor }}
							>
								{saturation}%
							</span>
						</div>
					</div>
				)}
				<span
					className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug"
					style={{
						color: textColor,
						fontFamily: "'Merchant Copy', monospace",
					}}
				>
					calebguy
				</span>
			</div>
		</>
	);
}
