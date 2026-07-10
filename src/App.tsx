import {
	type AnchorHTMLAttributes,
	type MouseEvent,
	type ReactNode,
	useState,
	useSyncExternalStore,
} from "react";
import ColorBackground from "./components/ColorBackground";
import GrainOverlay from "./components/GrainOverlay";

const NAVIGATION_EVENT = "calebguy:navigate";

interface Project {
	name: string;
	url: string;
	year: number;
	description: string;
	imageSrc?: string;
	imageAlt?: string;
}

const projects: Project[] = [
	{
		name: "ascii goggles",
		url: "https://asciigoggles.calebguy.com",
		year: 2026,
		description: "life in ascii",
		imageSrc: "/projects/ascii-goggles.png",
		imageAlt: "ascii goggles screenshot",
	},
	{
		name: "writer",
		url: "https://writer.place/",
		year: 2025,
		description: "write today, forever",
		imageSrc: "/projects/writer.png",
		imageAlt: "writer screenshot",
	},
	{
		name: "nebula",
		url: "https://nebula-kappa-rust.vercel.app/",
		year: 2019,
		description: "music video/video game",
		imageSrc: "/projects/nebula.jpg",
		imageAlt: "nebula screenshot",
	},
	{
		name: "bloonnoise",
		url: "https://youtu.be/yKZbCIlSwHc",
		year: 2019,
		description: "playable balloons",
		imageSrc: "/projects/bloon_noise.jpg",
		imageAlt: "bloonnoise screenshot",
	},
	{
		name: "user",
		url: "https://youtu.be/NBI_6D5yV3c",
		year: 2019,
		description: "interactive phone fear factory",
		imageSrc: "/projects/user.jpg",
		imageAlt: "user screenshot",
	},
	{
		name: "decisions",
		url: "https://decisions-navy.vercel.app/",
		year: 2019,
		description: "decision visualization",
		imageSrc: "/projects/decision.jpg",
		imageAlt: "decisions screenshot",
	},
	{
		name: "painthead",
		url: "https://painthead.vercel.app/",
		year: 2018,
		description: "online yelling installation",
		imageSrc: "/projects/painthead.jpg",
		imageAlt: "painthead screenshot",
	},
];

const jobProjects: Project[] = [
	{
		name: "slack.tips",
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
		description: "pixels of Kabosu",
	},
];

const images = [
	{ src: "/e+/flows.png", alt: "user flows" },
	{ src: "/e+/e1.png", alt: "e+ screenshot 1" },
	{ src: "/e+/e2.png", alt: "grid view" },
	{ src: "/e+/entropy-the-second-law.png", alt: "upload" },
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

function WorkSummary() {
	return (
		<div className="flex w-full flex-col text-3xl md:text-6xl leading-snug select-none">
			<span>
				<span className="text-white opacity-65">current: </span>
				<a
					href="https://www.cloudflare.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-(--text-color-hover)! md:hover:font-bold"
					style={{ color: "var(--text-color)" }}
				>
					cloudflare
				</a>
			</span>
			<span>
				<span className="text-white opacity-65">previous: </span>
				<a
					href="https://syndicate.io/"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-(--text-color-hover)! md:hover:font-bold"
					style={{ color: "var(--text-color)" }}
				>
					syndicate
				</a>
				<span className="text-white opacity-65">, </span>
				<a
					href="https://www.ownthedoge.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-(--text-color-hover)! md:hover:font-bold"
					style={{ color: "var(--text-color)" }}
				>
					ownthedoge
				</a>
				<span className="text-white opacity-65">, </span>
				<a
					href="https://rocketreach.co/iterative-capital-management-profile_b45c78d0fc6e8eaa"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-(--text-color-hover)! md:hover:font-bold"
					style={{ color: "var(--text-color)" }}
				>
					an otc desk
				</a>
			</span>
			<span aria-hidden="true" className="work-separator mt-4 mb-4">
				<GrainOverlay
					dragPosition={null}
					resizeMode="element"
					grainScale={14}
					grainIntensity={0.38}
					className="absolute inset-0 h-full w-full pointer-events-none mix-blend-overlay"
				/>
			</span>
		</div>
	);
}

interface ProjectLinkProps {
	project: Project;
	isPreviewActive?: boolean;
	onPreviewDismiss?: () => void;
	onPreviewRequest?: () => void;
}

function ProjectLink({
	project,
	isPreviewActive = false,
	onPreviewDismiss,
	onPreviewRequest,
}: ProjectLinkProps) {
	const linkTargetProps = project.url.startsWith("http")
		? { target: "_blank", rel: "noopener noreferrer" }
		: {};
	const activeClassName = isPreviewActive ? " md:font-bold" : "";

	return (
		<Link
			key={project.name}
			{...linkTargetProps}
			href={project.url}
			aria-label={`${project.name}: ${project.description}`}
			onFocus={onPreviewRequest}
			onBlur={onPreviewDismiss}
			onMouseEnter={onPreviewRequest}
			onMouseLeave={onPreviewDismiss}
			className={`text-3xl md:text-6xl font-normal md:hover:font-bold leading-snug transition-colors hover:text-(--text-color-hover)! select-none group flex flex-col md:flex-row md:gap-2${activeClassName}`}
			style={{
				color: "var(--text-color)",
				fontFamily: "'Merchant Copy', monospace",
			}}
		>
			{project.name}
			<span className="text-xl md:text-3xl md:hidden opacity-65 text-white">
				<span className="italic">({project.year})</span> {project.description}
			</span>
		</Link>
	);
}

function ProjectPreview({ project }: { project: Project }) {
	if (!project.imageSrc) {
		return null;
	}

	return (
		<aside
			aria-hidden="true"
			className="pointer-events-none sticky top-4 hidden h-[calc(100dvh-8rem)] w-full max-w-[56rem] flex-col justify-center md:flex select-none"
		>
			<figure className="flex flex-col items-center">
				<img
					src={project.imageSrc}
					alt=""
					className="block max-h-[70dvh] rounded-3xl object-contain"
				/>
				<figcaption
					className="mt-3 flex flex-col items-center text-center lowercase"
					style={{
						color: "var(--text-color)",
						fontFamily: "'Merchant Copy', monospace",
					}}
				>
					<span className="text-2xl opacity-65 text-white">
						<span className="italic">{project.year}::</span>
						{project.description}
					</span>
				</figcaption>
			</figure>
		</aside>
	);
}

function ProjectLinks({
	projects,
	summary,
}: {
	projects: Project[];
	summary?: ReactNode;
}) {
	const previewProjects = projects.filter((project) => project.imageSrc);
	const [activeProjectName, setActiveProjectName] = useState<string | null>(
		null,
	);
	const activePreviewProject =
		previewProjects.find((project) => project.name === activeProjectName) ??
		null;
	const hasProjectPreviews = previewProjects.length > 0;
	const sectionClassName = hasProjectPreviews
		? "grid max-h-dvh grid-cols-1 gap-6 overflow-y-auto md:grid-cols-[minmax(24rem,44rem)_minmax(24rem,1fr)] md:items-start md:gap-12"
		: "flex max-h-dvh flex-col items-center gap-6 overflow-y-auto";

	return (
		<section id="content" className={sectionClassName}>
			{summary}
			<div className="flex w-full flex-col items-start">
				{projects.map((project) => (
					<ProjectLink
						key={project.name}
						project={project}
						isPreviewActive={project.name === activePreviewProject?.name}
						onPreviewDismiss={
							project.imageSrc
								? () =>
										setActiveProjectName((currentProjectName) =>
											currentProjectName === project.name
												? null
												: currentProjectName,
										)
								: undefined
						}
						onPreviewRequest={
							project.imageSrc
								? () => setActiveProjectName(project.name)
								: () => setActiveProjectName(null)
						}
					/>
				))}
			</div>
			{activePreviewProject ? (
				<ProjectPreview project={activePreviewProject} />
			) : null}
		</section>
	);
}

function ThingsPage({
	projects,
	summary,
}: {
	projects: Project[];
	summary?: ReactNode;
}) {
	return (
		<>
			<ProjectLinks projects={projects} summary={summary} />

			<Link
				href="/"
				className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug select-none md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
				style={{
					color: "var(--text-color)",
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				/
			</Link>
		</>
	);
}

function Things() {
	return <ThingsPage projects={projects} />;
}

function ThingsIMadeForAJob() {
	return <ThingsPage projects={jobProjects} summary={<WorkSummary />} />;
}

function Blank() {
	return (
		<>
			<ProjectLinks projects={projects} />
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
			<div
				id="content"
				className="flex flex-col items-start gap-2 text-3xl md:text-6xl leading-snug select-none"
				style={{
					color: "var(--text-color)",
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				<a
					href="https://github.com/calebguy"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-(--text-color-hover)! md:hover:font-bold"
				>
					gh
				</a>
				<a
					href="https://www.instagram.com/caleb__guy/"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-(--text-color-hover)! md:hover:font-bold"
				>
					insta
				</a>
				<a
					href="https://x.com/caleb__guy"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-(--text-color-hover)! md:hover:font-bold"
				>
					x
				</a>
			</div>
			<Link
				href="/"
				className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug select-none md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
				style={{
					color: "var(--text-color)",
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				/
			</Link>
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

			<section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-screen-lg mx-auto">
				{images.map((image) => (
					<div
						key={image.src}
						className="relative w-full h-auto flex items-center justify-center"
					>
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
				href="/things-i-made-for-a-job"
				className="fixed bottom-4 right-4 text-3xl md:text-6xl leading-snug select-none md:hover:font-bold transition-colors hover:text-(--text-color-hover)!"
			>
				work
			</Link>
		</div>
	);
}

function Route({ pathname }: { pathname: string }) {
	switch (pathname) {
		case "/":
			return <Blank />;
		case "/about":
			return <About />;
		case "/things-i-made-for-me-and-care-about":
			return <Things />;
		case "/things-i-made-for-a-job":
			return <ThingsIMadeForAJob />;
		case "/e+":
			return <EPlus />;
		default:
			return <About />;
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
