"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

	// Touch drag for color picking
	const touchStart = useRef<{
		x: number;
		y: number;
		hue: number;
		saturation: number;
	} | null>(null);

	// Load from localStorage on mount
	useEffect(() => {
		const savedHue = localStorage.getItem("bgHue");
		const savedSaturation = localStorage.getItem("bgSaturation");
		if (savedHue) setHue(Number(savedHue));
		if (savedSaturation) setSaturation(Number(savedSaturation));
	}, []);

	// Save to localStorage and update body/theme color when values change
	useEffect(() => {
		localStorage.setItem("bgHue", String(hue));
		localStorage.setItem("bgSaturation", String(saturation));

		// Update body background for safe areas
		const bgColor = `hsl(${hue}, ${saturation}%, 50%)`;
		document.body.style.backgroundColor = bgColor;

		// Update theme-color meta tag for browser chrome
		let metaTheme = document.querySelector('meta[name="theme-color"]');
		if (!metaTheme) {
			metaTheme = document.createElement("meta");
			metaTheme.setAttribute("name", "theme-color");
			document.head.appendChild(metaTheme);
		}
		metaTheme.setAttribute("content", hslToHex(hue, saturation, 50));
	}, [hue, saturation]);


	const handleTouchStart = (e: React.TouchEvent) => {
		const touch = e.touches[0];
		touchStart.current = {
			x: touch.clientX,
			y: touch.clientY,
			hue,
			saturation,
		};
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!touchStart.current) return;
		const touch = e.touches[0];
		const deltaX = touch.clientX - touchStart.current.x;
		const deltaY = touch.clientY - touchStart.current.y;

		// Horizontal drag changes hue (full screen width = 360 degrees)
		const newHue =
			(touchStart.current.hue + (deltaX / window.innerWidth) * 360 + 360) % 360;
		setHue(Math.round(newHue));

		// Vertical drag changes saturation (full screen height = 100%)
		const newSaturation = Math.max(
			0,
			Math.min(
				100,
				touchStart.current.saturation - (deltaY / window.innerHeight) * 100,
			),
		);
		setSaturation(Math.round(newSaturation));
	};

	const handleTouchEnd = () => {
		touchStart.current = null;
	};

	// Mouse drag for color picking (desktop)
	const handleMouseDown = (e: React.MouseEvent) => {
		touchStart.current = {
			x: e.clientX,
			y: e.clientY,
			hue,
			saturation,
		};
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!touchStart.current) return;
		const deltaX = e.clientX - touchStart.current.x;
		const deltaY = e.clientY - touchStart.current.y;

		const newHue =
			(touchStart.current.hue + (deltaX / window.innerWidth) * 360 + 360) % 360;
		setHue(Math.round(newHue));

		const newSaturation = Math.max(
			0,
			Math.min(
				100,
				touchStart.current.saturation - (deltaY / window.innerHeight) * 100,
			),
		);
		setSaturation(Math.round(newSaturation));
	};

	const handleMouseUp = () => {
		touchStart.current = null;
	};

	// Complementary color: offset hue by 180 degrees for maximum contrast
	const textColor = `hsl(${(hue + 180) % 360}, 100%, 75%)`;
	const textColorHover = `hsl(${(hue + 180) % 360}, 100%, 45%)`;

	return (
		<>
			<div
				className="fixed inset-0"
				style={{ backgroundColor: `hsl(${hue}, ${saturation}%, 50%)` }}
			/>
			<GrainOverlay />
			<div
				className="relative flex flex-col items-start justify-between min-h-screen touch-none"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
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
