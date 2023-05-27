import body from "./_body.ts";

const CDN = "https://images.weserv.nl/?q=100&maxage=31d&url=";

export default (images: string[]) =>
	body(`
<div id="carouselIndicators" class="carousel slide bg-dark" data-bs-ride="true">
	<div class="carousel-indicators">
		${images.map(
			(_image, index) =>
				`
				<button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="${index}" ` +
				(index === 0 ? 'class="active" aria-current="true"' : '') +
				` aria-label="Slide ${
					index + 1
				}"></button>
		`
		).join("")}
	</div>
	<div class="carousel-inner">
		${images
			.map(
				(image, index) =>
					`
					<div class="carousel-item ` +
					(index === 0 ? "active" : "") +
					`">
						<img class="d-block vh-100 vw-100 object-fit-contain" src="${CDN}${window.location.host}/asset/${image}" alt="img-${index}">
					</div>
					`
			)
			.join("")}
	</div>
	<button class="carousel-control-prev" type="button" data-bs-target="#carouselIndicators" data-bs-slide="prev">
		<span class="carousel-control-prev-icon" aria-hidden="true"></span>
		<span class="visually-hidden">Previous</span>
	</button>
	<button class="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
		<span class="carousel-control-next-icon" aria-hidden="true"></span>
		<span class="visually-hidden">Next</span>
	</button>
</div>
`);
