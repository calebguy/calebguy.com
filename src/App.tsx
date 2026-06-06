import {
	type AnchorHTMLAttributes,
	type MouseEvent,
	useSyncExternalStore,
} from "react";
import ColorBackground from "./components/ColorBackground";

const NAVIGATION_EVENT = "calebguy:navigate";

const projects = [
	{
		name: "ascii goggles",
		url: "https://asciigoggles.calebguy.com",
		year: 2026,
		description: "life in ascii",
	},
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

const images = [
	{ src: "/e+/flows.png", alt: "user flows" },
	{ src: "/e+/e1.png", alt: "e+ screenshot 1" },
	{ src: "/e+/e2.png", alt: "grid view" },
	{ src: "/e+/entropy-the-second-law.png", alt: "upload" },
	{ src: "/e+/e.png", alt: "e+ logo" },
];

function getPathname() {
	const pathname = window.location.pathname || "/";

	try {
		return decodeURIComponent(pathname);
	} catch {
		return pathname;
	}
}

function subscribeToNavigation(callback: () => void) {
	window.addEventListener("popstate", callback);
	window.addEventListener(NAVIGATION_EVENT, callback);

	return () => {
		window.removeEventListener("popstate", callback);
		window.removeEventListener(NAVIGATION_EVENT, callback);
	};
}

function usePathname() {
	return useSyncExternalStore(subscribeToNavigation, getPathname, () => "/");
}

function navigate(href: string) {
	if (href !== getPathname()) {
		window.history.pushState(null, "", href);
		window.dispatchEvent(new Event(NAVIGATION_EVENT));
	}
	window.scrollTo(0, 0);
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
}

function Link({ href, onClick, target, children, ...props }: LinkProps) {
	const isInternal = href.startsWith("/") && !target;

	function handleClick(event: MouseEvent<HTMLAnchorElement>) {
		onClick?.(event);

		if (
			event.defaultPrevented ||
			!isInternal ||
			event.button !== 0 ||
			event.metaKey ||
			event.altKey ||
			event.ctrlKey ||
			event.shiftKey
		) {
			return;
		}

		event.preventDefault();
		navigate(href);
	}

	return (
		<a href={href} target={target} onClick={handleClick} {...props}>
			{children}
		</a>
	);
}

function Home() {
	return (
		<>
			<section
				id="content"
				className="flex flex-col items-start gap-2 md:gap-0 overflow-y-auto max-h-dvh"
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
								<span className="italic">({project.year})</span> {project.description}
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

function About() {
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

function EPlus() {
	return (
		<div className="flex min-h-dvh flex-col p-4 pb-24">
			<header className="mb-8">
				<div className="flex items-center gap-4">
					<h1 className="text-3xl md:text-6xl leading-snug select-none">e+</h1>
				</div>
				<p className="text-xl md:text-3xl mt-4 opacity-65 text-white">
					Frontend build for{" "}
					<a
						href="https://x.com/ennntropy"
						className="text-xl md:text-3xl mt-4 opacity-65 md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
						target="_blank"
						rel="noopener noreferrer"
					>
						@ennntropy
					</a>
					{"'s "}
					e+, an internet image curation platform.
				</p>
			</header>

			<section className="grid grid-cols-2 gap-4 md:gap-8">
				{images.map((image) => (
					<div key={image.src} className="relative">
						<img
							src={image.src}
							alt={image.alt}
							width={1200}
							height={800}
							loading="lazy"
							className="w-full h-auto rounded-lg"
							style={{ objectFit: "contain" }}
						/>
					</div>
				))}
			</section>

			<Link
				href="/"
				className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug select-none md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
			>
				work
			</Link>
		</div>
	);
}

function Route({ pathname }: { pathname: string }) {
	switch (pathname) {
		case "/about":
			return <About />;
		case "/e+":
			return <EPlus />;
		default:
			return <Home />;
	}
}

export default function App() {
	const pathname = usePathname();

	return (
		<ColorBackground>
			<Route pathname={pathname} />
		</ColorBackground>
	);
}
