import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ColorBackground from "./components/ColorBackground";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://calebguy.com"),
	title: "calebguy",
	description: "a portfolio of things",
	openGraph: {
		images: ["/og.png"],
	},
	twitter: {
		card: "summary_large_image",
		images: ["/og.png"],
	},
};
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ColorBackground>{children}</ColorBackground>
			</body>
		</html>
	);
}
