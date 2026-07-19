import { type PointerEvent, type ReactNode, useEffect, useState } from "react";
import GrainOverlay, { type PointerPosition } from "./GrainOverlay";

const FULL_HUE_ROTATION = 360;
const MAX_SATURATION = 100;

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
	const [pointerPosition, setPointerPosition] = useState<PointerPosition | null>(
		null,
	);

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
		const separatorColor = `hsl(${(hue + 8) % 360}, ${Math.min(
			100,
			saturation + 10,
		)}%, 52%)`;
		document.documentElement.style.backgroundColor = bgColor;
		document.body.style.backgroundColor = bgColor;

		document.documentElement.style.setProperty("--text-color", textColor);
		document.documentElement.style.setProperty("--text-color-hover", textColorHover);
		document.documentElement.style.setProperty(
			"--separator-color",
			separatorColor,
		);
	}, [hue, saturation]);

	function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
		if (!event.isPrimary) return;

		const viewportWidth = Math.max(window.innerWidth, 1);
		const viewportHeight = Math.max(window.innerHeight, 1);
		const xProgress = Math.min(1, Math.max(0, event.clientX / viewportWidth));
		const yProgress = Math.min(1, Math.max(0, event.clientY / viewportHeight));

		setHue(Math.round(xProgress * FULL_HUE_ROTATION) % FULL_HUE_ROTATION);
		setSaturation(Math.round(MAX_SATURATION - yProgress * MAX_SATURATION));
		setPointerPosition({ x: event.clientX, y: event.clientY });
	}

	function handlePointerLeave() {
		setPointerPosition(null);
	}

	return (
		<>
			<div
				className="fixed inset-0"
				style={{ backgroundColor: `hsl(${hue}, ${saturation}%, 50%)` }}
			/>
			<GrainOverlay pointerPosition={pointerPosition} />
			<div
				className="relative min-h-screen"
				onPointerMove={handlePointerMove}
				onPointerLeave={handlePointerLeave}
			>
				{children}
			</div>
		</>
	);
}
