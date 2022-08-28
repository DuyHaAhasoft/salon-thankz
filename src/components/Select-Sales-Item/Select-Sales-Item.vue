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
							v-if="!isPGood.isPGood && !isPackages"
							:typeGood="typeGood"
							:goodList="dataGoodList"
							:categories="dataCategories"
							:categorySelected="categorySelected"
							@handleAddGoodSelected="handleAddGoodSelected"
							@handleGetServiceByCategory="handleGetServiceByCategory"
							@handleGetProductByCategory="handleGetProductByCategory"
						/>
						<select-prepaid-card
							v-if="isPGood.isPGood && isPGood.isPCard"
							:goodList="dataGoodList"
							@handleSelectPrepaidCard="handleSelectPrepaidCard"
						/>
						<select-prepaid-service
							v-if="isPGood.isPGood && isPGood.isPService"
							:goodList="dataGoodList"
							:categories="dataCategories"
							@handleGetPrepaidServiceByCategory="
								handleGetPrepaidServiceByCategory
							"
							@handleSelectPrepaidService="handleSelectPrepaidService"
							@handleGetUserPrepaidService="handleGetUserPrepaidService"
							@handleSelectDeductPrepaidService="handleSelectDeductPrepaidService"
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
						<div
							v-if="!isPGood.isPGood"
							class="group-button-list-item-select__list-item-select"
						>
							<div class="list-item-select__select-staff"></div>
							<div class="list-item-select__list-item" v-if="iShowSelectedItem">
								<div class="list-item__title">
									{{ goodTypeSelectedName }} Selected
								</div>
								<good-selected
									v-if="!isPGood.isPGood && !isPackages"
									:isTypeGood="isTypeGood"
									:goodListSelected="goodListSelectedShow"
									@handleDeleteItemSelected="handleDeleteItemSelected"
								/>
							</div>
						</div>

						<div class="prepaid-service-selected" v-if="isPrepaidServiceSelected.isPService && isPrepaidServiceSelected.isPServiceSelected && showSelectPService">
							<div class="prepaid-service-selected__title">
								{{
									goodListSelectedShow[0] &&
									goodListSelectedShow[0].goodInfo.prepaidServiceName
								}}
							</div>
							<div class="prepaid-service-selected__deduct">
								<b-form-checkbox
									value="1"
									unchecked-value="0"
									v-model="isDeductService"
									id="checkbox-deduct-service"
									name="checkbox-deduct-service"
								>
									Use Now
								</b-form-checkbox>
								<div v-if="isDeductService" class="deduct-quantity">
									<span>Deduct Quantity</span>
									<input type="number" v-model="deductionPService" />
								</div>
							</div>
						</div>

						<div v-if="isPrepaidServiceSelected.isPService && isPrepaidServiceSelected.isDeductPrepaidService && !showSelectPService">
							<div class="list-item-select__list-item" v-if="iShowSelectedItem">
								<div class="list-item__title">
									Services
								</div>
								<good-selected
									:isTypeGood="isTypeGood"
									:maxQtyDeduct="maxQtyDeduct"
									:goodListSelected="goodListSelectedShow"
									@handleDeleteItemSelected="handleDeleteItemSelected"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</b-modal>

		<notification modalTitle="Notification" ref="refNotification" />
		<confirm-modal
			ref="refConfirmModal"
			@confirm="handleGetGoodCategoryChangeData"
		/>
	</div>
</template>

<script>
import constant from "@constant";

//Components
import GoodType from "@components/Good-Type/Good-Type.vue";
import GroupButton from "@components/Group-Button/Group-Button.vue";
import GoodSelected from "@components/GoodSelected/GoodSelected.vue";
import Notification from "@components/Notification/Notification.vue";
import CategoryGood from "@components/Category-Good/Category-Good.vue";
import ConfirmModal from "@components/Confirm-Modal/Confirm-Modal.vue";
import SelectPrepaidCard from "@components/SelectPrepaidCard/SelectPrepaidCard.vue";
import SelectPrepaidService from "@components/SelectPrepaidService/SelectPrepaidService.vue";

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
			typeGoodTemp: 0,
			maxQtyDeduct: 0,
			goodListSelected: {},
			deductionPService: 0,
			isDeductService: false,
			goodListSelectedShow: [],
			iShowSelectedItem: false,
			showSelectPService: true,
			title: "Select Sales Item",
			isShowDeductService: false,
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
		Notification,
		ConfirmModal,
		SelectPrepaidCard,
		SelectPrepaidService,
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

		isPGood() {
			const isPCard = this.typeGood === constant.sales.prepaidCard;
			const isPService = this.typeGood === constant.sales.prepaidService;
			return {
				isPGood: isPCard || isPService,
				isPCard,
				isPService,
			};
		},

		isPackages() {
			return this.typeGood === constant.sales.packages;
		},

		isPrepaidServiceSelected() {
			const isPServiceSelected = this.goodListSelectedShow?.[0]?.type !== constant.sales.useDeductPService;
			const prepaidServiceSelected = this.isPGood.isPGood && this.isPGood.isPService && this.goodListSelectedShow.length;

			return 	{
				isPServiceSelected,
				isPService: prepaidServiceSelected,
				isDeductPrepaidService: !isPServiceSelected,
			}
		}
	},

	watch: {
		goodTypeSelected: function (before, after) {
			if (before !== after) {
				this.goodListSelected = {};
				this.iShowSelectedItem = false;
				this.goodListSelectedShow = [];
			}
		},

		isDeductService: function (value) {
			this.isDeductService = Number(value);
		},

		deductionPService: function (value) {
			const prepaidServiceInfo = Object.values(this.goodListSelected)[0];
			if (value > prepaidServiceInfo?.goodInfo?.quantity) {
				this.deductionPService = Number(prepaidServiceInfo?.goodInfo?.quantity || 0);
			}
		}
	},

	methods: {
		showModal(dataModal) {
			this.typeGood = dataModal.typeGood;
			this.goodList = dataModal.goodList;
			this.categories = dataModal.categories;
			this.goodTypeSelected = dataModal.typeGood;

			const itemSalesTypeArray = Object.values(constant.sales.itemSalesType);
			this.goodTypeSelectedName =
				itemSalesTypeArray[
					itemSalesTypeArray.findIndex(
						item => item.id === this.goodTypeSelected
					)
				].text;

			if (this.isShowModal) {
				this.$refs.selectSalesItemModal &&
					this.$refs.selectSalesItemModal.show();
			}
		},

		hideModal() {
			this.$refs.selectSalesItemModal && this.$refs.selectSalesItemModal.hide();
		},

		handleGetGoodCategory(typeGood) {
			if (typeGood === constant.sales.packages) {
				this.handleNotification();
				return;
			}
			if (this.goodListSelectedShow.length === 0) {
				this.typeGood = typeGood;
				this.goodTypeSelected = typeGood;

				const itemSalesTypeArray = Object.values(constant.sales.itemSalesType);
				this.goodTypeSelectedName =
					itemSalesTypeArray[
						itemSalesTypeArray.findIndex(
							item => item.id === this.goodTypeSelected
						)
					].text;

				this.deductionPService = 0;

				if (typeGood === constant.sales.services) {
					this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
					this.handleGetServiceCategory();
				}

				if (typeGood === constant.sales.products) {
					this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
					this.handleGetProductCategory();
				}
				if (typeGood === constant.sales.prepaidCard) {
					this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
					this.handleGetPrepaidCard();
				}
				if (typeGood === constant.sales.prepaidService) {
					this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
					this.handleGetServiceCategory(typeGood);
				}
			} else {
				this.typeGoodTemp = typeGood;

				if (
					this.goodTypeSelected === constant.sales.prepaidCard ||
					this.goodTypeSelected === constant.sales.prepaidService
				) {
					this.handleGetGoodCategoryChangeData();
				} else {
					this.$refs.refConfirmModal.showModal({
						title: "Change category",
						message:
							"The selected data is not saved when you move the tab. Do you want to move?",
					});
				}
				// this.typeGood = typeGood;
				// this.goodTypeSelected = typeGood;

				// const itemSalesTypeArray = Object.values(constant.sales.itemSalesType);
				// this.goodTypeSelectedName =
				// 	itemSalesTypeArray[
				// 		itemSalesTypeArray.findIndex(
				// 			item => item.id === this.goodTypeSelected
				// 		)
				// 	].text;

				// if (typeGood === constant.sales.services) {
				// 	this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
				// 	this.handleGetServiceCategory();
				// }

				// if (typeGood === constant.sales.products) {
				// 	this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
				// 	this.handleGetProductCategory();
				// }
			}
		},

		handleGetGoodCategoryChangeData() {
			if (this.typeGood === constant.sales.packages) {
				this.handleNotification();
				return;
			}

			this.typeGood = this.typeGoodTemp;
			this.goodTypeSelected = this.typeGoodTemp;

			const itemSalesTypeArray = Object.values(constant.sales.itemSalesType);
			this.goodTypeSelectedName =
				itemSalesTypeArray[
					itemSalesTypeArray.findIndex(
						item => item.id === this.goodTypeSelected
					)
				].text;

			this.deductionPService = 0;

			if (this.typeGoodTemp === constant.sales.services) {
				this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
				this.handleGetServiceCategory();
			}

			if (this.typeGoodTemp === constant.sales.products) {
				this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
				this.handleGetProductCategory();
			}

			if (this.typeGoodTemp === constant.sales.prepaidCard) {
				this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
				this.handleGetPrepaidCard();
			}
			if (this.typeGoodTemp === constant.sales.prepaidService) {
				this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
				this.handleGetServiceCategory(this.typeGood);
			}

			this.typeGoodTemp = 0;
		},

		async handleGetServiceCategory(typeGood = 1) {
			this.$emit("getServiceCategory", typeGood);
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

		async handleGetPrepaidCard() {
			this.$emit("getPrepaidCard");
		},

		async handleGetPrepaidServiceByCategory({
			serviceCategoryId = 0,
			serviceCategoryName = "",
		}) {
			this.showSelectPService = true;

			this.goodListSelected = {};
			this.goodListSelectedShow = [];

			this.categorySelected = {
				id: serviceCategoryId,
				name: serviceCategoryName,
			};

			this.$emit("getPrepaidServiceByCategory", serviceCategoryId);
		},

		handleGetUserPrepaidService() {
			this.showSelectPService = false;

			this.goodListSelected = {};
			this.goodListSelectedShow = [];

			this.$emit("getUserPrepaidService");
		},

		resetModal() {
			this.typeGood = 1;
			this.typeGoodTemp = 0;
			this.maxQtyDeduct = 0;
			this.goodListSelected = {};
			this.deductionPService = 0;
			this.iShowSelectedItem = false;
			this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
			this.goodTypeSelected = Object.values(constant.sales.itemSalesType)[0].id;
			(this.goodTypeSelectedName = Object.values(
				constant.sales.itemSalesType
			)[0].text),
				this.$emit("resetGoodType");
			this.$emit("resetDataCategoryGood");
		},

		handleAddGoodSelected({ good, type, category = {} }) {
			let keyGoodSelectedObj;

			if (type === constant.sales.services)
				keyGoodSelectedObj = good.serviceId.toString();
			else if (type === constant.sales.products)
				keyGoodSelectedObj = good.productId.toString();
			else if (type === constant.sales.prepaidCard)
				keyGoodSelectedObj = good.prepaidCardId.toString();
			else if (type === constant.sales.prepaidService) {
				this.deductionPService = 0;
				keyGoodSelectedObj = good.prepaidServiceId.toString();
			}

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

		handleSelectPrepaidCard(prepaidCard) {
			this.goodListSelected = {};
			this.goodListSelectedShow = [];

			this.handleAddGoodSelected({
				good: prepaidCard,
				type: constant.sales.prepaidCard,
				category: {},
			});
		},

		handleSelectPrepaidService({ prepaidService, category = {} }) {
			this.goodListSelected = {};
			this.goodListSelectedShow = [];

			this.handleAddGoodSelected({
				good: prepaidService,
				type: constant.sales.prepaidService,
				category,
			});
		},

		handleSelectDeductPrepaidService({prepaidServiceDeduct, category}) {
			this.goodListSelected = {};
			this.goodListSelectedShow = [];

			this.maxQtyDeduct = prepaidServiceDeduct.quantity;

			this.handleAddGoodSelected({
				good: prepaidServiceDeduct,
				type: constant.sales.useDeductPService,
				category,
			});
		},

		async handleConfirmItemSelected() {
			// const listItemSelected = this.goodListSelectedShow;
			const checkPService = this.isPGood.isPGood && this.isPGood.isPService;
			if (checkPService && this.deductionPService) {
				await this.goodDeductionPService();
			}
			this.$emit("confirmItemSelected", this.goodListSelected);
			this.$refs.selectSalesItemModal.hide();
		},

		goodDeductionPService() {
			const prepaidServiceInfo = Object.values(this.goodListSelected)[0];
			const keyGoodSelectedObj =
				prepaidServiceInfo.goodInfo.relatedServiceId.toString();

			this.goodListSelected[keyGoodSelectedObj] = {
				qty: this.deductionPService,
				goodInfo: prepaidServiceInfo.goodInfo,
				type: constant.sales.deductionPService,
				categoryInfo: prepaidServiceInfo.categoryInfo,
			};

			this.goodListSelectedShow = Object.values(this.goodListSelected);

			this.iShowSelectedItem = true;
		},

		handleCloseModal() {
			this.hideModal();
		},

		handleNotification() {
			this.$refs.refNotification.showModal({
				listMessage: [
					{
						errorCode: "Error",
						errorMessage: "Not Support Yet!",
					},
				],
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Select-Sales-Item.scss";
</style>
