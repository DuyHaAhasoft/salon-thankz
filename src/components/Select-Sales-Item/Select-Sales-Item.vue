<template>
	<div class="select-sales-item">
		<b-modal
			static
			size="xl"
			hide-footer
			:title="title"
			@hide="resetModal"
			header-bg-variant="info"
			ref="selectSalesItemModal"
			:no-close-on-backdrop="true"
			:modal-class="'modal select-sales-item-modal__modal'"
		>
			<div class="modal__content">
				<div class="content__list-good">
					<good-type
						:goodTypeSelected="goodTypeSelected"
						@handleGoodTypeSelect="handleGetGoodCategory"
					/>
				</div>
				<div class="content__body">
					<div class="body__category-item">
						<category-good
							:typeGood="typeGood"
							:goodList="dataGoodList"
							:categories="dataCategories"
							:categorySelected="categorySelected"
							@handleAddGoodSelected="handleAddGoodSelected"
							@handleGetServiceByCategory="handleGetServiceByCategory"
							@handleGetProductByCategory="handleGetProductByCategory"
						/>
					</div>
					<div class="body__group-button-list-item-select">
						<div class="group-button-list-item-select__group-button">
							<group-button
								:nameButton="nameButton"
								@cancel="handleCloseModal"
								:isShowButton="isShowButton"
								@confirm="handleConfirmItemSelected"
							/>
						</div>
						<div class="group-button-list-item-select__list-item-select">
							<div class="list-item-select__select-staff"></div>
							<div class="list-item-select__list-item" v-if="iShowSelectedItem">
								<div class="list-item__title">{{ goodTypeSelectedName }} Selected</div>
								<good-selected
									:isTypeGood="isTypeGood"
									:goodListSelected="goodListSelectedShow"
									@handleDeleteItemSelected="handleDeleteItemSelected"
									/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</b-modal>
	</div>
</template>

<script>
import constant from "@constant";

//Components
import GoodType from "@components/Good-Type/Good-Type.vue";
import GroupButton from "@components/Group-Button/Group-Button.vue";
import GoodSelected from "@components/GoodSelected/GoodSelected.vue";
import CategoryGood from "@components/Category-Good/Category-Good.vue";

// const DEFAULT_DATA_CATEGORY = {
// 	categoryService: {},
// 	categoryProduct: {}
// }

const DEFAULT_CATEGORY_SELECTED = {
	id: 0,
	name: "",
};

export default {
	name: "SalonThankzSalesAction",

	data() {
		return {
			typeGood: 1,
			goodList: [],
			categories: [],
			goodListSelected: {},
			goodListSelectedShow: [],
			iShowSelectedItem: false,
			title: "Select Sales Item",
			windowWidth: window.innerWidth,
			categorySelected: Object.assign({}, DEFAULT_CATEGORY_SELECTED),
			goodTypeSelected: Object.values(constant.sales.itemSalesType)[0].id,
			goodTypeSelectedName: Object.values(constant.sales.itemSalesType)[0].text,
		};
	},

	components: {
		GoodType,
		GroupButton,
		CategoryGood,
		GoodSelected,
	},

	props: {
		dataCategories: {
			type: Array,
			default: function () {
				return [];
			},
		},

		dataGoodList: {
			type: Array,
			default: function () {
				return [];
			},
		},
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

		isShowModal() {
			return this.dataCategories;
		},

		isShowButton() {
			return {
				confirm: true,
				delete: false,
				cancel: true,
			};
		},

		nameButton() {
			return {
				confirm: "Confirm",
				cancel: "Cancel",
			};
		},

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

	watch: {
		goodTypeSelected: function (before, after) {
			if (before !== after) {
				this.goodListSelected = {};
				this.iShowSelectedItem = false;
				this.goodListSelectedShow = [];
			}
		},
	},

	methods: {
		showModal(dataModal) {
			this.typeGood = dataModal.typeGood;
			this.goodList = dataModal.goodList;
			this.categories = dataModal.categories;
			this.goodTypeSelected = dataModal.typeGood;

			const itemSalesTypeArray = Object.values(constant.sales.itemSalesType)
			this.goodTypeSelectedName = itemSalesTypeArray[itemSalesTypeArray.findIndex(item =>  item.id === this.goodTypeSelected)].text

			if (this.isShowModal) {
				this.$refs.selectSalesItemModal &&
					this.$refs.selectSalesItemModal.show();
			}
		},

		hideModal() {
			this.$refs.selectSalesItemModal && this.$refs.selectSalesItemModal.hide();
		},

		handleGetGoodCategory(typeGood) {
			if (confirm("Change Data") === true) {
				this.typeGood = typeGood;
				this.goodTypeSelected = typeGood;

				const itemSalesTypeArray = Object.values(constant.sales.itemSalesType)
				this.goodTypeSelectedName = itemSalesTypeArray[itemSalesTypeArray.findIndex(item =>  item.id === this.goodTypeSelected)].text
				

				if (typeGood === constant.sales.services) {
					this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
					this.handleGetServiceCategory();
				}

				if (typeGood === constant.sales.products) {
					this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
					this.handleGetProductCategory();
				}
			}
		},

		async handleGetServiceCategory() {
			this.$emit("getServiceCategory");
		},

		async handleGetProductCategory() {
			this.$emit("getProductCategory");
		},

		async handleGetProductByCategory({
			productCategoryId = 0,
			productCategoryName = "",
		}) {
			this.categorySelected = {
				id: productCategoryId,
				name: productCategoryName,
			};
			this.$emit("getProductByCategory", productCategoryId);
		},

		async handleGetServiceByCategory({
			serviceCategoryId = 0,
			serviceCategoryName = "",
		}) {
			this.categorySelected = {
				id: serviceCategoryId,
				name: serviceCategoryName,
			};

			this.$emit("getServiceByCategory", serviceCategoryId);
		},

		resetModal() {
			this.typeGood = 1;
			this.goodListSelected = {};
			this.iShowSelectedItem = false;
			this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
			this.goodTypeSelected = Object.values(constant.sales.itemSalesType)[0].id;
			this.goodTypeSelectedName = Object.values(constant.sales.itemSalesType)[0].text,

			this.$emit("resetGoodType");
			this.$emit("resetDataCategoryGood");
		},

		handleAddGoodSelected({ good, type, category }) {
			let keyGoodSelectedObj;

			if (type === 1) keyGoodSelectedObj = good.serviceId.toString();
			else if (type === 2) keyGoodSelectedObj = good.productId.toString();

			if (this.goodListSelected[keyGoodSelectedObj]) {
				this.goodListSelected[keyGoodSelectedObj].qty += 1;
			} else {
				this.goodListSelected[keyGoodSelectedObj] = {
					qty: 1,
					type: type,
					goodInfo: good,
					categoryInfo: category,
				};
			}

			this.goodListSelectedShow = Object.values(this.goodListSelected);

			this.iShowSelectedItem = true;
		},

		handleDeleteItemSelected(itemDelete) {
			delete this.goodListSelected[itemDelete];

			this.goodListSelectedShow = Object.values(this.goodListSelected);

			if (!this.goodListSelectedShow.length) {
				this.iShowSelectedItem = false;
			}
		},

		handleConfirmItemSelected() {
			// const listItemSelected = this.goodListSelectedShow;
			this.$emit("confirmItemSelected", this.goodListSelected);
			this.$refs.selectSalesItemModal.hide();
		},

		handleCloseModal() {
			this.hideModal();
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Select-Sales-Item.scss";
</style>
