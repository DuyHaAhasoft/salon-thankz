<template>
	<div class="client-tabs">
		<b-tabs content-class="mt-3" class="client-tabs__tabs">
			<b-tab title="Sales History" disabled></b-tab>
			<b-tab title="Bookings" disabled></b-tab>
			<b-tab title="Prepaid Cards" active @click="handleGetPrepaidCard">
				<div class="tabs__tab tabs__tab--prepaid-card">
					<div class="tab__checkbox">
						<b-form-checkbox
							value="true"
							id="checkbox-card"
							unchecked-value="false"
							v-model="expired.card"
							name="checkbox-expired"
						>
							Show Expired {{ expired.card }}
						</b-form-checkbox>
					</div>
					<table class="table tab__table">
						<thead>
							<tr>
								<th v-for="field in fields.prepaidCard" :key="field.text">
									{{ field.text }}
								</th>
								<th colspan="2">Actions</th>
							</tr>
						</thead>
						<tbody v-if="isShow.card">
							<tr v-for="card in dataPrepaidGoods.cards" :key="card.id">
								<td class="table__table-data table__table-data--prepaid-name">
									{{ card.prepaidCardName }}
								</td>
								<td class="table__table-data table__table-data--balance">
									{{ handleFormatNumber(card.balance) }}
								</td>
								<td class="table__table-data table__table-data--date">
									{{ handleFormatDate(card.expiryDateTS) }}
								</td>
								<td class="table__table-data table__table-data--balance">
									{{ handleFormatNumber(card.initialBalance) }}
								</td>
								<td class="table__table-data table__table-data--discount">
									{{ handleFormatDiscount(card.discountForService) }}
								</td>
								<td class="table__table-data table__table-data--discount">
									{{ handleFormatDiscount(card.discountForProduct) }}
								</td>
								<td class="table__table-data table__table-data--date">
									{{ handleFormatDate(card.invoiceDateTimeTS) }}
								</td>
								<td class="table__table-data table__table-data--btn">
									<button
										class="data--btn__btn data--btn__btn--edit"
										@click="handleClickEdit"
									>
										Edit
									</button>
								</td>
								<td class="table__table-data table__table-data--btn">
									<button
										class="data--btn__btn data--btn__btn--view"
										@click="() => onClickShowHistoryPrepaidGood(card)"
									>
										View
									</button>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td class="table__no-data" colspan="9">No data</td>
							</tr>
						</tbody>
					</table>
					<paging
						v-if="page.pageTotal > 1"
						:page="page"
						@handlePaging="handleGetPrepaidCard"
					/>
				</div>
			</b-tab>
			<b-tab title="Prepaid Service" @click="handleGetPrepaidService">
				<div class="tabs__tab tabs__tab--prepaid-service">
					<div class="tab__checkbox">
						<b-form-checkbox
							value="true"
							id="checkbox-service"
							unchecked-value="false"
							v-model="expired.service"
							name="checkbox-expired"
						>
							Show Expired
						</b-form-checkbox>
					</div>
					<table class="table tab__table">
						<thead>
							<tr>
								<th v-for="field in fields.prepaidService" :key="field.text">
									{{ field.text }}
								</th>
								<th colspan="2">Actions</th>
							</tr>
						</thead>
						<tbody v-if="isShow.service">
							<tr
								v-for="service in dataPrepaidGoods.services"
								:key="service.id"
							>
								<td class="table__table-data table__table-data--prepaid-name">
									{{ service.prepaidServiceName }}
								</td>
								<td class="table__table-data table__table-data--quantity">
									{{ handleFormatNumber(service.quantity) }}
									<button
										class="data--btn__btn data--btn__btn--deduct"
										@click="onClickDeduct"
									>
										Deduct
									</button>
								</td>
								<td class="table__table-data table__table-data--date">
									{{ handleFormatDate(service.expiryDateTS) }}
								</td>
								<td class="table__table-data table__table-data--quantity">
									{{ handleFormatNumber(service.initialQuantity) }}
								</td>
								<td class="table__table-data table__table-data--date">
									{{ handleFormatDate(service.invoiceDateTimeTS) }}
								</td>
								<td class="table__table-data table__table-data--btn">
									<button
										class="data--btn__btn data--btn__btn--edit"
										@click="handleClickEdit"
									>
										Edit
									</button>
								</td>
								<td class="table__table-data table__table-data--btn">
									<button
										class="data--btn__btn data--btn__btn--view"
										@click="onClickViewPrepaidService"
									>
										View
									</button>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td class="table__no-data" colspan="6">No data</td>
							</tr>
						</tbody>
					</table>
					<paging
						v-if="page.pageTotal > 1"
						:page="page"
						@handlePaging="handleGetPrepaidService"
					/>
				</div>
			</b-tab>
			<b-tab title="Messages" disabled></b-tab>
			<b-tab title="Photos" disabled></b-tab>
		</b-tabs>

		<prepaid-good-history
			@loading="handleLoading"
			ref="refPrepaidGoodHistory"
			@showHistoryPrepaidGoodPaging="onClickShowHistoryPrepaidGoodPaging"
		/>

		<notification modalTitle="Notification" ref="refNotification" />
	</div>
</template>

<script>
import apis from "../../lib/apis";
import common from "../../lib/utils/common";
import session from "../../lib/utils/session";

import Paging from "@components/Paging/Paging.vue";
import Notification from "../Notification/Notification.vue";
import PrepaidGoodHistory from "../Prepaid-Good-History/Prepaid-Good-History.vue";

const DEFAULT_FIELDS_TABLE = {
	prepaidCard: {
		cardName: { text: "Card Name" },
		balance: { text: "Balance" },
		expiryDate: { text: "Expiry Date" },
		earnedAmount: { text: "Earned Amount" },
		serviceDC: { text: "Service DC" },
		productDC: { text: "Product DC" },
		issueDate: { text: "Issue Date" },
	},
	prepaidService: {
		prepaidServiceName: { text: "Prepaid Service Name" },
		remainingQuantity: { text: "Remaining Quantity" },
		expiryDate: { text: "Expiry Date" },
		initialQuantity: { text: "Initial Quantity" },
		issueDate: { text: "Issue Date" },
	},
};

const DEFAULT_PAGING = {
	pageTotal: 1,
	pageNumber: 1,
};

const DEFAULT_EXPIRED = {
	card: false,
	service: false,
};

export default {
	name: "SalonThankzClientTabs",

	data() {
		return {
			dataPrepaidGoods: {},
			page: Object.assign({}, DEFAULT_PAGING),
			expired: Object.assign({}, DEFAULT_EXPIRED),
			fields: Object.assign({}, DEFAULT_FIELDS_TABLE),
		};
	},

	props: {},

	components: {
		Paging,
		Notification,
		"prepaid-good-history": PrepaidGoodHistory,
	},

	mounted() {},

	computed: {
		isShow() {
			return {
				card: this.dataPrepaidGoods?.cards?.length,
				service: this.dataPrepaidGoods?.services?.length,
			};
		},
	},

	watch: {
		"expired.card": function (before, after) {
			if (before !== after) this.handleGetPrepaidCard({ pageNumber: 1 });
		},
		"expired.service": function (before, after) {
			if (before !== after) this.handleGetPrepaidService({ pageNumber: 1 });
		},
	},

	methods: {
		handleGetPrepaidCard({ pageNumber = 1 }) {
			this.$emit("getPrepaidCard", { expired: this.expired.card, pageNumber });
		},

		handleGetPrepaidService({ pageNumber = 1 }) {
			this.$emit("getPrepaidService", {
				expired: this.expired.service,
				pageNumber: pageNumber,
			});
		},

		handleSetPrepaidGoods(data) {
			this.dataPrepaidGoods = data;
			this.page = {
				pageTotal: Math.ceil(
					data?.pagingInfo?.totalItems / data?.pagingInfo?.pageSize
				),
				pageNumber: data?.pagingInfo?.pageNumber,
			};
		},

		handleFormatDate(date) {
			if (date === -1) return "No Limit";

			return common.momentFunction.FormatDate(
				common.momentFunction.UnixMiliSecondsIntoDate(date)
			);
		},

		handleFormatNumber(balance) {
			return common.commonFunctions.formatMoneyNumber(balance);
		},

		handleFormatDiscount(discount) {
			if (discount) return discount + "%";
			return "";
		},

		async onClickShowHistoryPrepaidGood(prepaidGood) {
			const data = {
				clientId: prepaidGood.clientId,
				clientPrepaidCardId: prepaidGood.id,
				pageNumber: 1,
				pageSize: 10,
				shopId: session.shopSession.getShopId(),
			};

			try {
				this.$emit("loading", true);

				const res = await apis.salesApis.getPrepaidCardHistory(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					const dataPrepaidCard = res.data.result;
					this.$emit("loading", false);
					this.$refs.refPrepaidGoodHistory.showModal({
						title: "Prepaid Card Balance History",
						dataPrepaidCard,
					});
				} else {
					console.log(res);
					this.$emit("loading", false);
				}
			} catch (errors) {
				console.log(errors);
			}
		},

		async onClickShowHistoryPrepaidGoodPaging(
			prepaidGood = { clientId: 0, id: 0, pageNumber: 1 }
		) {
			const data = {
				clientId: prepaidGood.clientId,
				clientPrepaidCardId: prepaidGood.id,
				pageNumber: prepaidGood.pageNumber,
				pageSize: 10,
				shopId: session.shopSession.getShopId(),
			};
			try {
				this.$emit("loading", true);

				const res = await apis.salesApis.getPrepaidCardHistory(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					throw res;
				}

				if (res.data.isOK) {
					const dataPrepaidCard = res.data.result;
					console.log("result", dataPrepaidCard);
					this.$emit("loading", false);
					this.$refs.refPrepaidGoodHistory.showModal({
						title: "Prepaid Card Balance History",
						dataPrepaidCard,
					});
				} else {
					console.log(res);
					this.$emit("loading", false);
				}
			} catch (errors) {
				console.log(errors);
			}
		},

		handleClickEdit() {
			this.handleNotification();
		},

		onClickViewPrepaidService() {
			this.handleNotification();
		},

		onClickDeduct() {
			this.handleNotification();
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

		handleLoading(value) {
			this.$emit("loading", value);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client-Tabs.scss";
</style>
