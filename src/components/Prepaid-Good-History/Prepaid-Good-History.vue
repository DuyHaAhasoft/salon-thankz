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
		>
			<div class="good-name modal__good-name">
				{{ !!infoPrepaidGood && infoPrepaidGood.cardName }}
			</div>
			<table class="table tab__table" v-if="!!infoPrepaidGood">
				<thead>
					<tr>
						<th v-for="field in fields" :key="field.text">
							{{ field.text }}
						</th>
						<th>Detail</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="good in infoPrepaidGood" :key="good.id">
						<td class="table__table-data table__table-data--created-date-time">
							{{ handleFormatDateTime(good.createdDateTimeTS) }}
						</td>
						<td class="table__table-data table__table-data--action">
							{{ good.salesStatus }}
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
								v-if="good.notes.systemNotes === 'Initial Balance'"
								class="data--btn__btn data--btn__btn--view"
								@click="() => onClickShowSalesDetail(good)"
							>
								View
							</button>
						</td>
					</tr>
				</tbody>
			</table>
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
import session from "../../lib/utils/session";
import common from "@/lib/utils/common";

import SalesDetail from "../Sales-Detail/Sales-Detail.vue";
import GroupButton from "../Group-Button/Group-Button.vue";

const DEFAULT_FIELDS_TABLE = {
	createdDateTime: { text: "Created Date Time" },
	action: { text: "Action" },
	change: { text: "Change" },
	balance: { text: "Balance" },
	notes: { text: "Notes" },
};

export default {
	name: "SalonThankzPrepaidGoodHistory",

	data() {
		return {
			title: "",
			infoPrepaidGood: null,
			fields: Object.assign({}, DEFAULT_FIELDS_TABLE),
			isShowGroupButton: {
				cancel: true,
				delete: false,
				confirm: false,
			},
		};
	},

	components: {
		GroupButton,
		SalesDetail,
	},

	mounted() {},

	methods: {
		showModal(dataModal) {
			this.title = dataModal.title;
			this.infoPrepaidGood = dataModal.dataPrepaidCard.items;
			console.log("dataModal", this.infoPrepaidGood);
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
			} catch (errors) {
				console.log(errors);
			}
		},

		handleFormatDateTime(date) {
			return common.momentFunction.FormatDateTime(
				common.momentFunction.UnixMiliSecondsIntoDate(date)
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
	},
};
</script>

<style lang="scss" scoped>
@import "./Prepaid-Good-History.scss";
</style>
