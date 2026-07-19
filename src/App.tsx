import {
	type AnchorHTMLAttributes,
	Fragment,
	type MouseEvent,
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
}

interface ProjectYearGroup {
	year: number;
	projects: Project[];
}

const projects: Project[] = [
	{
		name: "ascii goggles",
		url: "https://asciigoggles.calebguy.com",
		year: 2026,
		description: "life in asciiiiiiii",
	},
	{
		name: "writer",
		url: "https://writer.place/",
		year: 2025,
		description: "write your diary in a rock",
	},
	{
		name: "nebula",
		url: "https://nebula-kappa-rust.vercel.app/",
		year: 2019,
		description: "music videovideo game",
	},
	{
		name: "bloonnoise",
		url: "https://youtu.be/yKZbCIlSwHc",
		year: 2019,
		description: "balloons",
	},
	{
		name: "user",
		url: "https://youtu.be/NBI_6D5yV3c",
		year: 2019,
		description: "phone fear factory",
	},
	{
		name: "decisions",
		url: "https://decisions-navy.vercel.app/",
		year: 2019,
		description: "path sculpture",
	},
	{
		name: "slurpy",
		url: "https://youtu.be/ilZHbuH81FQ?si=Fh8OcVpKKVWPpvnK",
		year: 2019,
		description: "fall in love, get slurped",
	},
	{
		name: "wordplay",
		url: "https://youtu.be/hAwZb4hvRwg?si=F0UC0WmlNBtc1g93",
		year: 2019,
		description: "playing with _-_-_-_-_",
	},
	{
		name: "painthead",
		url: "https://painthead.vercel.app/",
		year: 2018,
		description: "yelling exhibition",
	},
	{
		name: "understanding nothing",
		url: "https://youtu.be/buCZf7gC-sw?si=ut4EZWxmxANMOXvB",
		year: 2018,
		description: "hmmmm",
	},
	{
		name: "I♥︎",
		url: "https://youtu.be/gwVnfZQI8EU?si=JVYg9ObFkTZK1V87",
		year: 2018,
		description: "my computer",
	},
	{
		name: "Space B_W ME",
		url: "https://youtu.be/EiYRrbmrIYc?si=xboWuLT5JKheijqj",
		year: 2017,
		description: "beep....beeeep",
	},
];

function groupProjectsByYear(projects: readonly Project[]) {
	const groups: ProjectYearGroup[] = [];

	for (const project of projects) {
		const previousGroup = groups[groups.length - 1];

		if (previousGroup?.year === project.year) {
			previousGroup.projects.push(project);
			continue;
		}

		groups.push({ year: project.year, projects: [project] });
	}

	return groups;
}

const projectYearGroups = groupProjectsByYear(projects);

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

interface ProjectLinkProps {
	project: Project;
}

function ProjectLink({ project }: ProjectLinkProps) {
	const linkTargetProps = project.url.startsWith("http")
		? { target: "_blank", rel: "noopener noreferrer" }
		: {};

	return (
		<div
			className="block leading-snug select-none"
			style={{
				color: "var(--text-color)",
				fontFamily: "'Merchant Copy', monospace",
			}}
		>
			<Link
				{...linkTargetProps}
				href={project.url}
				aria-label={`${project.name}: ${project.description}`}
				className="inline text-2xl md:text-4xl font-normal md:hover:font-bold hover:text-(--text-color-hover)! md:whitespace-nowrap"
			>
				{project.name}
			</Link>
			<span className="block md:inline md:ml-2 text-xl md:text-2xl opacity-65 text-white">
				{project.description}
			</span>
		</div>
	);
}

function YearDivider() {
	return (
		<span aria-hidden="true" className="work-separator">
			<GrainOverlay
				pointerPosition={null}
				resizeMode="element"
				grainScale={14}
				grainIntensity={0.38}
				className="absolute inset-0 h-full w-full pointer-events-none mix-blend-overlay"
			/>
		</span>
	);
}

function ProjectLinks({ groups }: { groups: readonly ProjectYearGroup[] }) {
	return (
		<section
			id="content"
			className="flex max-h-dvh flex-col items-start gap-2 overflow-y-auto"
		>
			{groups.map((group, index) => (
				<Fragment key={group.year}>
					<section className="flex flex-col items-start">
						<h2 className="mb-1 text-xl md:text-2xl leading-snug select-none text-white opacity-65">
							{group.year}
						</h2>
						<div className="flex flex-col items-start gap-4">
							{group.projects.map((project) => (
								<ProjectLink key={project.name} project={project} />
							))}
						</div>
					</section>
					{index < groups.length - 1 ? <YearDivider /> : null}
				</Fragment>
			))}
		</section>
	);
}

function Things() {
	return (
		<>
			<ProjectLinks groups={projectYearGroups} />

			<Link
				href="/"
				className="fixed bottom-4 right-4 text-2xl md:text-4xl leading-snug select-none md:hover:font-bold hover:text-(--text-color-hover)!"
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

function Blank() {
	return (
		<>
			<ProjectLinks groups={projectYearGroups} />
			<Link
				href="/about"
				className="fixed bottom-4 right-4 text-2xl md:text-4xl leading-snug select-none md:hover:font-bold hover:text-(--text-color-hover)!"
				style={{
					color: "var(--text-color)",
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				-&gt;
			</Link>
		</>
	);
}

function About() {
	return (
		<div className="flex flex-col items-start justify-between min-h-screen">
			<div
				id="content"
				className="flex flex-col items-start gap-2 text-2xl md:text-4xl leading-snug select-none"
				style={{
					color: "var(--text-color)",
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				<a
					href="https://github.com/calebguy"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-(--text-color-hover)! md:hover:font-bold"
				>
					gh
				</a>
				<a
					href="https://www.instagram.com/caleb__guy/"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-(--text-color-hover)! md:hover:font-bold"
				>
					insta
				</a>
				<a
					href="https://x.com/caleb__guy"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-(--text-color-hover)! md:hover:font-bold"
				>
					x
				</a>
			</div>
			<Link
				href="/"
				className="fixed bottom-4 right-4 text-2xl md:text-4xl leading-snug select-none md:hover:font-bold hover:text-(--text-color-hover)!"
				style={{
					color: "var(--text-color)",
					fontFamily: "'Merchant Copy', monospace",
				}}
			>
				&lt;-
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
