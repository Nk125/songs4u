import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";

const roboto = Roboto({ weight: "variable" });

export const metadata: Metadata = {
	title: "Songs4U",
	description: "Personaliza tu playlist con descripciones únicas!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<body className={`${roboto.className} antialiased`}>{children}</body>
		</html>
	);
}
