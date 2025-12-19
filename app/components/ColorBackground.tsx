"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import GrainOverlay, { type DragPosition } from "./GrainOverlay";

export default function ColorBackground({ children }: { children: ReactNode }) {
	const [hue, setHue] = useState(280);
	const [saturation, setSaturation] = useState(70);
	const [dragPosition, setDragPosition] = useState<DragPosition | null>(null);

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

		// Small delay to ensure colors are applied before fade-in
		setTimeout(() => {
			document.body.style.opacity = "1";
		}, 50);
	}, []);

	// Fix iOS Safari scroll restoration bug
	useEffect(() => {
		if (typeof window !== "undefined" && "scrollRestoration" in history) {
			history.scrollRestoration = "manual";
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				const content = document.getElementById("content");
				if (content) {
					content.scrollTop = 0;
				}
				window.scrollTo(0, 0);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	// Save to localStorage and update body/theme color when values change
	useEffect(() => {
		localStorage.setItem("bgHue", String(hue));
		localStorage.setItem("bgSaturation", String(saturation));

		// Update body background for safe areas
		const bgColor = `hsl(${hue}, ${saturation}%, 50%)`;
		document.documentElement.style.backgroundColor = bgColor;
		document.body.style.backgroundColor = bgColor;

		// Update CSS custom properties for child components
		document.documentElement.style.setProperty(
			"--text-color",
			`hsl(${(hue + 180) % 360}, 100%, 75%)`,
		);
		document.documentElement.style.setProperty(
			"--text-color-hover",
			`hsl(${(hue + 180) % 360}, 100%, 45%)`,
		);
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

		// Update drag position for grain effect
		setDragPosition({
			x: touch.clientX,
			y: touch.clientY,
			isDragging: true,
		});
	};

	const handleTouchEnd = () => {
		touchStart.current = null;
		setDragPosition(null);
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

		// Update drag position for grain effect
		setDragPosition({
			x: e.clientX,
			y: e.clientY,
			isDragging: true,
		});
	};

	const handleMouseUp = () => {
		touchStart.current = null;
		setDragPosition(null);
	};

	return (
		<>
			<div
				className="fixed inset-0"
				style={{ backgroundColor: `hsl(${hue}, ${saturation}%, 50%)` }}
			/>
			<GrainOverlay dragPosition={dragPosition} />
			<div
				className="relative min-h-screen touch-none"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				{children}
			</div>
		</>
	);
}
