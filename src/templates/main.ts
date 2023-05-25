import body from "./_body.ts";

export default (message: string, messageAlt: string | null) =>
	body(`
<div class="d-flex justify-content-center align-items-center min-vh-100 flex-column">
	<h1>${message}</h1>
	${messageAlt ? `<h2>${messageAlt}</h2>` : ""}
</div>
<script>
	window.onload = () => {
		console.log("Dokážeš najít easter egg? 🤔");
	};
</script
`);
