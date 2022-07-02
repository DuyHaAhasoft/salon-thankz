<template>
	<div class="clients-page">
		<div class="header clients-page__header">
			<img
				class="image header__image"
				src="https://www.ahasoft.co.kr/login/images/logo_nobkg.png"
			/>
			<button class="header__btn" @click="clickSignout">Sign out</button>
		</div>

		<div class="title clients-page__title">
			<div class="title-text title__title-text">Client</div>

			<div class="group-button title__group-button">
				<button
					@click="handleClickPrintListClient"
					class="btn--print group-button__btn group-button__btn--print"
				>
					Export
				</button>
				<button
					@click="handleClickAddClient"
					class="btn--add-client group-button__btn group-button__btn--add-client"
				>
					Add
				</button>
			</div>
		</div>

		<div class="content clients-page__content">
			<label class="title content__title"
				>Total {{ clientTotal }} client(s) searched</label
			>

			<table
				class="table content__table"
				v-if="statusScreenLaptop || !clients.length"
			>
				<thead>
					<tr>
						<th v-for="field in fields" :key="field.text">
							{{ field.text }}
						</th>
						<th colspan="3">Actions</th>
					</tr>
				</thead>

				<tbody v-if="!clients.length">
					<tr>
						<td class="table__table-no-data" colspan="8">No data</td>
					</tr>
				</tbody>

				<tbody v-else>
					<tr v-for="client in clients" :key="client.clientId">
						<td
							class="table-data table-data--registration-date table__table-data table__table-data--registration-date"
						>
							{{ client.registrationDate }}
						</td>

						<td
							class="table-data table-data--client-name table__table-data table__table-data--client-name"
						>
							{{ showLongText(client.clientName, 50) }}
						</td>

						<td
							class="table-data table-data--phone table__table-data table__table-data--phone"
						>
							{{ client.phone }}
						</td>

						<td
							class="table-data table-data--total-sales-amount table__table-data table__table-data--total-sales-amount"
						>
							{{ client.totalSales }}
						</td>

						<td
							v-b-tooltip.hover.left
							:title="
								client.notes && client.notes.trim().length > 50
									? client.notes
									: ''
							"
							class="table-data table-data--notes table__table-data table__table-data--notes"
						>
							{{ showLongText(client.notes, 20) }}
						</td>

						<td
							class="table-data table-data--btn table__table-data table__table-data--btn"
						>
							<button
								class="data--btn__btn data--btn__btn--edit"
								@click="() => handleClickEditClient(client)"
							>
								Edit
							</button>
						</td>

						<td
							class="table-data table-data--btn table__table-data table__table-data--btn"
						>
							<button
								class="data--btn__btn data--btn__btn--calendar"
								@click="onClickCalendar"
							>
								Calender
							</button>
						</td>

						<td
							class="table-data table-data--btn table__table-data table__table-data--btn"
						>
							<button
								class="data--btn__btn data--btn__btn--sales"
								@click="onClickSales(client)"
							>
								Sales
							</button>
						</td>
					</tr>
				</tbody>
			</table>

			<div v-else class="client-info content__client-info">
				<div
					:key="client.clientId"
					v-for="client in clients"
					class="client-info__info"
				>
					<client-info
						:client="client"
						@onClickSales="onClickSales"
						@onClickCalendar="onClickCalendar"
						@handleClickEditClient="handleClickEditClient"
					/>
				</div>
			</div>

			<div class="page content__page" v-if="page.pageTotal > 1">
				<label class="page-total page__page-total"
					>Page {{ page.pageNumber }} of {{ page.pageTotal }}</label
				>

				<button
					class="page__btn page__btn--go-to-first-page"
					@click="clickGoToFirstPage"
				>
					&lt;&lt;
				</button>

				<button
					class="page__btn page__btn--go-to-previous-page"
					@click="clickGoToPreviousPage"
				>
					&lt;
				</button>

				<button
					class="page__btn page__btn--go-to-next-page"
					@click="clickGoToNextPage"
				>
					>
				</button>

				<button
					class="page__btn page__btn--go-to-last-page"
					@click="clickGoToLastPage"
				>
					>>
				</button>

				<button class="page__btn page__btn--go-to" @click="clickGoto">
					{{ isShowSelectPage ? "Goto" : "Hide" }}
				</button>

				<select
					@click="clickSelectedPage"
					:hidden="isShowSelectPage"
					v-model="page.pageSelected"
				>
					<option
						:key="option.value"
						:value="option.value"
						v-for="option in optionsPage"
					>
						{{ option.text }}
					</option>
				</select>
			</div>
		</div>

		<client-actions
			ref="clientActionsRef"
			@loadClient="loadDataClient"
			@loading="handleSetLoading"
		/>
		<loading v-if="isLoading" class="loading" />
		<notification ref="refNotification" modalTitle="Notification" />
		<sales-action
			ref="refSalesAction"
			@loading="handleSetLoading"
			@loadClient="loadDataClient"
		/>
	</div>
</template>

<script>
import moment from "moment";

import apis from "../../lib/apis";
import common from "@/lib/utils/common";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";

// Components
import Loading from "@/components/Loading/Loading.vue";
import ClientInfo from "@components/Client-Info/Client-Info.vue";
import SalesAction from "@components/Sales-Action/Sales-Action.vue";
import Notification from "@/components/Notification/Notification.vue";
import ClientActions from "@/components/Client-Actions/Client-Actions.vue";

export default {
	name: "ClientPage",
	data() {
		return {
			clients: [],
			name: "ThankZ",
			clientTotal: 0,
			isLoading: false,
			isShowSelectPage: true,
			isShowClientInfo: false,
			windowWidth: window.innerWidth,
			page: {
				pageTotal: 1,
				pageNumber: 1,
				pageSelected: 1,
				pageSize: constant.payload.DEFAULT_PAGE_SIZE,
			},
			fields: {
				registrationDate: { text: "Registered Date" },
				clientName: { text: "Client Name" },
				mobileNumber: { text: "Mobile / Phone" },
				totalSalesAmount: { text: "Total Sales" },
				notes: { text: "Notes" },
			},
		};
	},
	props: {},

	components: {
		Loading,
		ClientInfo,
		SalesAction,
		Notification,
		ClientActions,
	},

	created() {
		this.loadStaffActive();
	},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", this.onResize);
		});
		this.loadDataClient();
		this.handleSetAllSetupSales();
	},

	beforeDestroy() {
		window.removeEventListener("resize", this.onResize);
	},

	computed: {
		optionsPage() {
			const optionsPage = [];

			for (let page = 1; page <= this.page.pageTotal; page++) {
				optionsPage.push({ text: page, value: page });
			}
			return optionsPage;
		},

		statusScreenLaptop() {
			return this.windowWidth > constant.common.screenSize.maxScreenTablet;
		},

		statusScreenTablet() {
			return this.windowWidth > constant.common.screenSize.maxScreenPhone;
		},
	},

	methods: {
		async loadDataClient() {
			this.isLoading = true;

			const data = {
				pageSize: this.page.pageSize,
				pageNumber: this.page.pageNumber,
				shopId: session.shopSession.getShopId(),
			};

			let keysClient = Object.keys(this.fields);

			try {
				const res = await apis.clientApis.getAllClientByShop(data);

				if (res.status !== 200) {
					this.isLoading = false;
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					this.clientTotal = res.data.result.pagingInfo.totalItems;

					this.page.pageTotal = Math.ceil(
						res.data.result.pagingInfo.totalItems /
							res.data.result.pagingInfo.pageSize
					);
					this.clients = res.data.result.items.map(function (item) {
						let client = {};
						client["clientId"] = item.clientId;
						client["memberNumber"] = item.memberNumber;

						for (let key in keysClient) {
							client[keysClient[key]] = item[keysClient[key]];
						}

						client.mobileNumber2 = item.mobileNumber2;
						client.registrationDate = moment(
							common.momentFunctions.UnixMiliSecondsIntoDate(
								item.clientInputDateTimeTS
							)
						).format("YYYY-MM-DD");

						client.phone = "";

						if (client.mobileNumber !== null)
							client.phone += common.commonFunctions.formatPhoneNumber(
								client.mobileNumber
							);

						if (client.mobileNumber2 !== null)
							client.phone += common.commonFunctions.formatPhoneNumber(
								client.mobileNumber2
							);

						if (client.phone[0] === "/") client.phone.splice(0, 1);

						client.totalSales = common.commonFunctions.formatMoneyNumber(
							client.totalSalesAmount
						);

						return client;
					});

					this.isLoading = false;
				} else {
					this.isLoading = false;
					console.log(res.data);
				}

				if (res.isOK === false) {
					this.isLoading = false;
					location.reload();
				}
			} catch (errors) {
				console.log(errors);
			}
		},

		async loadStaffActive() {
			this.isLoading = true;

			const data = {
				shopId: session.shopSession.getShopId(),
			};

			try {
				const resStaffActive = await apis.shopApis.getStaffActive(data);

				if (resStaffActive.status !== 200) {
					this.isLoading = false;
					location.reload();
					throw resStaffActive.message;
				}

				if (resStaffActive.data.isOK)
					session.shopSession.setStaffActive(resStaffActive.data.result);
				else alert("Error Staff Active");

				this.isLoading = false;
			} catch (errors) {
				console.log(errors);
			}
		},

		clickGoToFirstPage() {
			this.page.pageNumber = 1;
			this.page.pageSelected = this.page.pageNumber;
			this.loadDataClient();
		},

		clickGoToPreviousPage() {
			if (this.page.pageNumber !== 1) {
				this.page.pageNumber -= 1;
				this.page.pageSelected = this.page.pageNumber;
			}
			this.loadDataClient();
		},

		clickGoToNextPage() {
			if (this.page.pageNumber !== this.page.pageTotal) {
				this.page.pageNumber += 1;
				this.page.pageSelected = this.page.pageNumber;
			}
			this.loadDataClient();
		},

		clickGoToLastPage() {
			this.page.pageNumber = this.page.pageTotal;
			this.page.pageSelected = this.page.pageNumber;
			this.loadDataClient();
		},

		clickGoto() {
			this.isShowSelectPage = !this.isShowSelectPage;
		},

		clickSelectedPage() {
			if (this.page.pageSelected !== this.page.pageNumber) {
				this.page.pageNumber = this.page.pageSelected;
				this.loadDataClient();
			}
		},

		clickSignout() {
			session.shopSession.removeShopInfo();
			session.shopSession.removeStaffActive();
			session.saleSession.removeSaleAllSetup();
			session.clientSession.removeClientSetup();
			this.$router.push("/login");
		},

		showLongText(text, length) {
			if (text && text.trim().length > length) {
				return text.substring(0, length) + "...";
			}
			return text;
		},

		async handleClickAddClient() {
			const memberNumber = await this.getNextMemberNumber();
			this.$refs.clientActionsRef.showModal({ typeModal: 0, memberNumber });
		},

		async handleClickEditClient(client) {
			this.handleSetLoading(true);

			const data = {
				clientId: client.clientId,
				shopId: session.shopSession.getShopId(),
			};

			try {
				const resDataClient = await apis.clientApis.getClientByClientId(data);

				if (resDataClient.status !== 200) {
					this.handleSetLoading(false);
					location.reload();
					throw resDataClient.message;
				}

				if (resDataClient.data.isOK) {
					this.$refs.clientActionsRef.showModal({
						typeModal: 1,
						dataClient: resDataClient.data.result,
					});
				} else {
					alert("Get Client Error");
				}
			} catch (errors) {
				console.log("Errors", errors);
			}

			this.handleSetLoading(false);
		},

		async getNextMemberNumber() {
			this.handleSetLoading(true);

			const data = {
				shopId: session.shopSession.getShopId(),
			};

			try {
				const resNextMemberNumber = await apis.clientApis.getNextMemberNumber(
					data
				);

				if (resNextMemberNumber.status !== 200) {
					this.handleSetLoading(false);
					location.reload();
					throw resNextMemberNumber.message;
				}

				if (resNextMemberNumber.data.isOK) {
					return resNextMemberNumber.data.result;
				}

				return;
			} catch (errors) {
				console.log(errors);
			}

			this.handleSetLoading(false);
		},

		async handleClickPrintListClient() {
			this.handleSetLoading(true);

			const data = {};
			data.header = "Client List";
			data.title = `Client List Page ${this.page.pageNumber}`;
			data.fileName = `Client_List_Page_${this.page.pageNumber}`;

			data.columns = [
				{ text: "Client No", width: 10 },
				{ text: "Client Name", width: 30 },
				{ text: "Mobile", width: 15 },
				{ text: "Total Sales", width: 20 },
				{ text: "Note", width: 50 },
				{ text: "Registered Date", width: 20 },
			];

			data.rows = [];
			this.clients.map(function (client) {
				const clientRow = [];
				clientRow.push(client.memberNumber);
				clientRow.push(client.clientName);

				let mobileNumber = client.mobileNumber;
				if (mobileNumber) {
					mobileNumber = common.commonFunctions.formatPhoneNumber(mobileNumber);
				}
				clientRow.push(mobileNumber ?? "");

				let totalSalesAmount = common.commonFunctions.formatMoneyNumber(
					client.totalSalesAmount
				);
				clientRow.push(totalSalesAmount ?? 0);

				clientRow.push(client.notes ?? "");
				clientRow.push(client.registrationDate);

				data.rows = [...data.rows, clientRow];
			});

			common.commonFunctions.exportExcel(data);

			this.handleSetLoading(false);
		},

		handleSetLoading(valueLoading) {
			this.isLoading = valueLoading;
		},

		onClickSales(client) {
			const invoiceDateTimeTS = common.momentFunctions.DateNowIntoUnix();
			this.$refs.refSalesAction.showModal({
				type: 0,
				client: client,
				invoiceDateTimeTS,
			});
		},

		onClickCalendar() {
			this.$refs.refNotification.showModal({
				listMessage: [
					{
						errorCode: "Error",
						errorMessage: "Not Support Yet!",
					},
				],
			});
		},

		onResize() {
			this.windowWidth = window.innerWidth;
		},

		onClickShowInfoClient() {
			this.isShowClientInfo = !this.isShowClientInfo;
		},

		async handleSetAllSetupSales() {
			const data = {
				status: 1,
				shopId: session.shopSession.getShopId(),
			};

			this.isLoading = true;

			try {
				const res = await apis.salesApis.getAllSalesSetup(data);

				if (res.status !== 200) {
					this.isLoading = false;
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					await session.saleSession.setSaleAllSetup(res.data.result);
				} else {
					alert(res.errorMessages);
				}

				if (res.isOK === false) {
					this.isLoading = false;
					location.reload();
				}

				this.isLoading = false;
			} catch (errors) {
				this.isLoading = false;
				console.log("errors", errors);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client.scss";
</style>
