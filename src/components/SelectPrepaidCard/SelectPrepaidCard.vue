<template>
	<div>
		<ul>
			<li v-for="good in goodList" :key="good.prepaidCardId">
				{{ good.prepaidCardName }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		goodList: {
			type: Array,
			default: function () {
				return [];
			},
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./SelectPrepaidCard.scss";
</style>
