import * as React from "react";
import { PrintBox, anchors, Anchor } from "../PrintBox";
import "./index.css";

interface Image {
	url: string;
	name: string;
	width: number;
	height: number;
}

export const App = () => {
	const ref = React.useRef<HTMLIFrameElement>(null);
	const fileRef = React.useRef<HTMLInputElement>(null);
	const [images, setImages] = React.useState<Image[]>([]);
	const [dpi, setDpi] = React.useState<number>(300);
	const [anchor, setAnchor] = React.useState<Anchor>("top-left");
	const [contrast, setContrast] = React.useState<number>(1);
	const [brightness, setBrightness] = React.useState<number>(1);

	return <div className="app">
		<div className="left">
			<form>
				<div>
					<label>DPI</label>
					<input
						value={dpi}
						type="number"
						onChange={(e) => setDpi(parseInt(e.target.value, 10))}
					/>
				</div>
				<div>
					<label>Anchor</label>
					<select value={anchor} onChange={(e) => setAnchor(e.target.value as Anchor)}>
						{anchors.map((anchor) => <option key={anchor} value={anchor}>{anchor}</option>)}
					</select>
				</div>
				<div>
					<label>Brightness</label>
					<input type="range" min="0.1" max="5.0" step="0.1" value={brightness} onChange={(e) => setBrightness(parseFloat(e.target.value))} />
					<span>{brightness}</span>
				</div>
				<div>
					<label>Contrast</label>
					<input type="range" min="0.1" max="5.0" step="0.1" value={contrast} onChange={(e) => setContrast(parseFloat(e.target.value))} />
					<span>{contrast}</span>
				</div>
				<div>
					<input
						type="file"
						accept="image/*"
						value={undefined}
						onChange={async (e) => {
							const input = e.target;
							const files = input.files;
							if (files === null) {
								return;
							}
							// const images = await Promise.all(Array.from(files).map(file => new Promise<[string, string]>(resolve => {
							// 	const reader = new FileReader();
							// 	reader.onload = () => {
							// 		resolve([file.name, reader.result as string]);
							// 	};
							// 	reader.readAsDataURL(file);
							// })));
							const images = await Promise.all(Array.from(files).map(async (file) => {
								const url = URL.createObjectURL(file);
								const image = new Image();
								await new Promise<void>((resolve) => {
									image.onload = () => {
										resolve();
									};
									image.src = url;
								});
								return {
									url,
									name: file.name,
									width: image.width,
									height: image.height,
								};
							}));
							setImages((prev) => [...prev, ...images]);
						}}
						style={{ display: "none" }}
						ref={fileRef}
					/>
					<button onClick={(e) => {
						e.preventDefault();
						fileRef.current!.click();
					}}>Add Image</button>
					<button onClick={(e) => {
						e.preventDefault();
						ref.current!.contentWindow!.print();
					}}>Preview / Print</button>
				</div>
			</form>
			<h2>File List</h2>
			<ul>
				{images.map(({name, url}) => <li key={name}>
					<span>{name}</span>
					<button
						onClick={(e) => {
							e.preventDefault();
							setImages((prev) => prev.filter((image) => image.url !== url));
						}}
					>
						Remove
					</button>
				</li>)}
			</ul>
		</div>

		<div className="right">
			<PrintBox
				ref={ref}
				pages={images.map((image) => ({
					src: image.url,
					anchor,
					width: `${image.width / dpi}in`,
					filter: `brightness(${brightness}) contrast(${contrast})`,
				}))}
				style={{
					// display: "none",
					width: "100%",
					height: "100%",
					overflow: "scroll",
				}}
			/>
		</div>

	</ div>
};
