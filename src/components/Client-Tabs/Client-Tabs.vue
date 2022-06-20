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
							Show Expired
						</b-form-checkbox>
					</div>
					<table
						class="table tab__table"
						v-if="statusScreenLaptop || !isShow.card"
					>
						<thead>
							<tr>
								<th v-for="field in fields.prepaidCard" :key="field.text">
									{{ field.text }}
								</th>
								<th colspan="2">Actions</th>
							</tr>
						</thead>
						<tbody v-if="isShow.card">
							<tr
								:key="card.id"
								v-for="card in dataPrepaidGoods.cards"
								:class="{
									'is-expired': HandleGoodExpired(
										(good = card),
										(type = typePrepaidGood.card)
									),
								}"
							>
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

					<div v-else v-for="card in dataPrepaidGoods.cards" :key="card.id">
						<prepaid-good-view
							:prepaid-good-info="card"
							:prepaid-good-field="fields.prepaidCard"
							:type-prepaid-good="typePrepaidGood.card"
							@handleEdit="handleClickEdit"
							@handleView="() => onClickShowHistoryPrepaidGood(card)"
						>
							<!-- <template #prepaidCardNameField="row">
								{{ row.prepaidCardName.text && "" }}
							</template>

							<template #prepaidCardName="row">
								<div class="detail__name">
									{{ row.prepaidCardName }}
									<button
										@click="
											() => {
												console.log('a');
											}
										"
									>
										&#x21E7;
									</button>
								</div>
							</template> -->

							<template #balance="row">
								<div>{{ handleFormatNumber(row.balance) }}</div>
							</template>

							<template #expiryDateTS="row">
								<div>{{ handleFormatDate(row.expiryDateTS) }}</div>
							</template>

							<template #initialBalance="row">
								<div>{{ handleFormatNumber(row.initialBalance) }}</div>
							</template>

							<template #discountForService="row">
								<div>{{ handleFormatDiscount(row.discountForService) }}</div>
							</template>

							<template #discountForProduct="row">
								<div>{{ handleFormatDiscount(row.discountForProduct) }}</div>
							</template>

							<template #invoiceDateTimeTS="row">
								<div>{{ handleFormatDate(row.invoiceDateTimeTS) }}</div>
							</template>
						</prepaid-good-view>
					</div>

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
					<table
						class="table tab__table"
						v-if="statusScreenLaptop || !isShow.service"
					>
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
								:class="{
									'is-expired': HandleGoodExpired(
										(good = service),
										(type = typePrepaidGood.service)
									),
								}"
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

					<div
						v-else
						:key="service.id"
						v-for="service in dataPrepaidGoods.services"
					>
						<prepaid-good-view
							:prepaid-good-info="service"
							:prepaid-good-field="fields.prepaidService"
							:type-prepaid-good="typePrepaidGood.service"
							@handleEdit="handleClickEdit"
							@handleDeduct="onClickDeduct"
							@handleView="onClickViewPrepaidService"
						>
							<!-- <template #prepaidServiceName="row">
								<div class="detail__name">
									{{ row.prepaidServiceName }}
								</div>
							</template> -->

							<template #quantity="row">
								<div>{{ handleFormatNumber(row.quantity) }}</div>
							</template>

							<template #expiryDateTS="row">
								<div>{{ handleFormatDate(row.expiryDateTS) }}</div>
							</template>

							<template #initialQuantity="row">
								<div>{{ handleFormatNumber(row.initialQuantity) }}</div>
							</template>

							<template #invoiceDateTimeTS="row">
								<div>{{ handleFormatDate(row.invoiceDateTimeTS) }}</div>
							</template>
						</prepaid-good-view>
					</div>

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
import constant from "../../lib/utils/constant";

import Paging from "@components/Paging/Paging.vue";
import Notification from "@components/Notification/Notification.vue";
import PrepaidGoodView from "@components/Prepaid-Good-View/Prepaid-Good-View.vue";
import PrepaidGoodHistory from "@components/Prepaid-Good-History/Prepaid-Good-History.vue";

const DEFAULT_FIELDS_TABLE = {
	prepaidCard: {
		prepaidCardName: { text: "Card Name" },
		balance: { text: "Balance" },
		expiryDateTS: { text: "Expiry Date" },
		initialBalance: { text: "Earned Amount" },
		discountForService: { text: "Service DC" },
		discountForProduct: { text: "Product DC" },
		invoiceDateTimeTS: { text: "Issue Date" },
	},
	prepaidService: {
		prepaidServiceName: { text: "Prepaid Service Name" },
		quantity: { text: "Remaining Quantity" },
		expiryDateTS: { text: "Expiry Date" },
		initialQuantity: { text: "Initial Quantity" },
		invoiceDateTimeTS: { text: "Issue Date" },
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

const DEFAULT_TYPE_PREPAID_GOOD = {
	card: constant.sales.typePrepaidGood.card,
	service: constant.sales.typePrepaidGood.service,
};

export default {
	name: "SalonThankzClientTabs",

	data() {
		return {
			dataPrepaidGoods: {},
			windowWidth: window.innerWidth,
			page: Object.assign({}, DEFAULT_PAGING),
			expired: Object.assign({}, DEFAULT_EXPIRED),
			fields: Object.assign({}, DEFAULT_FIELDS_TABLE),
			typePrepaidGood: Object.assign({}, DEFAULT_TYPE_PREPAID_GOOD),
		};
	},

	props: {},

	components: {
		Paging,
		Notification,
		PrepaidGoodView,
		"prepaid-good-history": PrepaidGoodHistory,
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
		isShow() {
			return {
				card: this.dataPrepaidGoods?.cards?.length,
				service: this.dataPrepaidGoods?.services?.length,
			};
		},

		statusScreenLaptop() {
			return this.windowWidth > constant.common.screenSize.maxScreenLaptop;
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
			if (balance === -1) return "No Limit";
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

		onResize() {
			this.windowWidth = window.innerWidth;
		},

		HandleGoodExpired(good = {}, type = null) {
			if (type) {
				return (
					good?.expiryDateTS !== -1 &&
					good?.expiryDateTS < common.momentFunction.DateNowIntoUnix()
				);
			}

			return good?.isExpired;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client-Tabs.scss";
</style>
