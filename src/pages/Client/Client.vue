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

			<table class="table content__table">
				<thead>
					<tr>
						<th v-for="field in fields" :key="field.text">
							{{ field.text }}
						</th>
						<th colspan="3">Actions</th>
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
								Calender
							</button>
						</td>

						<td
							class="table-data table-data--btn table__table-data table__table-data--btn"
						>
							<button class="data--btn__btn data--btn__btn--sales">
								Sales
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

		<loading v-if="isLoading" />
		<client-actions
			ref="clientActionsRef"
			@loadClient="loadDataClient"
			@loading="handleSetLoading"
		/>
	</div>
</template>

<script>
import moment from "moment";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import apis from "../../lib/apis";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";
import common from "@/lib/utils/common";

export default {
	name: "ClientPage",
	data() {
		return {
			clients: [],
			name: "ThankZ",
			clientTotal: 0,
			isLoading: false,
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
				// edit: { text: "Edit" },
				// calendar: { text: "Calendar" },
				// sales: { text: "Sales" },
			},
		};
	},
	props: {},

	components: {
		"client-actions": () =>
			import("../../components/Client-Actions/Client-Actions.vue"),

		loading: () => import("../../components/Loading/Loading.vue"),
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

			this.isLoading = true;

			try {
				const res = await apis.clientApi.getAllClientByShop(data);

				if (res.status !== 200) {
					this.isLoading = false;
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
							common.momentFunction.UnixMiliSecondsIntoDate(
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
			} catch (errors) {
				console.log(errors);
			}
		},

		async loadStaffActive() {
			const data = {
				shopId: session.shopSession.getShopId(),
			};

			try {
				const resStaffActive = await apis.shopApi.getStaffActive(data);

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
				clientId: client.clientId,
				shopId: session.shopSession.getShopId(),
			};
			try {
				const resDataClient = await apis.clientApi.getClientByClientId(data);

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
				console.log("Errors", errors);
			}
		},

		async getNextMemberNumber() {
			const data = {
				shopId: session.shopSession.getShopId(),
			};

			try {
				const resNextMemberNumber = await apis.clientApi.getNextMemberNumber(
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

		async handleClickPrintListClient() {
			const workbook = new ExcelJS.Workbook();
			let worksheet = workbook.addWorksheet(
				`Client List Page ${this.page.pageNumber}`
			);

			// set header
			worksheet.mergeCells("A1:F1");
			const headerExcel = worksheet.getCell("A1");

			headerExcel.value = "Client List";

			headerExcel.font = {
				family: 4,
				size: 18,
				bold: true,
				name: "Time New Roman",
			};

			headerExcel.height = 40;
			headerExcel.alignment = { vertical: "middle", horizontal: "center" };

			// set column
			const row = worksheet.addRow([
				"Client No",
				"Client Name",
				"Mobile",
				"Total Sales",
				"Note",
				"Registered Date",
			]);

			row.height = 30;
			row.alignment = { vertical: "middle", horizontal: "center" };

			row._cells[0]._column.width = 10;
			row._cells[1]._column.width = 30;
			row._cells[2]._column.width = 15;
			row._cells[3]._column.width = 20;
			row._cells[4]._column.width = 50;
			row._cells[5]._column.width = 20;

			for (let i = 0; i < row._cells.length; i++) {
				row._cells[i].border = {
					top: { style: "thin" },
					left: { style: "thin" },
					right: { style: "thin" },
					bottom: { style: "thin" },
				};
			}

			// set row
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

				const rowClient = worksheet.addRow(clientRow);

				rowClient.height = 20;
				rowClient._cells[4].alignment = { horizontal: "right" };
				rowClient._cells[2].alignment = { horizontal: "right" };
				rowClient._cells[0].alignment = { horizontal: "center" };
				rowClient._cells[3].alignment = { horizontal: "center" };
				rowClient._cells[5].alignment = { horizontal: "center" };

				for (let i = 0; i < rowClient._cells.length; i++) {
					rowClient._cells[i].border = {
						top: { style: "thin" },
						left: { style: "thin" },
						right: { style: "thin" },
						bottom: { style: "thin" },
					};
				}
			});

			workbook.xlsx
				.writeBuffer()
				.then(buffer =>
					saveAs(
						new Blob([buffer]),
						`Client_List_Page_${this.page.pageNumber}.xlsx`
					)
				)
				.catch(err => console.log("Error writing excel export", err));
		},

		handleSetLoading(valueLoading) {
			this.isLoading = valueLoading;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client.scss";
</style>
