<template>
	<div class="client-info">
		<div class="client-info__title">
			<div class="title__text">
				<div
					v-b-tooltip.hover.right
					:title="client.clientName.length > 25 ? client.clientName : ''"
					class="text__name"
				>
					{{ client.clientName }}
				</div>
				<div v-if="client.phone">{{ `(${client.phone})` }}</div>
				<div class="text__date">{{ client.registrationDate }}</div>
			</div>
			<div class="title__group-button">
				<div
					class="group-button-action group-button__group-button-action"
					v-if="statusScreenTablet"
				>
					<button @click="handleClickEditClient">Edit</button>
					<button @click="onClickCalendar">Calendar</button>
					<button @click="onClickSales">Sales</button>
				</div>
				<button @click="onClickShowInfoClient">
					{{ isShowClientInfo ? `&#x21E7;` : `&#x21E8;` }}
				</button>
			</div>
		</div>

		<div class="client-info__content" v-if="isShowClientInfo">
			<div class="content__data" v-if="client.phone">
				<div class="data__title">Phone Number</div>
				<div>{{ client.phone }}</div>
			</div>

			<div class="content__data">
				<div class="data__title">Total Sales</div>
				<div>{{ client.totalSales }}</div>
			</div>

			<div
				v-if="client.notes"
				v-b-tooltip.hover.right
				class="content__data content__data--notes"
				:title="client.notes.length > 30 ? client.notes : ''"
			>
				{{ showLongText(client.notes, 30) }}
			</div>

			<div
				class="group-button-action content__group-button"
			>
				<button @click="handleClickEditClient">Edit</button>
				<button @click="onClickCalendar">Calendar</button>
				<button @click="onClickSales">Sales</button>
			</div>
		</div>
	</div>
</template>

<script>
import constant from "../../lib/utils/constant";
import common from "../../lib/utils/common";

export default {
	name: "SalonThankzClientInfo",

	data() {
		return {
			isShowClientInfo: false,
			windowWidth: window.innerWidth,
		};
	},

	props: {
		client: {
			type: Object,
			default: function () {
				return constant.payload.DEFAULT_DATA_CLIENT;
			},
		},
	},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize",this.onResize);
		});
	},

	beforeDestroy() {
		window.removeEventListener("resize", this.onResize);
	},

	computed: {
		statusScreenTablet() {
			return this.windowWidth > constant.common.screenSize.maxScreenPhone*1.2;
		},
	},

	methods: {
		showLongText(text, length) {
			return common.commonFunctions.showLongText(text, length);
		},

		handleClickEditClient() {
			this.$emit("handleClickEditClient", this.client);
		},

		onClickCalendar() {
			this.$emit("onClickCalendar");
		},

		onClickSales() {
			this.$emit("onClickSales");
		},

		onClickShowInfoClient() {
			this.isShowClientInfo = !this.isShowClientInfo;
		},

		onResize() {
			this.windowWidth = window.innerWidth;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Client-Info.scss";
</style>
