import { Head, Html, Main, NextScript } from "next/document";

import loader from "../loader";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta
					name="description"
					content="Genus is a careers social and content platform that seeks to ‘liven’ and‘level up’ career support for students and recent graduates by connecting them to successful applicants /professionals and eachother in an accessible and casualised way"
				/>
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
				<link rel="icon" href="/favicon/favicon.ico" />
				<link rel="manifest" href="/favicon/site.webmanifest" />
				<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />
				<link
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap"
					rel="stylesheet"
				/>
				<style>{loader}</style>
			</Head>
			<body>
				<div id={"globalLoader"}>
					<div className="loader">
						<div />
						<div />
					</div>
				</div>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
