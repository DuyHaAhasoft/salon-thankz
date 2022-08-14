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
							<tbody v-if="isShow.goodListSelectedShow">
								<tr :key="index" v-for="(good, index) in goodListSelectedShow">
									<td class="table__table-data table__table-data--sales-item">
										{{ showLongText(good.showDataTable.salesItem, 20) }}
									</td>

									<td class="table__table-data table__table-data--unit-price">
										<button
											class="btn-change-number"
											@click="
												handleUnitPrice(
													good.showDataTable.goodId,
													good.showDataTable.unitPrice - 1
												)
											"
										>
											&lt;
										</button>
										{{ handleFormatNumber(good.showDataTable.unitPrice) }}
										<button
											class="btn-change-number"
											@click="
												handleUnitPrice(
													good.showDataTable.goodId,
													good.showDataTable.unitPrice + 1
												)
											"
										>
											>
										</button>
									</td>

									<td class="table__table-data table__table-data--qty">
										<!-- <input
											min="1"
											max="9999"
											type="number"
											minlength="1"
											maxlength="4"
											v-model="good.showDataTable.qTy"
											@change="
												handleQty(
													good.showDataTable.goodId,
													good.showDataTable.qTy
												)
											"
											oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
										/> -->

										<button
											class="btn-change-number"
											@click="
												handleQty(
													good.showDataTable.goodId,
													good.showDataTable.qTy - 1
												)
											"
										>
											&lt;
										</button>
										{{ handleFormatNumber(good.showDataTable.qTy) }}
										<button
											class="btn-change-number"
											@click="
												handleQty(
													good.showDataTable.goodId,
													good.showDataTable.qTy + 1
												)
											"
										>
											>
										</button>
									</td>

									<td
										@click="handleNotification"
										class="table__table-data table__table-data--unit-discount"
									>
										{{ good.showDataTable.discount }}
									</td>

									<td class="table__table-data table__table-data--amount">
										{{ handleFormatNumber(good.showDataTable.amount) }}
									</td>

									<td
										@click="handleNotification"
										class="table__table-data table__table-data--staff"
									>
										{{ good.showDataTable.staff }}
									</td>

									<td
										@click="handleNotification"
										class="table__table-data table__table-data--sales-type"
									>
										{{ good.showDataTable.salesType }}
									</td>

									<td
										@click="handleNotification"
										class="table__table-data table__table-data--points-deduct"
									>
										{{ good.showDataTable.pointDeduct }}
									</td>

									<td
										@click="handleNotification"
										class="table__table-data table__table-data--balance-deduct"
									>
										{{ good.showDataTable.balanceDeduct }}
									</td>

									<td
										class="table__table-data table__table-data--delete"
										@click="handleDeleteItemSelected(good.showDataTable.goodId)"
									>
										<span>X</span>
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
								<span class="payment-detail__data">{{
									handleFormatNumber(totalAmount)
								}}</span>
							</div>
							<div class="payment-detail__point-deduction">
								<span class="payment-detail__title">Point Deduction</span>
								<span class="payment-detail__data">0</span>
							</div>
							<div class="payment-detail__balance-deduction">
								<span class="payment-detail__title">Balance Deduction</span>
								<span class="payment-detail__data">0</span>
							</div>
							<div
								v-if="isShow.paymentSelected"
								class="payment-detail__payment-paid"
							>
								<div
									class="payment-paid__payment"
									v-for="(payment, index) in paymentSelected"
									:key="index"
								>
									<span class="payment-detail__title">{{
										payment.paymentMethodName
									}}</span>
									<span class="payment-detail__data"
										>{{ handleFormatNumber(payment.paymentAmount) }}
										<span
											><button
												class="payment-detail__btn"
												@click="
													handleDeletePaymentSelected(payment.paymentMethodId)
												"
											>
												X
											</button></span
										>
									</span>
								</div>
							</div>

							<div class="payment-detail__outstanding">
								<span class="payment-detail__title">Outstanding</span>
								<span class="payment-detail__data">{{
									isOutstanding ? handleFormatNumber(outstanding) : 0
								}}</span>
							</div>
							<div class="payment-detail__change" v-if="!isOutstanding">
								<span class="payment-detail__title">Change</span>
								<span class="payment-detail__data">{{
									handleFormatNumber(change)
								}}</span>
							</div>
							<div class="payment-detail__earn-loyalty-points">
								<span class="payment-detail__title">Earn Loyalty Points</span>
								<span class="payment-detail__data">0</span>
							</div>
						</div>
						<div class="detail__deduction-notes-payment-date">
							<div class="deduction-notes-payment__deduction">
								<div class="deduction__text">DEDUCTION</div>
								<div class="deduction__group-button">
									<button
										class="group-button__btn group-button__btn--point"
										@click="handleNotification"
									>
										Point
									</button>
									<button
										class="group-button__btn group-button__btn--balance"
										@click="handleNotification"
									>
										Balance
									</button>
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
								<textarea rows="2" v-model="salesNotes" />
							</div>
							<div class="deduction-notes-payment-date__date">
								<span class="date__tittle">Sales Date</span>
								<div class="date__date-time">
									<v-date-picker
										v-model="registeredDate"
										:masks="masks"
										class="date-picker date-time__date-picker"
									>
										<template v-slot="{ inputValue, inputEvents }">
											<input
												class="input-date-picker date-picker__input-date-picker"
												:value="inputValue"
												v-on="inputEvents"
											/>
										</template>
									</v-date-picker>
									<div class="date-time__time">
										<b-form-select
											v-model="hoursSales"
											:options="hourOptions"
										></b-form-select>
										:
										<b-form-select
											v-model="minutesSales"
											:options="minuteOptions"
										></b-form-select>
									</div>
								</div>
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
			@getPrepaidCard="handleGetPrepaidCard"
			@getServiceCategory="handleGetServiceCategory"
			@getProductCategory="handleGetProductCategory"
			@confirmItemSelected="handleConfirmItemSelected"
			@getProductByCategory="handleGetProductByCategory"
			@getServiceByCategory="handleGetServiceByCategory"
			@resetDataCategoryGood="handleResetDataCategoryGood"
			@getUserPrepaidService="handleGetUserPrepaidService"
			@getPrepaidServiceByCategory="handleGetPrepaidServiceByCategory"
		/>
		<!-- <loading /> -->
		<notification modalTitle="Notification" ref="refNotification" />
		<confirm-modal
			ref="refConfirmModal"
			@confirm="handleAddSalesWithOutstanding"
		/>
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
import Notification from "@components/Notification/Notification.vue";
import ConfirmModal from "@components/Confirm-Modal/Confirm-Modal.vue";
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
			change: 0,
			typeGood: 1,
			goodList: [],
			salesPaid: 0,
			salesNotes: "",
			hoursSales: 0,
			categories: [],
			typeAction: {},
			dataClient: {},
			totalAmount: 0,
			outstanding: 0,
			minutesSales: 0,
			paymentMethods: [],
			paymentSelected: [],
			goodListSelected: {},
			invoiceDateTimeTS: 0,
			salesLoyaltyPoint: 0,
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
		Notification,
		ConfirmModal,
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
			return {
				goodListSelectedShow: this.goodListSelectedShow.length,
				paymentSelected: this.paymentSelected.length,
			};
		},

		isShowButton() {
			return {
				confirm: true,
				delete: false,
				cancel: true,
			};
		},

		minuteOptions() {
			return common.commonFunctions.minuteSelect();
		},

		hourOptions() {
			return common.commonFunctions.hourSelect();
		},

		isOutstanding() {
			if (this.outstanding < 0) return false;
			return true;
		},
	},

	methods: {
		showModal(dataModal) {
			this.hoursSales = common.momentFunctions.GetHours();
			this.minutesSales = common.momentFunctions.GetMinutes();

			// this.paymentMethods = session.saleSession.getAllPaymentMethods();

			const paymentMethodsName = ["Cash", "Credit Card"];

			const setPaymentMethods = session.saleSession.getAllPaymentMethods();

			setPaymentMethods.forEach(paymentMethod => {
				const indexPayment = this.paymentMethods.findIndex(
					payment => payment.id === paymentMethod.id
				);

				if (
					paymentMethodsName.includes(paymentMethod.name) &&
					indexPayment === -1
				) {
					this.paymentMethods.push(paymentMethod);
				}
			});

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
			this.resetModal();
			this.$refs.salesActionModal && this.$refs.salesActionModal.hide();
		},

		handleSetLoading(value) {
			this.$emit("loading", value);
		},

		async handleGetServiceCategory(typeGood = 1) {
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
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					this.categories = res.data.result.items;
					const firstServiceCategoryId =
						res.data.result.items[0]?.serviceCategoryId ?? 0;
					if (typeGood === 1) {
						this.handleGetServiceByCategory(firstServiceCategoryId);
					} else {
						this.handleGetPrepaidServiceByCategory(firstServiceCategoryId);
					}
				} else {
					console.log("error", res);
				}

				if (res.isOK === false) {
					this.$emit("loading", false);
					location.reload();
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
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					this.handleGetProductByCategory();
					this.categories = res.data.result.items;
				} else {
					console.log("error", res);
				}

				if (res.isOK === false) {
					this.$emit("loading", false);
					location.reload();
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
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					this.goodList = res.data.result.items;
				} else {
					console.log("error", res);
				}

				if (res.isOK === false) {
					this.$emit("loading", false);
					location.reload();
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
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					this.goodList = res.data.result.items;
				} else {
					console.log("error", res);
				}

				if (res.isOK === false) {
					this.$emit("loading", false);
					location.reload();
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

		async handleGetPrepaidCard() {
			const data = {
				status: 1,
				pageNumber: 1,
				pageSize: 100,
				shopId: session.shopSession.getShopId(),
			};
			this.$emit("loading", true);

			try {
				const res = await apis.goodApis.getPrepaidCard(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					this.goodList = res.data.result.items;
				} else {
					console.log("error", res);
				}

				if (res.isOK === false) {
					this.$emit("loading", false);
					location.reload();
				}

				this.$emit("loading", false);
			} catch (errors) {
				console.log("errors", errors);
			} finally {
				this.$emit("loading", false);
			}
		},

		async handleGetPrepaidServiceByCategory(serviceCategoryId = 0) {
			const data = {
				status: 1,
				pageSize: 100,
				pageNumber: 1,
				serviceCategoryId: serviceCategoryId,
				shopId: session.shopSession.getShopId(),
			};

			this.$emit("loading", true);

			try {
				const res = await apis.goodApis.getPrepaidServiceByCategory(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					this.goodList = res.data.result.items;
				} else {
					console.log("error", res);
				}

				if (res.isOK === false) {
					this.$emit("loading", false);
					location.reload();
				}
			} catch (errors) {
				console.log("errors", errors);
			} finally {
				this.$emit("loading", false);
			}
		},

		async handleGetUserPrepaidService() {
			const data = {
				clientId: this.dataClient?.clientId ?? 0,
				includeExpired: false,
				includeFamilyService: true,
				pageNumber: 1,
				pageSize: 100,
				shopId: session.shopSession.getShopId(),
			};

			try {
				this.$emit("loading", true);

				const res = await apis.clientApis.getClientPrepaidServices(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					this.goodList = res.data.result.items;
				} else {
					console.log("error", res);
				}

				if (res.isOK === false) {
					this.$emit("loading", false);
					location.reload();
				}
			} catch (errors) {
				console.log("errors", errors);
			} finally {
				this.$emit("loading", false);
			}
		},

		async handleAddSales() {
			if (Object.values(this.goodListSelected).length) {
				const dateRegistered = common.momentFunctions.FormatDate(
					this.registeredDate
				);
				const datetimeAddSales = `${dateRegistered}  ${this.hoursSales}:${this.minutesSales}`;
				const timestampDatetimeAddSales =
					common.momentFunctions.DateIntoUnix(datetimeAddSales);

				if (timestampDatetimeAddSales > common.momentFunctions.DateIntoUnix()) {
					this.$refs.refNotification.showModal({
						listMessage: [
							{
								errorCode: "Error",
								errorMessage: "Can not add sales in future.",
							},
						],
					});

					return;
				}

				const salesItems = Object.values(this.goodListSelected).map(good => {
					const goodFormatted = common.commonFunctions.formatSaleItem(good);
					// this.totalAmount += goodFormatted.amount;
					if (goodFormatted.quantity === 0) {
						goodFormatted.quantity = 1;
						goodFormatted.amount = goodFormatted.unitPrice;
					}

					return goodFormatted;
				});
				// if (this.paymentSelected[0]) {
				// 	this.paymentSelected[0].paymentAmount = this.salesPaid;
				// } else {
				// 	this.outstanding = this.totalAmount;
				// }

				const data = {
					balanceDeduction: 0,
					balanceMoves: [],
					bookingId: 0,
					branchNumber: session.shopSession.getBranchInfo().number,
					chainId: session.shopSession.chainId,
					clientId: this.dataClient.clientId,
					createdById: session.shopSession.getUserAccount().id,
					createdByName: session.shopSession.getUserAccount().name,
					createdDateTimeTS: timestampDatetimeAddSales,
					deductionPoints: 0,
					deletedById: 0,
					deletedByName: "",
					deletedDateTimeTS: 0,
					earnedPoints: this.salesLoyaltyPoint,
					editedById: 0,
					editedByName: "",
					editedDateTimeTS: 0,
					editedSalesId: 0,
					hourOfDay: common.momentFunctions.GetHours(),
					invoiceDateTimeTS: this.invoiceDateTimeTS,
					isSalesConnect: false,
					notes: this.salesNotes.trim(),
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

				if (this.change > 0) {
					if (this.paymentSelected.length === 1) {
						this.paymentSelected[0].paymentAmount = this.totalAmount;
						data.outstanding = 0;
					} else {
						this.$refs.refNotification.showModal({
							listMessage: [
								{
									errorCode: "Error",
									errorMessage: "Change are not allowed for multiple payments.",
								},
							],
						});
						this.$emit("loading", false);
						return;
					}
				}

				if (this.outstanding > 0) {
					this.$emit("loading", false);
					this.$refs.refConfirmModal.showModal({
						title: "Delete Client",
						message: `The outstanding is ${this.handleFormatNumber(
							this.outstanding
						)}. Do you want to save? ?`,
					});
				} else {
					try {
						const res = await apis.salesApis.addSales(data);

						if (res.status !== 200) {
							this.$emit("loading", false);
							location.reload();
							throw res;
						}

						if (res.data.isOK) {
							setTimeout(() => {
								this.$emit("loadClient");
								this.hideModal();
								this.resetModal();
								this.$emit("loading", false);
							}, 15000);
						} else {
							this.$emit("loading", false);
							alert("error not outstanding", res.data.errorMessages);
						}

						if (res.isOK === false) {
							this.$emit("loading", false);
							location.reload();
						}

						// this.$emit("loading", false);
					} catch (errors) {
						this.$emit("loading", false);
						console.log("errors", errors);
					}

					// this.$emit("loading", false);
				}
			} else {
				this.$refs.refNotification.showModal({
					listMessage: [
						{
							errorCode: "Error",
							errorMessage: "Sales items list can not be empty.",
						},
					],
				});
			}
		},

		async handleAddSalesWithOutstanding() {
			if (Object.values(this.goodListSelected).length) {
				const dateRegistered = common.momentFunctions.FormatDate(
					this.registeredDate
				);
				const datetimeAddSales = `${dateRegistered}  ${this.hoursSales}:${this.minutesSales}`;
				const timestampDatetimeAddSales =
					common.momentFunctions.DateIntoUnix(datetimeAddSales);

				if (timestampDatetimeAddSales > common.momentFunctions.DateIntoUnix()) {
					this.$refs.refNotification.showModal({
						listMessage: [
							{
								errorCode: "Error",
								errorMessage: "Can not add sales in future.",
							},
						],
					});

					return;
				}

				const salesItems = Object.values(this.goodListSelected).map(good => {
					const goodFormatted = common.commonFunctions.formatSaleItem(good);
					if (goodFormatted.quantity === 0) {
						goodFormatted.quantity = 1;
						goodFormatted.amount = goodFormatted.unitPrice;
					}

					return goodFormatted;
				});

				const data = {
					balanceDeduction: 0,
					balanceMoves: [],
					bookingId: 0,
					branchNumber: session.shopSession.getBranchInfo().number,
					chainId: session.shopSession.chainId,
					clientId: this.dataClient.clientId,
					createdById: session.shopSession.getUserAccount().id,
					createdByName: session.shopSession.getUserAccount().name,
					createdDateTimeTS: timestampDatetimeAddSales,
					deductionPoints: 0,
					deletedById: 0,
					deletedByName: "",
					deletedDateTimeTS: 0,
					earnedPoints: this.salesLoyaltyPoint,
					editedById: 0,
					editedByName: "",
					editedDateTimeTS: 0,
					editedSalesId: 0,
					hourOfDay: common.momentFunctions.GetHours(),
					invoiceDateTimeTS: this.invoiceDateTimeTS,
					isSalesConnect: false,
					notes: this.salesNotes.trim(),
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

				try {
					const res = await apis.salesApis.addSales(data);

					if (res.status !== 200) {
						this.$emit("loading", false);
						location.reload();
						throw res;
					}

					if (res.data.isOK) {
						setTimeout(() => {
							this.$emit("loadClient");
							this.$emit("loading", false);
							this.hideModal();
							this.resetModal();
						}, 15000);
					} else {
						this.$emit("loading", false);
						alert("error outstanding", res.data.errorMessages);
					}

					if (res.isOK === false) {
						this.$emit("loading", false);
						location.reload();
					}

					// this.$emit("loading", false);
				} catch (errors) {
					this.$emit("loading", false);
					console.log("errors", errors);
				}

				// this.$emit("loading", false);
			}
		},

		resetModal() {
			this.change = 0;
			this.salesPaid = 0;
			this.hoursSales = 0;
			this.dataClient = {};
			this.outstanding = 0;
			this.totalAmount = 0;
			this.salesNotes = "";
			this.minutesSales = 0;
			this.paymentMethod = [];
			this.paymentSelected = [];
			this.goodListSelected = {};
			this.salesLoyaltyPoint = 0;
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

			// this.goodListSelectedShow = Object.values(this.goodListSelected);
			this.goodListSelectedShow = this.handleFormatDataSalesItem();
		},

		handlePaymentSelected(paymentMethod) {
			this.outstanding = 0;
			// this.salesPaid = this.totalAmount;

			const paidDateTimeTS = common.momentFunctions.DateIntoUnix();
			const indexPayment = this.paymentSelected.findIndex(
				payment => payment.paymentMethodId === paymentMethod.id
			);

			if (this.totalAmount === this.salesPaid) {
				this.$refs.refNotification.showModal({
					listMessage: [
						{
							errorCode: "Warning",
							errorMessage: "All fees have been paid!",
						},
					],
				});

				return;
			}

			if (indexPayment !== -1) {
				this.paymentSelected[indexPayment].paymentAmount +=
					this.totalAmount - this.salesPaid;
				this.paymentSelected[indexPayment].paidDateTimeTS = paidDateTimeTS;
			} else {
				const paymentMethodFormatted =
					common.commonFunctions.formatPaymentMethod(
						paymentMethod,
						paidDateTimeTS
					);

				paymentMethodFormatted.paymentAmount =
					this.totalAmount - this.salesPaid;

				// this.paymentSelected = [paymentMethodFormatted];
				this.paymentSelected.push(paymentMethodFormatted);
			}

			this.salesPaid = this.totalAmount;
		},

		handleDeletePaymentSelected(PaymentSelectedId) {
			const indexPayment = this.paymentSelected.findIndex(
				payment => payment.paymentMethodId === PaymentSelectedId
			);

			this.outstanding += this.paymentSelected[indexPayment].paymentAmount;
			this.salesPaid -= this.paymentSelected[indexPayment].paymentAmount;

			if (this.change > 0) {
				if (this.paymentSelected[indexPayment].paymentAmount >= this.change) {
					this.change = 0;
				} else {
					this.change -= this.paymentSelected[indexPayment].paymentAmount;
				}
			}

			this.paymentSelected.splice(indexPayment, 1);
		},

		handleGetGoodCategory(typeGood) {
			this.goodList = [];
			this.typeGood = typeGood;
			this.goodTypeSelected = typeGood;

			// if(typeGood !== constant.sales.services && typeGood !== constant.sales.products) {
			// 	this.handleNotification();
			// 	return
			// }

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
		},

		handleShowSelectSalesItem() {
			if (this.typeGood === constant.sales.packages) {
				this.handleNotification();
				return;
			}

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
			console.log(this.goodListSelected);
			const amount =
				qty * this.goodListSelected[id.toString()].showDataTable.unitPrice;

			if (amount.toString().length <= 12) {
				this.goodListSelected[id.toString()].qty = qty;
				this.goodListSelectedShow = this.handleFormatDataSalesItem();
			} else {
				this.$refs.refNotification.showModal({
					listMessage: [
						{
							errorCode: "Error",
							errorMessage: "Sales Item Amount can not exceed 12 characters.",
						},
					],
				});
			}
		},

		handleUnitPrice(id, unitPrice) {
			const amount = this.goodListSelected[id.toString()].qty * unitPrice;

			if (amount.toString().length <= 12) {
				const typeGood = this.goodListSelected[id.toString()].type;
				if (typeGood === 1) {
					this.goodListSelected[id.toString()].goodInfo.price = unitPrice;
				}

				if (typeGood === 2) {
					this.goodListSelected[id.toString()].goodInfo.retailPrice = unitPrice;
				}

				this.goodListSelectedShow = this.handleFormatDataSalesItem();
			} else {
				this.$refs.refNotification.showModal({
					listMessage: [
						{
							errorCode: "Error",
							errorMessage: "Sales Item Amount can not exceed 12 characters.",
						},
					],
				});
			}
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

				if (good.type === constant.sales.prepaidCard) {
					good.showDataTable.qTy = good.qty;
					good.showDataTable.unitPrice = good.goodInfo.price;
					good.showDataTable.goodId = good.goodInfo.prepaidCardId;
					good.showDataTable.amount = good.goodInfo.price * good.qty;
					good.showDataTable.salesItem = good.goodInfo.prepaidCardName;
				}

				if (good.type === constant.sales.prepaidService) {
					console.log(good);
					good.showDataTable.qTy = good.qty;
					good.showDataTable.unitPrice = good.goodInfo.price;
					good.showDataTable.goodId = good.goodInfo.prepaidServiceId;
					good.showDataTable.amount = good.goodInfo.price * good.qty;
					good.showDataTable.salesItem = good.goodInfo.prepaidServiceName;
				}

				this.totalAmount +=
					good.showDataTable.unitPrice * good.showDataTable.qTy;

				return good;
			});

			this.outstanding = this.totalAmount - this.salesPaid;

			if (this.outstanding < 0) {
				this.change = -this.outstanding;
			} else {
				this.change = 0;
			}

			return dataFormatted;
		},

		handleFormatNumber(data) {
			let number = 0;
			if (data > 0) {
				number = common.commonFunctions.formatMoneyNumber(data);
			} else if (data < 0) {
				number = common.commonFunctions.formatMoneyNumber(data);
			}
			return number;
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

		handleRandomIndex() {
			const randomIndex = common.randomFunctions.randomIndex();
			return randomIndex;
		},

		showLongText(text, length) {
			return common.commonFunctions.showLongText(text, length);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Sales-Action.scss";
</style>
