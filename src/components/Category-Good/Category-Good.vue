<template>
	<div class="category-good">
		<div>{{isTypeGood}}</div>
		<div class="category">
			<div v-if="isTypeGood.products">
				<div
					v-for="category in categories"
					:key="category.orderNo"
					@click="() => handleGetProductByCategory(category.productCategoryId)"
				>
					{{ category.productCategoryName }}
				</div>
			</div>
			<div v-if="isTypeGood.services">
				<div
					v-for="category in categories"
					:key="category.orderNo"
					@click="() => handleGetServiceByCategory(category.serviceCategoryId)"
				>
					{{ category.serviceCategoryName }}
				</div>
			</div>
			<div v-if="isTypeGood.prepaidCard"></div>
			<div v-if="isTypeGood.prepaidService"></div>
			<div v-if="isTypeGood.packages"></div>
		</div>
		<div class="good">
			<div v-if="isTypeGood.products">
				<div v-for="good in goodList" :key="good.productId">
					{{ good.productName }}
				</div>
			</div>
			<div v-if="isTypeGood.services">
				<div v-for="good in goodList" :key="good.serviceId">
					{{ good.serviceName }}
				</div>
			</div>
			<div v-if="isTypeGood.prepaidCard"></div>
			<div v-if="isTypeGood.prepaidService"></div>
			<div v-if="isTypeGood.packages"></div>
		</div>
	</div>
</template>

<script>
import constant from "@constant";

export default {
	name: "SalonThankzCategoryGood",

	data() {
		return {};
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

		typeGood: {
			type: Number,
			default: 0,
		},
	},

	computed: {
		isTypeGood() {
			return {
				products: this.typeGood === constant.sales.products,
				packages: this.typeGood === constant.sales.packages,
				services: this.typeGood === constant.sales.services,
				prepaidCard: this.typeGood === constant.sales.prepaidCard,
				prepaidService: this.typeGood === constant.sales.prepaidService,
			};
		},
	},

	mounted() {
		console.log("log", this.categories, this.isTypeGood);
	},

	methods: {
		handleGetServiceByCategory(serviceCategoryId) {
			this.$emit("handleGetServiceByCategory", serviceCategoryId);
		},

		handleGetProductByCategory(productCategoryId) {
			this.$emit("handleGetProductByCategory", productCategoryId);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Category-Good.scss";
</style>
