<template>
	<div class="select-prepaid-service">
		<div class="type-show-prepaid-service">
			<button
				class="btn btn--sales"
				:class="{ 'btn--selected': isShowPService }"
				@click="handleGetSalePrepaidService"
			>
				Sale Prepaid Services
			</button>
			<button
				class="btn btn--uses"
				:class="{ 'btn--selected': !isShowPService }"
				@click="handleGetUserPrepaidService"
			>
				Deduct Prepaid Services
			</button>
		</div>
		<div class="category-prepaid-service" v-if="isShowPService">
			<div class="category">
				<div class="title category__title">Category</div>
				<div class="list-category">
					<div
						v-for="category in categories"
						:key="category.orderNo"
						class="category__info"
						:class="{
							'category__info--selected':
								category.serviceCategoryId === categoryIdSelected,
						}"
						@click="
							handleGetPrepaidServiceByCategory(
								category.serviceCategoryId,
								category.serviceCategoryName
							)
						"
					>
						{{ category.serviceCategoryName }}
					</div>
				</div>
			</div>
			<div class="card">
				<div class="title card__title">Prepaid Service</div>
				<div class="list-card">
					<div
						v-for="good in goodList"
						:key="good.prepaidServiceId"
						class="card__info"
						@click="selectedPrepaidService(good, categoryIdSelected)"
					>
						{{ good.prepaidServiceName }}
					</div>
				</div>
			</div>
		</div>
		<div v-else class="tab__table">
			<table class="table tab__table">
				<thead>
					<tr>
						<th
							v-for="field in fields"
							:key="field.text"
							:class="{ 'th-no-data': statusScreenPhone }"
						>
							{{ field.text }}
						</th>
					</tr>
				</thead>
				<tbody v-if="showTable">
					<tr v-for="(good, index) in goodList" :key="index">
						<td class="table__table-data">
							{{ showLongText(good.prepaidServiceName, 15) }}
						</td>
						<td class="table__table-data">
							{{ handleFormatNumber(good.quantity) }}
						</td>
						<td class="table__table-data">
							{{ handleFormatDate(good.invoiceDateTimeTS) }}
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td class="table__no-data" colspan="9">No data</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import common from "../../lib/utils/common";
import constant from "../../lib/utils/constant";

const FIELDS_TABLE = {
	prepaidServiceName: { text: "Prepaid Service Name" },
	quantity: { text: "Remaining Quantity" },
	expiryDateTS: { text: "Expiry Date" },
};

export default {
	data() {
		return {
			isShowPService: true,
			windowWidth: window.innerWidth,
			fields: Object.assign({}, FIELDS_TABLE),
			categoryIdSelected: this.categories?.[0]?.serviceCategoryId ?? 0,
		};
	},

	props: {
		categories: {
			type: Array,
			default: function () {
				return [];
			},
		},

		goodList: {
			type: Array,
			default: function () {
				return [];
			},
		},
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
		statusScreenPhone() {
			return this.windowWidth <= constant.common.screenSize.maxScreenPhone;
		},

		showTable() {
			return this.goodList.length;
		},
	},

	methods: {
		handleGetPrepaidServiceByCategory(serviceCategoryId, serviceCategoryName) {
			this.categoryIdSelected = serviceCategoryId;

			this.$emit("handleGetPrepaidServiceByCategory", {
				serviceCategoryId,
				serviceCategoryName,
			});
		},

		handleGetSalePrepaidService() {
			const categoryFirst = this.categories?.[0] ?? {};

			this.isShowPService = true;

			const categoryDefault = {
				serviceCategoryId: categoryFirst?.serviceCategoryId ?? 0,
				serviceCategoryName: categoryFirst?.serviceCategoryName ?? "",
			};

			this.serviceCategoryId = categoryDefault.serviceCategoryId;

			this.$emit("handleGetPrepaidServiceByCategory", {
				serviceCategoryId: categoryDefault.serviceCategoryId,
				serviceCategoryName: categoryDefault.serviceCategoryName,
			});
		},

		handleGetUserPrepaidService() {
			this.isShowPService = false;

			this.$emit("handleGetUserPrepaidService");
		},

		handleFormatDate(date) {
			if (date === -1) return "No Limit";

			return common.momentFunctions.FormatDate(
				common.momentFunctions.UnixMiliSecondsIntoDate(date)
			);
		},

		handleFormatNumber(balance) {
			if (balance === -1) return "No Limit";
			return common.commonFunctions.formatMoneyNumber(balance);
		},

		showLongText(text, length) {
			return common.commonFunctions.showLongText(text, length);
		},

		onResize() {
			this.windowWidth = window.innerWidth;
		},

		selectedPrepaidService(good = null, categoryId = 0) {
			const categorySelected = this.categories.find(
				category => category.serviceCategoryId === categoryId
			);
			this.$emit("handleSelectPrepaidService", {
				prepaidService: good,
				category: categorySelected,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./SelectPrepaidService.scss";
</style>
