<template>
	<div class="good-selected">
		<div v-if="isTypeGood.services" class="good-selected__good-type">
			<table>
				<thead>
					<tr>
						<th v-for="field in fields" :key="field.text">
							{{ field.text }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr 
						:key="index"
						class="good-type__table-data"
						v-for="(goodSelected, index) in goodListSelected"
					>
						<td class="table-data__name">{{ goodSelected.goodInfo.serviceName }}</td>
						<td class="table-data__qty">
							<!-- <input
								min="1"
								max="9999"
								type="number"
								minlength="1"
								maxlength="4"
								class="item__qty"
								v-model="goodSelected.qty"
								oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
							/> -->
							<button class="qty__btn" @click="() => { if(goodSelected.qty !== 1) goodSelected.qty--}">&lt;</button>
							{{ handleFormatNumber(goodSelected.qty) }}
							<button class="qty__btn" @click="() => goodSelected.qty++">></button>
						</td>
						<td class="table-data__btn">
							<button class="btn--del" @click="handleDeleteItem(goodSelected, 1)">X</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-if="isTypeGood.products" class="good-selected__good-type">
			<table>
				<thead>
					<tr>
						<th v-for="field in fields" :key="field.text">
							{{ field.text }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr 
						:key="index"
						class="good-type__table-data"
						v-for="(goodSelected, index) in goodListSelected"
					>
						<td class="table-data__name">{{ showLongText(goodSelected.goodInfo.productName, 15) }}</td>
						<td class="table-data__qty">
							<!-- <input
								min="1"
								max="9999"
								type="number"
								minlength="1"
								maxlength="4"
								class="item__qty"
								v-model="goodSelected.qty"
								oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength); this.value = this.value.toString().replace(/,/g,'')"
							/> -->
							<button class="qty__btn" @click="() => { if(goodSelected.qty !== 1) goodSelected.qty--}">&lt;</button>
							{{ handleFormatNumber(goodSelected.qty) }}
							<button class="qty__btn" @click="() => goodSelected.qty++">></button>
						</td>
						<td class="table-data__btn">
							<button class="btn--del" @click="handleDeleteItem(goodSelected, 2)">X</button>
						</td>
					</tr>
				</tbody>
			</table>
			<!-- <div
				class="good-type__item"
				v-for="(goodSelected, index) in goodListSelected"
				:key="index"
			>
				<div>{{ goodSelected.goodInfo.productName }}</div>
				<input v-model="goodSelected.qty" type="number" min="1" />
				<div>{{ goodSelected.qty }}</div>
				<div @click="handleDeleteItem(goodSelected, 2)">X</div>
			</div> -->
		</div>
		<div v-if="isTypeGood.prepaidService" class="good-selected__good-type">
			<table>
				<thead>
					<tr>
						<th v-for="field in fields" :key="field.text">
							{{ field.text }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr 
						:key="index"
						class="good-type__table-data"
						v-for="(goodSelected, index) in goodListSelected"
					>
						<td class="table-data__name">{{ goodSelected.goodInfo.relatedServiceName }}</td>
						<td class="table-data__qty">
							<button class="qty__btn" @click="() => { if(goodSelected.qty !== 1) goodSelected.qty--}">&lt;</button>
							{{ handleFormatNumber(goodSelected.qty) }}
							<button class="qty__btn" @click="() => goodSelected.qty++">></button>
						</td>
						<td class="table-data__btn">
							<button class="btn--del" @click="handleDeleteItem(goodSelected, 1)">X</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-if="isTypeGood.prepaidCard" class="good-selected__good-type"></div>
		<div
			v-if="isTypeGood.prepaidService"
			class="good-selected__good-type"
		></div>
		<div v-if="isTypeGood.packages" class="good-selected__good-type"></div>
	</div>
</template>

<script>

import common from "@common";

const DEFAULT_FIELDS_SELECTED_ITEM = {
	item: { text: "Selected Items" },
	qty: { text: "Qty" },
	del: { text: "Del" },
}

export default {
	data() {
		return {
			fields: Object.assign({}, DEFAULT_FIELDS_SELECTED_ITEM)
		}
	},

	mounted() {},

	props: {
		isTypeGood: {
			type: Object,
			default: function () {
				return {};
			},
		},

		goodListSelected: {
			type: Array,
			default: function () {
				return [];
			},
		},
	},

	computed: {},

	methods: {
		handleDeleteItem(item, type) {
			if (type === 1) {
				this.$emit(
					"handleDeleteItemSelected",
					item.goodInfo.serviceId.toString()
				);
			}
			if (type === 2) {
				this.$emit(
					"handleDeleteItemSelected",
					item.goodInfo.productId.toString()
				);
			}
		},

		showLongText(text, length) {
			return common.commonFunctions.showLongText(text, length);
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
@import "./GoodSelected.scss";
</style>
