<template>
	<div class="select-prepaid-service">
		<div class="type-show-prepaid-service">
			<button class="btn btn--sales" @click="handleGetSalePrepaidService">Sale Prepaid Services</button>
			<button class="btn btn--uses" @click="handleGetUserPrepaidService">Deduct Prepaid Services</button>
		</div>
		<div class="category-prepaid-service">
			<div class="category">
				<div class="title category--title">Category</div>
				<div
					v-for="category in categories"
					:key="category.orderNo"
					class=" category--info"
					@click="
						handleGetPrepaidServiceByCategory(
							category.serviceCategoryId,
							category.serviceCategoryName
						)
					"
				>
					{{ category.serviceCategoryName }}
				</div>
			</div>
			<div>
				<div>Prepaid Service</div>
				<div v-for="good in goodList" :key="good.prepaidServiceId">
					{{ good.prepaidServiceName }}
				</div>
			</div>
		</div>
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

		handleGetSalePrepaidService() {
			const categoryFrist = this.categories?.[0] ?? {}

			const categoryDefault = {
				serviceCategoryId: categoryFrist?.serviceCategoryId ?? 0,
				serviceCategoryName: categoryFrist?.serviceCategoryName ?? ''
			}

			this.$emit("handleGetPrepaidServiceByCategory", {
				serviceCategoryId: categoryDefault.serviceCategoryId,
				serviceCategoryName: categoryDefault.serviceCategoryName,
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
