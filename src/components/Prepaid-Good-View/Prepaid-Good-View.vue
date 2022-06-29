<template>
	<div class="prepaid-good-info" :class="{ 'is-expired': isExpired }">
		<div class="prepaid-good-info__title">
			<div class="title__name">
				<div class="name__text">
					{{ prepaidGoodInfo[Object.keys(prepaidGoodField)[0]] }}
				</div>
				<div class="name__button">
					<button @click="onClickShowPrepaidGood">
						{{ isShowPrepaidGood ? `&#x21E7;` : `&#x21E8;` }}
					</button>
				</div>
			</div>
			<div
				class="title__more"
				v-for="field in Object.keys(prepaidGoodField).slice(1, 3)"
				:key="field"
			>
				<div class="more__title">
					<slot :name="field + 'Field'" :[field]="prepaidGoodField[field]">
						{{ prepaidGoodField[field].text }}
					</slot>
				</div>
				<div class="more__detail">
					<slot :name="field" :[field]="prepaidGoodInfo[field]">
						{{ prepaidGoodInfo[field] }}
					</slot>
				</div>
			</div>
		</div>

		<div v-if="isShowPrepaidGood" class="prepaid-good-info__more">
			<div
				:key="field"
				class="more__detail"
				v-for="field in Object.keys(prepaidGoodField).slice(3)"
			>
				<div class="detail__title">
					<slot :name="field + 'Field'" :[field]="prepaidGoodField[field]">
						{{ prepaidGoodField[field].text }}
					</slot>
				</div>
				<div class="detail__detail">
					<slot :name="field" :[field]="prepaidGoodInfo[field]">
						{{ prepaidGoodInfo[field] }}
					</slot>
				</div>
			</div>
			<div class="more__group-button">
				<button v-if="typePrepaidGood && !isExpired" @click="handleDeduct">
					Deduct
				</button>
				<button @click="handleView">View</button>
				<button @click="handleEdit">Edit</button>
			</div>
		</div>

		<hr />
	</div>
</template>

<script>
import common from "@common";
import constant from "@constant";

export default {
	name: "SalonThankzPrepaidGoodView",

	data() {
		return {
			isShowPrepaidGood: false,
		};
	},

	props: {
		prepaidGoodInfo: {
			type: Object,
			default: function () {
				return {};
			},
		},

		prepaidGoodField: {
			type: Object,
			default: function () {
				return {};
			},
		},

		typePrepaidGood: {
			type: Number,
			default: constant.sales.typePrepaidGood.card,
		},
	},

	mounted() {},

	computed: {
		isExpired() {
			return (
				(!this.typePrepaidGood && this.prepaidGoodInfo?.isExpired) ||
				(this.typePrepaidGood &&
					(this.prepaidGoodInfo?.quantity === 0 ||
						(this.prepaidGoodInfo?.expiryDateTS !== -1 &&
							this.prepaidGoodInfo?.expiryDateTS <
								common.momentFunctions.DateNowIntoUnix())))
			);
		},
	},

	methods: {
		onClickShowPrepaidGood() {
			this.isShowPrepaidGood = !this.isShowPrepaidGood;
		},

		handleDeduct() {
			this.$emit("handleDeduct");
		},

		handleView() {
			this.$emit("handleView");
		},

		handleEdit() {
			this.$emit("handleEdit");
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Prepaid-Good-View.scss";
</style>
