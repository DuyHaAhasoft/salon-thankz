<template>
	<div>
		<h1>{{ name }}</h1>
	</div>
</template>

<script>
export default {
	name: "HomePage",
	created() {
		// if(sessionStorage.getItem("shopInfo") === null) {
		//     this.$router.push('/login')
		// }
	},
	data() {
		return {
			name: "ThankZ",
		};
	},
};
</script>

<style scoped>
@import "./Home.scss";
</style>
