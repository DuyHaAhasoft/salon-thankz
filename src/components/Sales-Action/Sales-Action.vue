<template>
	<div class="sales-action">
		<b-modal
			static
			size="xl"
			hide-footer
			ref="salesActionModal"
			header-bg-variant="info"
			:title="typeAction.text"
			:no-close-on-backdrop="true"
			:modal-class="'modal sales-action-modal__modal'"
		>
			<div v-if="!typeAction.type"></div>

			<div v-else>
				<div>Edit Sales</div>
			</div>
		</b-modal>

		<select-sales-item ref="refSelectSalesItem" />
		<loading />
	</div>
</template>

<script>
import constant from "@constant";

//Components
import Loading from "@components/Loading/Loading.vue";
import SelectSalesItem from "@components/Select-Sales-Item/Select-Sales-Item.vue";

const DEFAULT_SALES_ACTION_TYPE = [
	{
		type: 0,
		text: "Add Sales",
	},
	{
		type: 1,
		text: "Edit Sales",
	},
];

export default {
	name: "SalonThankzSalesAction",

	data() {
		return {
			title: "",
			typeAction: {},
			windowWidth: window.innerWidth,
		};
	},

	components: {
		Loading,
		SelectSalesItem,
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
		statusScreenLaptop() {
			return this.windowWidth > constant.common.screenSize.maxScreenLaptop;
		},
	},

	methods: {
		showModal(dataModal) {
			this.typeAction =
				DEFAULT_SALES_ACTION_TYPE[
					DEFAULT_SALES_ACTION_TYPE.findIndex(
						type => type.type === dataModal.type
					)
				];

			this.$refs.salesActionModal && this.$refs.salesActionModal.show();

			if (!this.typeAction.type)
				this.$refs.refSelectSalesItem &&
					this.$refs.refSelectSalesItem.showModal();
		},

		hideModal() {
			this.$refs.salesActionModal && this.$refs.salesActionModal.hide();
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Sales-Action.scss";
</style>
