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
			<button
				@click="handleClickAddClient"
				class="btn-add-client title__btn-add-client"
			>
				Add
			</button>
		</div>
		<div class="content clients-page__content">
			<label class="title content__title"
				>Total {{ clientTotal }} client(s) searched</label
			>
			<table class="table content__table">
				<thead>
					<tr>
						<th v-for="field in fields" :key="field.text">
							{{ field.text }}
						</th>
					</tr>
				</thead>
				<tbody>
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
							{{ client.totalSalesAmount }}
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
							{{ showLongText(client.notes, 50) }}
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
							<button class="data--btn__btn data--btn__btn--calendar">
								&#8594;
							</button>
						</td>
						<td
							class="table-data table-data--btn table__table-data table__table-data--btn"
						>
							<button class="data--btn__btn data--btn__btn--sales">
								&#8594;
							</button>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="page content__page">
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
					v-model="page.pageSelected"
					@click="clickSelectedPage"
					:hidden="isShowSelectPage"
				>
					<option
						v-for="option in optionsPage"
						:value="option.value"
						:key="option.value"
					>
						{{ option.text }}
					</option>
				</select>
			</div>
		</div>

		<client-actions ref="clientActionsRef" @loadClient="loadDataClient" />
	</div>
</template>

<script>
import moment from "moment";

import apis from "../../lib/apis";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";

export default {
	name: "ClientPage",
	data() {
		return {
			clients: [],
			name: "ThankZ",
			clientTotal: 0,
			isShowSelectPage: true,
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
				edit: { text: "Edit" },
				calendar: { text: "Calendar" },
				sales: { text: "Sales" },
			},
		};
	},
	props: {},

	components: {
		"client-actions": () =>
			import("../../components/Client-Actions/Client-Actions.vue"),
	},

	created() {
		this.loadStaffActive();
	},

	mounted() {
		this.loadDataClient();
	},

	computed: {
		optionsPage() {
			const optionsPage = [];
			for (let page = 1; page <= this.page.pageTotal; page++) {
				optionsPage.push({ text: page, value: page });
			}
			return optionsPage;
		},
	},

	methods: {
		async loadDataClient() {
			const data = {
				pageSize: this.page.pageSize,
				pageNumber: this.page.pageNumber,
				shopId: session.shopSession.getShopId(),
			};

			let keysClient = Object.keys(this.fields);

			const res = await apis.clientApi.getAllClientByShop("DEV", data);

			this.clientTotal = res.data.result.pagingInfo.totalItems;

			this.page.pageTotal = Math.ceil(
				res.data.result.pagingInfo.totalItems /
					res.data.result.pagingInfo.pageSize
			);

			this.clients = res.data.result.items.map(function (item) {
				let client = {};
				client["clientId"] = item.clientId;

				for (let key in keysClient) {
					client[keysClient[key]] = item[keysClient[key]];
				}

				client.mobileNumber2 = item.mobileNumber2;
				client.registrationDate = moment(
					client.registrationDate,
					"YYYY-MM-DD"
				).format("YYYY-MM-DD");

				client.phone = "";
				if (client.mobileNumber !== null) client.phone += client.mobileNumber;
				if (client.mobileNumber2 !== null) client.phone += client.mobileNumber2;
				if (client.phone[0] === "/") client.phone.splice(0, 1);

				return client;
			});
		},

		async loadStaffActive() {
			const data = {
				shopId: session.shopSession.getShopId(),
			};

			try {
				const resStaffActive = await apis.shopApi.getStaffActive("DEV", data);

				if (resStaffActive.status !== 200) throw resStaffActive.message;

				if (resStaffActive.data.isOK)
					session.shopSession.setStaffActive(resStaffActive.data.result);
				else alert("Error Staff Active");
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
			session.clientSession.removeClientSetup();
			this.$router.push("/login");
		},

		showLongText(text, length) {
			if (text && text.trim().length > 100) {
				return text.substring(0, length) + "...";
			}
			return text;
		},

		async handleClickAddClient() {
			const memberNumber = await this.getNextMemberNumber();
			this.$refs.clientActionsRef.showModal({ typeModal: 0, memberNumber });
		},

		async handleClickEditClient(client) {
			const data = {
				shopId: session.shopSession.getShopId(),
				clientId: client.clientId,
			};
			try {
				const resDataClient = await apis.clientApi.getClientByClientId(
					"DEV",
					data
				);

				if (resDataClient.status !== 200) throw resDataClient.message;

				if (resDataClient.data.isOK) {
					this.$refs.clientActionsRef.showModal({
						typeModal: 1,
						dataClient: resDataClient.data.result,
					});
				} else {
					alert("Get Client Error");
				}
			} catch (errors) {
				console.log("Errors");
			}
		},

		async getNextMemberNumber() {
			const data = {
				shopId: session.shopSession.getShopId(),
			};

			try {
				const resNextMemberNumber = await apis.clientApi.getNextMemberNumber(
					"DEV",
					data
				);

				if (resNextMemberNumber.status !== 200)
					throw resNextMemberNumber.message;

				if (resNextMemberNumber.data.isOK) {
					return resNextMemberNumber.data.result;
				}

				return;
			} catch (errors) {
				console.log(errors);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client.scss";
</style>
