<template>
	<div class="group-button">
		<button
			:disabled="disableConfirm"
			v-if="isShowButton.confirm"
			@click="handleClickConfirm"
			:class="{ 'group-button__btn--disable': disableConfirm }"
			class="btn--confirm group-button__btn group-button__btn--confirm"
		>
			{{ nameButton.confirm }}
		</button>

		<button
			v-if="isShowButton.delete"
			@click="handleClickDelete"
			class="btn--delete group-button__btn group-button__btn--delete"
		>
			{{ nameButton.delete }}
		</button>

		<button
			v-if="isShowButton.cancel"
			@click="handleClickCancel"
			class="btn--cancel group-button__btn group-button__btn--cancel"
		>
			{{ nameButton.cancel }}
		</button>
	</div>
</template>

<script>
export default {
	name: "SalonThankzGroupButton",

	data() {
		return {};
	},

	props: {
		disableConfirm: {
			type: Boolean,
			default: false,
		},

		isShowButton: {
			type: Object,
			default: function () {
				return {
					delete: true,
					cancel: true,
					confirm: true,
				};
			},
		},

		nameButton: {
			type: Object,
			default: function () {
				return {
					confirm: "Save",
					delete: "Delete",
					cancel: "Cancel",
				};
			},
		},
	},

	mounted() {},

	methods: {
		handleClickConfirm() {
			this.$emit("confirm");
		},

		handleClickDelete() {
			this.$emit("delete");
		},

		handleClickCancel() {
			this.$emit("cancel");
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Group-Button.scss";
</style>
