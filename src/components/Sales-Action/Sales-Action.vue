<template>
	<div class="sales-action">
		<b-modal
			static
			size="xl"
			hide-footer
			ref="salesActionModal"
			header-bg-variant="info"
			:title="typeAction.text"
			:no-close-on-backdrop="true"
			:modal-class="'modal sales-action-modal__modal'"
		>
			<div v-if="!typeAction.type"></div>

			<div v-else>
				<div>Edit Sales</div>
			</div>
		</b-modal>

		<select-sales-item 
			ref="refSelectSalesItem"
			:dataGoodList="goodList"
			:dataCategories="categories"
			@loading="handleSetLoading" 
			@getServiceCategory="handleGetServiceCategory"
			@getProductCategory="handleGetProductCategory"
			@getProductByCategory="handleGetProductByCategory"
			@getServiceByCategory="handleGetServiceByCategory"
		/>
		<!-- <loading /> -->
	</div>
</template>

<script>
import constant from "@constant";
import apis from "../../lib/apis";
import session from "@/lib/utils/session";

//Components
// import Loading from "@components/Loading/Loading.vue";
import SelectSalesItem from "@components/Select-Sales-Item/Select-Sales-Item.vue";

const DEFAULT_SALES_ACTION_TYPE = [
	{
		type: 0,
		text: "Add Sales",
	},
	{
		type: 1,
		text: "Edit Sales",
	},
];

export default {
	name: "SalonThankzSalesAction",

	data() {
		return {
			title: "",
			goodList: [],
			categories: [],
			typeAction: {},
			windowWidth: window.innerWidth,
		};
	},

	components: {
		// Loading,
		SelectSalesItem,
	},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", this.onResize);
		});
	},

	beforeDestroy() {
		window.removeEventListener("resize", this.onResize);
	},

	computed: {
		statusScreenLaptop() {
			return this.windowWidth > constant.common.screenSize.maxScreenLaptop;
		},
	},

	methods: {
		showModal(dataModal) {
			this.typeAction =
				DEFAULT_SALES_ACTION_TYPE[
					DEFAULT_SALES_ACTION_TYPE.findIndex(
						type => type.type === dataModal.type
					)
				];

			this.$refs.salesActionModal && this.$refs.salesActionModal.show();

			if (!this.typeAction.type) {
				this.handleGetServiceCategory();
				console.log('abc', this.categories)
				this.$refs.refSelectSalesItem &&
					this.$refs.refSelectSalesItem.showModal({
						goodList: this.goodList,
						categories: this.categories,
					});
			}
				
		},

		hideModal() {
			this.$refs.salesActionModal && this.$refs.salesActionModal.hide();
		},

		handleSetLoading(value) {
			this.$emit('loading', value);
		},

		async handleGetServiceCategory() {
			const data = {
				status: 1,
				pageSize: 100,
				pageNumber: 1,
				shopId: session.shopSession.getShopId(),
			};

			this.$emit("loading", true);

			try {
				const res = await apis.goodApis.getServiceCategory(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					this.categories = res.data.result.items;
				} else {
					console.log("error", res);
				}

				console.log("res services", res);

				this.$emit("loading", false);
			} catch (errors) {
				console.log("errors", errors);
			}
		},

		async handleGetProductCategory() {
			const data = {
				pageNumber: 1,
				pageSize: 100,
				shopId: session.shopSession.getShopId(),
				status: 1,
			};

			this.$emit("loading", true);

			try {
				const res = await apis.goodApis.getProductCategory(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					this.categories = res.data.result.items;
				} else {
					console.log("error", res);
				}

				console.log("res products", res);

				this.$emit("loading", false);
			} catch (errors) {
				console.log("errors", errors);
			}
		},

		async handleGetProductByCategory(productCategoryId = 0) {
			const data = {
				status: 1,
				keyWord: "",
				pageSize: 100,
				pageNumber: 1,
				usageStatus: "1,3",
				isCalculateValuation: false,
				productCategoryId: productCategoryId,
				shopId: session.shopSession.getShopId(),
			};

			this.$emit("loading", true);

			try {
				const res = await apis.goodApis.getProductByCategory(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					this.goodList = res.data.result.items;
				} else {
					console.log("error", res);
				}

				console.log("res list products", res);

				this.$emit("loading", false);
			} catch (errors) {
				console.log("errors", errors);
			}
		},

		async handleGetServiceByCategory(serviceCategoryId = 0) {
			const data = {
				status: 1,
				pageSize: 100,
				pageNumber: 1,
				serviceCategoryId: serviceCategoryId,
				shopId: session.shopSession.getShopId(),
			};

			this.$emit("loading", true);

			try {
				const res = await apis.goodApis.getServiceByCategory(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					this.goodList = res.data.result.items;
				} else {
					console.log("error", res);
				}

				console.log("res list products", res);

				this.$emit("loading", false);
			} catch (errors) {
				console.log("errors", errors);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Sales-Action.scss";
</style>
