<template>
	<div class="category-good">
		<div class="category">
			<div class="category__title">Category</div>
			<div v-if="isTypeGood.products">
				<div
					class="category__item"
					:key="category.orderNo"
					v-for="category in categories"
					:class="{'category__item--selected': category.productCategoryId === isCategorySelected}"
					@click="() => handleGetProductByCategory(category.productCategoryId, category.productCategoryName)"
				>
					{{ category.productCategoryName }}
				</div>
			</div>
			<div v-if="isTypeGood.services">
				<div
					class="category__item"
					:key="category.orderNo"
					v-for="category in categories"
					:class="{'category__item--selected': category.serviceCategoryId === isCategorySelected}"
					@click="() => handleGetServiceByCategory(category.serviceCategoryId, category.serviceCategoryName)"
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
				<div class="good__title">{{ categorySelected.id ? categorySelected.name : (categories.length && categories[0].productCategoryName) }}</div>
				<div class="good__item" v-for="good in goodList" :key="good.productId" @click="handleAddGood(good, 2)">
					<span>{{ good.productName }}</span><span class="item__price">({{ handleFormatNumber(good.retailPrice) }})</span>
				</div>
			</div>
			<div v-if="isTypeGood.services">
				<div class="good__title">{{ categorySelected.id ? categorySelected.name : (categories.length && categories[0].serviceCategoryName) }}</div>
				<div class="good__item" v-for="good in goodList" :key="good.serviceId" @click="handleAddGood(good, 1)">
					<span>{{ good.serviceName }}</span><span class="item__price">({{ handleFormatNumber(good.price) }})</span>
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
import common from "@/lib/utils/common";

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
			default: 1,
		},

		categorySelected: {
			type: Object,
			default: function() {
				return {
					id: 0,
					name: ''
				}
			}
		}
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

		isCategorySelected() {
			if(this.categorySelected.id === 0) {
				return this.typeGood === 1 ? this.categories?.[0]?.serviceCategoryId : this.categories?.[0]?.productCategoryId
			}
			return this.categorySelected.id
		}
	},

	mounted() {},

	methods: {
		handleGetServiceByCategory( serviceCategoryId, serviceCategoryName ) {
			this.$emit("handleGetServiceByCategory", { serviceCategoryId, serviceCategoryName });
		},

		handleGetProductByCategory(productCategoryId, productCategoryName) {
			this.$emit("handleGetProductByCategory", { productCategoryId, productCategoryName});
		},

		handleFormatNumber(data) {
			let number = 0;
			if(data > 0){
				number = common.commonFunctions.formatMoneyNumber(data);
			}
			return number
		},

		handleAddGood(good = null, type = 0) {
			this.$emit('handleAddGoodSelected', { good, type })
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Category-Good.scss";
</style>
