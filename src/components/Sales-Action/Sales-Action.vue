<template>
	<div class="sales-action">
		<b-modal
			static
			size="xl"
			hide-footer
			@hide="resetModal"
			ref="salesActionModal"
			header-bg-variant="info"
			:title="typeAction.text"
			:no-close-on-backdrop="true"
			:modal-class="'modal sales-action-modal__modal'"
		>
			<div v-if="!typeAction.type" class="modal__add-sales">
				<div class="add-sales__client-name">
					{{ dataClient.clientName }}
				</div>
				<div class="add-sales__select-item">
					<div class="select-item__list-category">
						<good-type
							:goodTypeSelected="goodTypeSelected"
							@handleGoodTypeSelect="handleGetGoodCategory"
							@handleShowSelectSalesItem="handleShowSelectSalesItem"
						/>
					</div>
					<div class="select-item__table">
						<table>
							<thead>
								<tr>
									<th v-for="field in fields" :key="field.text">
										{{ field.text }}
									</th>
								</tr>
							</thead>
							<tbody v-if="isShow">
								<tr :key="index" v-for="(good, index) in goodListSelectedShow">
									<td class="table__table-data table__table-data--sales-item">
										{{ good.showDataTable.salesItem }}
									</td>

									<td class="table__table-data table__table-data--unit-price">
										<input
											min="1"
											type="number"
											v-model="good.showDataTable.unitPrice"
											@change="
												handleUnitPrice(
													good.showDataTable.goodId,
													good.showDataTable.unitPrice
												)
											"
										/>
									</td>

									<td class="table__table-data table__table-data--qty">
										<input
											min="1"
											type="number"
											v-model="good.showDataTable.qTy"
											@change="
												handleQty(
													good.showDataTable.goodId,
													good.showDataTable.qTy
												)
											"
										/>
									</td>

									<td
										class="table__table-data table__table-data--unit-discount"
									>
										{{ good.showDataTable.discount }}
									</td>

									<td class="table__table-data table__table-data--amount">
										{{ good.showDataTable.amount }}
									</td>

									<td class="table__table-data table__table-data--staff">
										{{ good.showDataTable.staff }}
									</td>

									<td class="table__table-data table__table-data--sales-type">
										{{ good.showDataTable.salesType }}
									</td>

									<td
										class="table__table-data table__table-data--points-deduct"
									>
										{{ good.showDataTable.pointDeduct }}
									</td>

									<td
										class="table__table-data table__table-data--balance-deduct"
									>
										{{ good.showDataTable.balanceDeduct }}
									</td>

									<td
										class="table__table-data table__table-data--delete"
										@click="handleDeleteItemSelected(good.showDataTable.goodId)"
									>
										X
									</td>
								</tr>
							</tbody>
							<tbody v-else>
								<tr>
									<td class="table__no-data" colspan="10">No data</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="add-sales__content-footer">
					<div class="content-footer__title">Payment</div>
					<div class="content-footer__detail">
						<div class="detail__payment-detail">
							<div class="payment-detail__total-amount">
								<span class="payment-detail__title">Total Amount</span>
								<span>{{ totalAmount }}</span>
							</div>
							<div class="payment-detail__point-deduction">
								<span class="payment-detail__title">Point Deduction</span>
								<span>0</span>
							</div>
							<div class="payment-detail__balance-deduction">
								<span class="payment-detail__title">Balance Deduction</span>
								<span>0</span>
							</div>
							<div class="payment-detail__outstanding">
								<span class="payment-detail__title">Outstanding</span>
								<span>{{ outstanding }}</span>
							</div>
							<div class="payment-detail__earn-loyalty-points">
								<span class="payment-detail__title">Earn Loyalty Points</span>
								<input type="number" min="0" />
							</div>
						</div>
						<div class="detail__deduction-notes-payment-date">
							<div class="deduction-notes-payment__deduction">
								<div class="deduction__text">DEDUCTION</div>
								<div class="deduction__group-button">
									<button class="group-button__btn group-button__btn--point">Point</button>
									<button class="group-button__btn group-button__btn--balance">Balance</button>
								</div>
							</div>
							<div class="deduction-notes-payment-date__payment">
								<div class="payment__title">PAYMENT</div>
								<div class="payment__payment-method">
									<button
										:key="paymentMethod.id"
										class="payment-method__button"
										v-for="paymentMethod in paymentMethods"
										@click="handlePaymentSelected(paymentMethod)"
									>
										{{ paymentMethod.name }}
									</button>
								</div>
							</div>
							<div class="deduction-notes-payment-date__notes">
								<textarea rows="2" />
							</div>
							<div class="deduction-notes-payment-date__date">
								<span class="date__tittle">Sales Date</span>
								<v-date-picker
									v-model="registeredDate"
									:masks="masks"
									class="date-picker date__date-picker"
								>
									<template v-slot="{ inputValue, inputEvents }">
										<input
											class="input-date-picker date-picker__input-date-picker"
											:value="inputValue"
											v-on="inputEvents"
										/>
									</template>
								</v-date-picker>
								<!-- <v-date-picker mode="time" v-model="registeredTime" /> -->
							</div>
						</div>
					</div>
					<div class="content-footer__group-button">
						<group-button
							@confirm="handleAddSales"
							@cancel="hideModal"
							:isShowButton="isShowButton"
						/>
					</div>
				</div>
			</div>

			<div v-else>
				<div>Edit Sales</div>
			</div>
		</b-modal>

		<select-sales-item
			ref="refSelectSalesItem"
			:dataGoodList="goodList"
			:dataCategories="categories"
			@loading="handleSetLoading"
			@resetGoodType="handleResetGoodType"
			@getServiceCategory="handleGetServiceCategory"
			@getProductCategory="handleGetProductCategory"
			@confirmItemSelected="handleConfirmItemSelected"
			@getProductByCategory="handleGetProductByCategory"
			@getServiceByCategory="handleGetServiceByCategory"
			@resetDataCategoryGood="handleResetDataCategoryGood"
		/>
		<!-- <loading /> -->
	</div>
</template>

<script>
import common from "@common";
import constant from "@constant";
import apis from "../../lib/apis";
import session from "@/lib/utils/session";

//Components
// import Loading from "@components/Loading/Loading.vue";
import GoodType from "@components/Good-Type/Good-Type.vue";
import GroupButton from "@components/Group-Button/Group-Button.vue";
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

const DEFAULT_CATEGORY_SELECTED = {
	id: 0,
	name: "",
};

const DEFAULT_FIELD_ITEM = {
	salesItem: { text: "Sales Items" },
	unitPrice: { text: "Unit Price" },
	qTy: { text: "Q'ty" },
	discount: { text: "Discount" },
	amount: { text: "Amount" },
	staff: { text: "Staff" },
	salesType: { text: "Sales Type" },
	pointDeduct: { text: "Points Deduct" },
	balanceDeduct: { text: "Balance Deduct" },
	delete: { text: "Delete" },
};

export default {
	name: "SalonThankzSalesAction",

	data() {
		return {
			title: "",
			typeGood: 1,
			goodList: [],
			salesPaid: 0,
			categories: [],
			typeAction: {},
			dataClient: {},
			totalAmount: 0,
			outstanding: 0,
			paymentMethods: [],
			paymentSelected: [],
			goodListSelected: {},
			invoiceDateTimeTS: 0,
			goodListSelectedShow: [],
			registeredDate: Date.now(),
			registeredTime: Date.now(),
			windowWidth: window.innerWidth,
			fields: Object.assign({}, DEFAULT_FIELD_ITEM),
			categorySelected: Object.assign({}, DEFAULT_CATEGORY_SELECTED),
			goodTypeSelected: Object.values(constant.sales.itemSalesType)[0].id,

			masks: {
				input: "YYYY-MM-DD",
			},
		};
	},

	components: {
		// Loading,
		GoodType,
		GroupButton,
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

		isShow() {
			return this.goodListSelectedShow.length;
		},

		isShowButton() {
			return {
				confirm: true,
				delete: false,
				cancel: true,
			};
		},
	},

	methods: {
		showModal(dataModal) {
			// this.paymentMethods = session.saleSession.getAllPaymentMethods();
			const paymentMethodsName = ['Cash', 'Credit Card'];
			const setPaymentMethods = session.saleSession.getAllPaymentMethods();
			setPaymentMethods.forEach(paymentMethod => {
				if(paymentMethodsName.includes(paymentMethod.name)) {
					this.paymentMethods.push(paymentMethod)
				}
			})

			this.dataClient = dataModal.client;
			this.invoiceDateTimeTS = dataModal.invoiceDateTimeTS;

			this.typeAction =
				DEFAULT_SALES_ACTION_TYPE[
					DEFAULT_SALES_ACTION_TYPE.findIndex(
						type => type.type === dataModal.type
					)
				];

			this.$refs.salesActionModal && this.$refs.salesActionModal.show();

			if (!this.typeAction.type) {
				this.handleGetServiceCategory();

				this.$refs.refSelectSalesItem &&
					this.$refs.refSelectSalesItem.showModal({
						typeGood: 1,
						goodList: this.goodList,
						categories: this.categories,
					});
			}
		},

		hideModal() {
			this.$refs.salesActionModal && this.$refs.salesActionModal.hide();
		},

		handleSetLoading(value) {
			this.$emit("loading", value);
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
					this.handleGetServiceByCategory(
						res.data.result.items[0]?.serviceCategoryId
					);
				} else {
					console.log("error", res);
				}
				this.$emit("loading", false);
				return;
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
					this.handleGetProductByCategory();
					this.categories = res.data.result.items;
				} else {
					console.log("error", res);
				}

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

				this.$emit("loading", false);
			} catch (errors) {
				console.log("errors", errors);
			}
		},

		handleResetDataCategoryGood() {
			this.goodList = [];
			this.categories = [];
		},

		async handleAddSales() {
			const salesItems = Object.values(this.goodListSelected).map(good => {
				const goodFormatted = common.commonFunctions.formatSaleItem(good);
				// this.totalAmount += goodFormatted.amount;
				return goodFormatted;
			});
			if (this.paymentSelected[0]) {
				this.paymentSelected[0].paymentAmount = this.salesPaid;
			} else {
				// this.outstanding = this.totalAmount;
			}

			console.log(
				"add",
				this.paymentSelected[0]?.paymentAmount,
				this.salesPaid,
				this.outstanding
			);

			const data = {
				balanceDeduction: 0,
				balanceMoves: [],
				bookingId: 0,
				branchNumber: session.shopSession.getBranchInfo().number,
				chainId: session.shopSession.chainId,
				clientId: this.dataClient.clientId,
				createdById: session.shopSession.getUserAccount().id,
				createdByName: session.shopSession.getUserAccount().name,
				createdDateTimeTS: common.momentFunction.DateNowIntoUnix(),
				deductionPoints: 0,
				deletedById: 0,
				deletedByName: "",
				deletedDateTimeTS: 0,
				earnedPoints: 0,
				editedById: 0,
				editedByName: "",
				editedDateTimeTS: 0,
				editedSalesId: 0,
				hourOfDay: common.momentFunction.GetHours(),
				invoiceDateTimeTS: this.invoiceDateTimeTS,
				isSalesConnect: false,
				notes: "",
				outstanding: this.outstanding,
				payments: this.paymentSelected,
				salesId: 0,
				salesItems: salesItems,
				salesNumber: "",
				sessionToken: session.shopSession.getSessionToken(),
				shopId: session.shopSession.getShopId(),
				shopLocation: constant.payload.DEFAULT_SHOP_LOCATION,
				status: 0,
				totalAmount: this.totalAmount,
			};

			this.$emit("loading", true);

			if (this.outstanding > 0) {
				if (
					confirm(
						`The outstanding is ${this.handleFormatNumber(
							this.outstanding
						)}. Do you want to save?`
					) === true
				) {
					try {
						const res = await apis.salesApis.addSales(data);

						if (res.status !== 200) {
							this.$emit("loading", false);
							throw res;
						}

						if (res.data.isOK) {
							this.hideModal();
							this.resetModal();
						} else {
							alert(res.data.errorMessages);
						}

						this.$emit("loading", false);
					} catch (errors) {
						console.log("errors", errors);
					}

					this.$emit("loading", false);
				} else {
					// this.totalAmount = 0;
					// this.outstanding = 0;
					this.$emit("loading", false);
				}
			} else {
				try {
					const res = await apis.salesApis.addSales(data);

					if (res.status !== 200) {
						this.$emit("loading", false);
						throw res;
					}

					if (res.data.isOK) {
						this.hideModal();
						this.resetModal();
					} else {
						alert(res.data.errorMessages);
					}

					this.$emit("loading", false);
				} catch (errors) {
					console.log("errors", errors);
				}

				this.$emit("loading", false);
			}
		},

		resetModal() {
			this.salesPaid = 0;
			this.dataClient = {};
			this.outstanding = 0;
			this.totalAmount = 0;
			this.paymentSelected = [];
			this.goodListSelected = {};
			this.goodListSelectedShow = [];
		},

		handleConfirmItemSelected(listItemSelected = {}) {
			Object.keys(listItemSelected).forEach(goodKey => {
				if (this.goodListSelected[goodKey]) {
					this.goodListSelected[goodKey].qty += listItemSelected[goodKey].qty;
				} else {
					this.goodListSelected[goodKey] = listItemSelected[goodKey];
				}
			});
			// this.goodListSelected = listItemSelected;
			this.goodListSelectedShow = this.handleFormatDataSalesItem();
		},

		handleDeleteItemSelected(itemDelete) {
			delete this.goodListSelected[itemDelete];

			this.goodListSelectedShow = Object.values(this.goodListSelected);
		},

		handlePaymentSelected(paymentMethod) {
			this.outstanding = 0;
			this.salesPaid = this.totalAmount;

			const paidDateTimeTS = common.momentFunction.DateIntoUnix();

			const paymentMethodFormatted = common.commonFunctions.formatPaymentMethod(
				paymentMethod,
				paidDateTimeTS
			);

			this.paymentSelected = [paymentMethodFormatted];
		},

		handleGetGoodCategory(typeGood) {
			this.typeGood = typeGood;
			this.goodTypeSelected = typeGood;

			if (typeGood === constant.sales.services) {
				this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
				this.handleGetServiceCategory();
			}

			if (typeGood === constant.sales.products) {
				this.categorySelected = Object.assign({}, DEFAULT_CATEGORY_SELECTED);
				this.handleGetProductCategory();
			}
		},

		handleShowSelectSalesItem() {
			this.$refs.refSelectSalesItem &&
				this.$refs.refSelectSalesItem.showModal({
					typeGood: this.typeGood,
					goodList: this.goodList,
					categories: this.categories,
				});
		},

		handleResetGoodType() {
			this.typeGood = 1;
			this.goodTypeSelected = Object.values(constant.sales.itemSalesType)[0].id;
		},

		handleQty(id, qty) {
			this.goodListSelected[id.toString()].qty = qty;
			this.goodListSelectedShow = this.handleFormatDataSalesItem();
		},

		handleUnitPrice(id, unitPrice) {
			const typeGood = this.goodListSelected[id.toString()].type;
			if (typeGood === 1) {
				this.goodListSelected[id.toString()].goodInfo.price = unitPrice;
			}

			if (typeGood === 2) {
				this.goodListSelected[id.toString()].goodInfo.retailPrice = unitPrice;
			}

			this.goodListSelectedShow = this.handleFormatDataSalesItem();
		},

		handleFormatDataSalesItem() {
			this.totalAmount = 0;
			this.outstanding = 0;

			const dataFormatted = Object.values(this.goodListSelected).map(good => {
				good.showDataTable = {
					goodId: 0,
					salesItem: "",
					unitPrice: 0,
					qTy: 0,
					discount: 0,
					amount: 0,
					staff: "",
					salesType: "",
					pointDeduct: 0,
					balanceDeduct: 0,
				};

				if (good.type === constant.sales.services) {
					good.showDataTable.qTy = good.qty;
					good.showDataTable.goodId = good.goodInfo.serviceId;
					good.showDataTable.unitPrice = good.goodInfo.price;
					good.showDataTable.salesItem = good.goodInfo.serviceName;
					good.showDataTable.amount = good.goodInfo.price * good.qty;
				}

				if (good.type === constant.sales.products) {
					good.showDataTable.qTy = good.qty;
					good.showDataTable.goodId = good.goodInfo.productId;
					good.showDataTable.unitPrice = good.goodInfo.retailPrice;
					good.showDataTable.salesItem = good.goodInfo.productName;
					good.showDataTable.amount = good.goodInfo.retailPrice * good.qty;
				}

				this.totalAmount +=
					good.showDataTable.unitPrice * good.showDataTable.qTy;

				return good;
			});

			this.outstanding = this.totalAmount - this.salesPaid;

			return dataFormatted;
		},

		handleFormatNumber(data) {
			let number = 0;
			if (data > 0) {
				number = common.commonFunctions.formatMoneyNumber(data);
			}
			return number;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Sales-Action.scss";
</style>
