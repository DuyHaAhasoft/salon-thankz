<template>
	<div class="group-button">
		<button
			v-if="isShowButton.confirm"
			:disabled="disableConfirm"
			@click="handleClickConfirm"
			class="btn--confirm group-button__btn group-button__btn--confirm"
		>
			Save
		</button>

		<button
			v-if="isShowButton.delete"
			@click="handleClickDelete"
			class="btn--delete group-button__btn group-button__btn--delete"
		>
			Delete
		</button>
		
		<button
			v-if="isShowButton.cancel"
			@click="handleClickCancel"
			class="btn--cancel group-button__btn group-button__btn--cancel"
		>
			Cancel
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
			default: false
		},

		isShowButton: {
			type: Object,
			default:  function() {
				return {
					delete: true,
					cancel: true,
					confirm: true,
				}
			}
		}
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
