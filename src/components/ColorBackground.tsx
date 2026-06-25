import { type ReactNode, useEffect, useRef, useState } from "react";
import GrainOverlay, { type DragPosition } from "./GrainOverlay";

function readStoredNumber(key: string, fallback: number) {
	const stored = localStorage.getItem(key);
	if (!stored) return fallback;

	const value = Number(stored);
	return Number.isFinite(value) ? value : fallback;
}

export default function ColorBackground({ children }: { children: ReactNode }) {
	const [hue, setHue] = useState(() => readStoredNumber("bgHue", 288));
	const [saturation, setSaturation] = useState(() =>
		readStoredNumber("bgSaturation", 0),
	);
	const [dragPosition, setDragPosition] = useState<DragPosition | null>(null);

	const touchStart = useRef<{
		x: number;
		y: number;
		hue: number;
		saturation: number;
	} | null>(null);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			document.body.style.opacity = "1";
		}, 50);

		return () => window.clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		if ("scrollRestoration" in history) {
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

	useEffect(() => {
		localStorage.setItem("bgHue", String(hue));
		localStorage.setItem("bgSaturation", String(saturation));

		const bgColor = `hsl(${hue}, ${saturation}%, 50%)`;
		const textColor = `hsl(${(hue + 180) % 360}, 100%, 75%)`;
		const textColorHover = `hsl(${(hue + 180) % 360}, 100%, 45%)`;
		document.documentElement.style.backgroundColor = bgColor;
		document.body.style.backgroundColor = bgColor;

		console.log("custom colors", {
			background: bgColor,
			text: textColor,
		});

		document.documentElement.style.setProperty("--text-color", textColor);
		document.documentElement.style.setProperty("--text-color-hover", textColorHover);
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
