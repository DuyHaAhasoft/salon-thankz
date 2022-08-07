<template>
	<div class="select-prepaid-service">
		<div class="type-show-prepaid-service">
			<button class="btn btn--sales" @click="handleGetSalePrepaidService">
				Sale Prepaid Services
			</button>
			<button class="btn btn--uses" @click="handleGetUserPrepaidService">
				Deduct Prepaid Services
			</button>
		</div>
		<div class="category-prepaid-service">
			<div class="category">
				<div class="title category__title">Category</div>
				<div class="list-category">
					<div
						v-for="category in categories"
						:key="category.orderNo"
						class="category__info"
						:class="{
							'category__info--selected':
								category.serviceCategoryId === categoryIdSelected,
						}"
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
			</div>
			<div class="card">
				<div class="title card__title">Prepaid Service</div>
				<div class="list-card">
					<div
						v-for="good in goodList"
						:key="good.prepaidServiceId"
						class="card__info"
					>
						{{ good.prepaidServiceName }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			categoryIdSelected: this.categories?.[0]?.serviceCategoryId ?? 0,
		};
	},

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

	// beforeUpdate() {
	// 	this.handleGetSalePrepaidService();
	// },

	methods: {
		handleGetPrepaidServiceByCategory(serviceCategoryId, serviceCategoryName) {
			this.categoryIdSelected = serviceCategoryId;

			this.$emit("handleGetPrepaidServiceByCategory", {
				serviceCategoryId,
				serviceCategoryName,
			});
		},

		handleGetSalePrepaidService() {
			const categoryFirst = this.categories?.[0] ?? {};

			const categoryDefault = {
				serviceCategoryId: categoryFirst?.serviceCategoryId ?? 0,
				serviceCategoryName: categoryFirst?.serviceCategoryName ?? "",
			};

			this.serviceCategoryId = categoryDefault.serviceCategoryId;

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
