<template>
	<div class="select-sales-item">
		<b-modal
			static
			size="xl"
			hide-footer
			:title="title"
			ref="selectSalesItemModal"
			header-bg-variant="info"
			:no-close-on-backdrop="true"
			:modal-class="'modal select-sales-item-modal__modal'"
		>
		</b-modal>
	</div>
</template>

<script>
import constant from "@constant";

export default {
	name: "SalonThankzSalesAction",

	data() {
		return {
			windowWidth: window.innerWidth,
		};
	},

	components: {},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", this.onResize);
		});
	},

	beforeDestroy() {
		window.removeEventListener("resize", this.onResize);
	},

	computed: {
		statusScreenLaptop() {
			return this.windowWidth > constant.common.screenSize.maxScreenLaptop;
		},
	},

	methods: {},
};
</script>

<style lang="scss" scoped>
@import "./Select-Sales-Item.scss";
</style>