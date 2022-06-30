<template>
	<div class="prepaid-good-history-modal">
		<b-modal
			static
			size="xl"
			hide-footer
			:title="title"
			header-bg-variant="info"
			:no-close-on-backdrop="true"
			ref="prepaidGoodHistoryModal"
			:modal-class="'modal prepaid-good-history-modal__modal'"
			hide="onReset"
		>
			<div class="good-name modal__good-name">
				{{
					!!infoPrepaidGood &&
					infoPrepaidGood[0] &&
					showLongText(infoPrepaidGood[0].cardName, 40)
				}}
			</div>
			<table
				class="table tab__table"
				v-if="!!infoPrepaidGood && (statusScreenLaptop || !isShowHistory)"
			>
				<thead>
					<tr>
						<th v-for="field in fields" :key="field.text">
							{{ field.text }}
						</th>
						<th>Detail</th>
					</tr>
				</thead>
				<tbody v-if="isShowHistory">
					<tr v-for="good in infoPrepaidGood" :key="good.id">
						<td class="table__table-data table__table-data--created-date-time">
							{{ handleFormatDateTime(good.createdDateTimeTS) }}
						</td>
						<td class="table__table-data table__table-data--action">
							{{ good.actionHistoryText }}
						</td>
						<td class="table__table-data table__table-data--balance">
							{{
								handleFormatChangeBalance(
									handleFormatNumber(good.balance - good.balanceBeforeChange)
								)
							}}
						</td>
						<td class="table__table-data table__table-data--balance">
							{{ handleFormatNumber(good.balance) }}
						</td>
						<td class="table__table-data table__table-data--notes">
							{{ !!good.notes && good.notes.systemNotes }}
						</td>
						<td class="table__table-data table__table-data--btn">
							<button
								v-if="handleShowButtonView(good.prepaidCardHistoryType)"
								class="data--btn__btn data--btn__btn--view"
								@click="() => onClickShowSalesDetail(good)"
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
				class="small-screen"
				v-if="!!infoPrepaidGood && !statusScreenLaptop && isShowHistory"
			>
				<div
					:key="good.id"
					v-for="good in infoPrepaidGood"
					class="small-screen__prepaid-good"
				>
					<div class="prepaid-good__header">
						<div>
							{{ handleFormatDateTime(good.createdDateTimeTS) }}
						</div>
						<div>
							{{ good.actionHistoryText }}
						</div>
					</div>
					<div class="prepaid-good__balance">
						Balance: {{ handleFormatNumber(good.balanceBeforeChange) }} &rarr;
						{{ handleFormatNumber(good.balance) }}
					</div>
					<div class="prepaid-good__notes">
						{{ !!good.notes && showLongText(good.notes.systemNotes, 30) }}
					</div>
					<button
						v-if="handleShowButtonView(good.prepaidCardHistoryType)"
						class="prepaid-good__btn"
						@click="() => onClickShowSalesDetail(good)"
					>
						View
					</button>
					<hr />
				</div>
			</div>

			<paging
				v-if="page.pageTotal > 1"
				:page="page"
				@handlePaging="handleGetHistoryPrepaidGood"
			/>
			<footer class="footer modal__footer">
				<group-button
					@cancel="onClickCancel"
					:isShowButton="isShowGroupButton"
				/>
			</footer>
		</b-modal>

		<sales-detail ref="refSalesDetail" />
	</div>
</template>

<script>
import apis from "../../lib/apis";
import common from "@/lib/utils/common";
import session from "../../lib/utils/session";
import constant from "../../lib/utils/constant";

import Paging from "@components/Paging/Paging.vue";
import SalesDetail from "../Sales-Detail/Sales-Detail.vue";
import GroupButton from "../Group-Button/Group-Button.vue";

const DEFAULT_FIELDS_TABLE = {
	createdDateTime: { text: "Created Date Time" },
	action: { text: "Action" },
	change: { text: "Change" },
	balance: { text: "Balance" },
	notes: { text: "Notes" },
};

const DEFAULT_GROUP_BUTTON = {
	cancel: true,
	delete: false,
	confirm: false,
};

const DEFAULT_PAGING = {
	pageTotal: 1,
	pageNumber: 1,
};

export default {
	name: "SalonThankzPrepaidGoodHistory",

	data() {
		return {
			title: "",
			infoPrepaidGood: null,
			windowWidth: window.innerWidth,
			page: Object.assign({}, DEFAULT_PAGING),
			fields: Object.assign({}, DEFAULT_FIELDS_TABLE),
			isShowGroupButton: Object.assign({}, DEFAULT_GROUP_BUTTON),
		};
	},

	components: {
		Paging,
		GroupButton,
		SalesDetail,
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
		isShowHistory() {
			return this.infoPrepaidGood.length;
		},

		statusScreenLaptop() {
			return this.windowWidth > constant.common.screenSize.maxScreenLaptop;
		},
	},

	methods: {
		showModal(dataModal) {
			this.title = dataModal.title;

			this.infoPrepaidGood = dataModal.dataPrepaidCard.items;

			this.page = {
				pageTotal: Math.ceil(
					dataModal.dataPrepaidCard?.pagingInfo?.totalItems /
						dataModal.dataPrepaidCard?.pagingInfo?.pageSize
				),
				pageNumber: dataModal.dataPrepaidCard?.pagingInfo?.pageNumber,
			};

			this.infoPrepaidGood.map(item => {
				const actionHistory = constant.sales.prepaidCardHistoryType.find(
					type => type.value === item.prepaidCardHistoryType
				);
				!!actionHistory && (item.actionHistoryText = actionHistory?.text);
			});

			this.$refs.prepaidGoodHistoryModal &&
				this.$refs.prepaidGoodHistoryModal.show();
		},

		hideModal() {
			this.$refs.prepaidGoodHistoryModal &&
				this.$refs.prepaidGoodHistoryModal.hide();
		},

		onClickCancel() {
			this.hideModal();
		},

		async onClickShowSalesDetail(good) {
			const data = {
				status: good.salesStatus,
				salesNumber: good.salesNumber,
				shopId: session.shopSession.getShopId(),
			};

			try {
				this.$emit("loading", true);

				const res = await apis.salesApis.getSalesDetail(data);

				if (res.status !== 200) {
					this.$emit("loading", false);
					location.reload();
					throw res;
				}

				if (res.data.isOK) {
					const salesDetail = res.data.result;
					this.$emit("loading", false);
					this.$refs.refSalesDetail.showModal({
						title: "Sales Detail",
						salesDetail,
					});
				} else {
					console.log(res, data);
					this.$emit("loading", false);
				}

				if (res.isOK === false) {
					this.$emit("loading", false);
					location.reload();
				}
			} catch (errors) {
				console.log(errors);
			}
		},

		handleFormatDateTime(date) {
			return common.momentFunctions.FormatDateTime(
				common.momentFunctions.UnixMiliSecondsIntoDate(date)
			);
		},

		handleFormatNumber(data) {
			const number = !!data && common.commonFunctions.formatMoneyNumber(data);
			if (data > 0) return number;
			if (number === false) return 0;
			return number;
		},

		handleFormatChangeBalance(balance) {
			if (balance[0] !== "-" && balance !== 0) return `+${balance}`;
			return balance;
		},

		handleShowButtonView(typeHistory) {
			return [
				constant.sales.prepaidCardHistoryTypeEnum.sales,
				constant.sales.prepaidCardHistoryTypeEnum.refund,
				constant.sales.prepaidCardHistoryTypeEnum.deduction,
				constant.sales.prepaidCardHistoryTypeEnum.salesEdited,
				constant.sales.prepaidCardHistoryTypeEnum.salesDeleted,
				constant.sales.prepaidCardHistoryTypeEnum.refundDeleted,
				constant.sales.prepaidCardHistoryTypeEnum.deductionEdited,
				constant.sales.prepaidCardHistoryTypeEnum.deductionDeleted,
			].includes(typeHistory);
		},

		handleGetHistoryPrepaidGood({ pageNumber = 1 }) {
			this.$emit("showHistoryPrepaidGoodPaging", {
				pageNumber,
				id: this.infoPrepaidGood[this.infoPrepaidGood.length - 1]
					.clientPrepaidCardId,
				clientId:
					this.infoPrepaidGood[this.infoPrepaidGood.length - 1].clientId,
			});
		},

		onResize() {
			this.windowWidth = window.innerWidth;
		},

		onReset() {
			this.infoPrepaidGood = null;
		},

		showLongText(text, length = 20) {
			return common.commonFunctions.showLongText(text, length);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Prepaid-Good-History.scss";
</style>
