<template>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@200;300;400;500;600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@200;300;400;500;600&display=swap");

:root {
	--primary: #000;
	--primary-text: #333;
	
	--weak: #f5f5f5;
	--weak-text: #999;
	
	
	--red: #e83f5b;
	
	--input-size: 2.5rem;
}

html {
	font-size: 17px;
}

body {
	font-family: -apple-system,BlinkMacSystemFont, "San Francisco","Segoe UI", Roboto, "Helvetica Neue", sans-serif;
	overflow: hidden;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

p {
	font-size: 1rem;
	color: var(--primary-text);
}


h1, h2, h3, h4, h5, h6 {
	vertical-align: middle;
	color: var(--primary-text);
}

h4 {
	font-size: 1.25rem;
}

a {
	text-decoration: none;
}

.text-overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.red-filter {
	filter: invert(33%) sepia(68%) saturate(4382%) hue-rotate(333deg) 
	brightness(101%) contrast(82%);
}

.weak-filter {
	filter: invert(20%) sepia(4%) saturate(939%) hue-rotate(202deg)
	brightness(92%) contrast(90%);
}


textarea, input {
	border-radius: 0.25rem;
	padding: 0.5rem;
	
	font-family: inherit;
	font-size: 1rem;
	
	outline: none;
	border: 1px solid var(--weak);
	border-radius: 0.25rem;
	
	transition: 0.2s;
	
	resize: none;
	
	&:focus {
		border-color: var(--weak-text);
	}
}

input {
	height: var(--input-size);
}

textarea::placeholder, input::placeholder {
	color: var(--weak-text);
	opacity: 0.5;
}
</style>