import body from "./_body.ts";

export default (images: string[]) =>
	body(`
<div class="d-flex justify-content-center align-items-center min-vh-100 flex-column">
	${
		images.map((image, index) =>
			`<img class='img-fluid w-100' src="/asset/${image}" alt="img-${index}" />`
		).join("")
	}
</div>
`);
