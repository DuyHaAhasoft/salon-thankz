<template>
	<div>
		<ul>
			<li
				v-for="category in categories"
				:key="category.orderNo"
				@click="
					handleGetPrepaidServiceByCategory(
						category.serviceCategoryId,
						category.serviceCategoryName
					)
				"
			>
				{{ category.serviceCategoryName }}
			</li>
		</ul>
		<ul>
			<li v-for="good in goodList" :key="good.prepaidServiceId">
				{{ good.prepaidServiceName }}
			</li>
		</ul>
		<button @click="handleGetUserPrepaidService">User P.Service</button>
	</div>
</template>

<script>
export default {
	props: {
		categories: {
			type: Array,
			default: function () {
				return [];
			},
		},

		goodList: {
			type: Array,
			default: function () {
				return [];
			},
		},
	},

	methods: {
		handleGetPrepaidServiceByCategory(serviceCategoryId, serviceCategoryName) {
			this.$emit("handleGetPrepaidServiceByCategory", {
				serviceCategoryId,
				serviceCategoryName,
			});
		},

		handleGetUserPrepaidService() {
			this.$emit("handleGetUserPrepaidService");
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./SelectPrepaidService.scss";
</style>
