import * as React from "react";
import { renderToString } from "react-dom/server";
import "./index.css";

const preamble = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* {
	box-sizing: border-box;
}
html, body {
	margin: 0;
	padding: 0;
}
</style>
<body>
`;

const postamble = `
</body>
</html>
`;

const anchorStyles = {
	"top-left": {
		top: 0,
		left: 0,
	},
	"top-right": {
		top: 0,
		right: 0,
	},
	"bottom-left": {
		bottom: 0,
		left: 0,
	},
	"bottom-right": {
		bottom: 0,
		right: 0,
	},
	"center": {
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	},
} as const;

export type Anchor = keyof typeof anchorStyles;
export const anchors = Object.keys(anchorStyles) as (keyof typeof anchorStyles)[];

export interface PageProps {
	src: string;
	anchor?: keyof typeof anchorStyles;
	width?: number | string;
	height?: number | string;
}

export interface PrintBoxProps {
	pages: PageProps[];
	style?: React.CSSProperties;
}

export const Page = (props: PageProps) => {
	const anchorStyle: React.CSSProperties = anchorStyles[props.anchor ?? "top-left"];

	return <div style={{
		position: "relative",
		width: "100vw",
		height: "100vh",
		breakAfter: "page",
		overflow: "hidden",
	}}>
		<img
			src={props.src}
			style={{
				position: "absolute",
				...anchorStyle,
				width: props.width,
				height: props.height,
			}}
		/>
	</div>;
};

export const PrintBoxInner = (props: PrintBoxProps) => {
	return <div>
		{props.pages.map((page, index) => <Page key={index} {...page} />)}
	</div>;
};

export const PrintBox = React.forwardRef<HTMLIFrameElement, PrintBoxProps>((props, ref) => {
	const [url, setUrl] = React.useState<string | undefined>(undefined);
	React.useEffect(() => {
		const blob = new Blob([
			preamble,
			renderToString(<PrintBoxInner {...props} />),
			postamble,
		], { type: "text/html" });
		blob.text().then(console.log);
		const url = URL.createObjectURL(blob);
		setUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [props]);
	return <iframe ref={ref} src={url} style={props.style} />;
});

