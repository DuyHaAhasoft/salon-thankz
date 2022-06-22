<template>
	<div class="select-sales-item">
		<b-modal
			static
			size="xl"
			hide-footer
			:title="title"
			header-bg-variant="info"
			ref="selectSalesItemModal"
			:no-close-on-backdrop="true"
			:modal-class="'modal select-sales-item-modal__modal'"
		>
			<div class="modal__content">
				<div class="content__list-good">
					<good-type @handleGoodTypeSelect="handleGetGoodCategory" />
				</div>
				<div class="content__body">
					<div class="body__category-item">
						<category-good
							:goodList="goodList"
							:typeGood="typeGood"
							:categories="categories"
							@handleGetServiceByCategory="handleGetServiceByCategory"
							@handleGetProductByCategory="handleGetProductByCategory"
						/>
					</div>
					<div class="body__group-button-list-item-select">
						<div class="group-button-list-item-select__group-button">
							<group-button />
						</div>
						<div class="group-button-list-item-select__list-item-select">
							<div class="list-item-select__select-staff"></div>
							<div class="list-item-select__list-item"></div>
						</div>
					</div>
				</div>
			</div>
		</b-modal>
	</div>
</template>

<script>
import constant from "@constant";
import apis from "../../lib/apis";
import session from "@/lib/utils/session";

//Components
import GoodType from "@components/Good-Type/Good-Type.vue";
import GroupButton from "@components/Group-Button/Group-Button.vue";
import CategoryGood from "@components/Category-Good/Category-Good.vue";

// const DEFAULT_DATA_CATEGORY = {
// 	categoryService: {},
// 	categoryProduct: {}
// }

export default {
	name: "SalonThankzSalesAction",

	data() {
		return {
			typeGood: 0,
			goodList: [],
			categories: [],
			title: "Select Sales Item",
			windowWidth: window.innerWidth,
		};
	},

	components: {
		GoodType,
		GroupButton,
		CategoryGood,
	},

	mounted() {
		this.handleGetServiceCategory();
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
		showModal() {
			this.handleGetServiceCategory();
			this.$refs.selectSalesItemModal && this.$refs.selectSalesItemModal.show();
		},

		hideModal() {
			this.$refs.selectSalesItemModal && this.$refs.selectSalesItemModal.hide();
		},

		handleGetGoodCategory(typeGood) {
			console.log(typeGood);
			this.typeGood = typeGood;

			if (typeGood === constant.sales.services) {
				this.handleGetServiceCategory();
			}

			if (typeGood === constant.sales.products) {
				this.handleGetProductCategory();
			}
		},

		async handleGetServiceCategory() {
			const data = {
				pageNumber: 1,
				pageSize: 100,
				shopId: session.shopSession.getShopId(),
				status: 1,
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
@import "./Select-Sales-Item.scss";
</style>
