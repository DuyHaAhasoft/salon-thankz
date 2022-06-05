<template>
	<div class="group-button">
		<button
			@click="handleClickConfirm"
			class="btn--confirm group-button__btn group-button__btn--confirm"
		>
			Save
		</button>
		<button
			@click="handleClickDelete"
			class="btn--delete group-button__btn group-button__btn--delete"
		>
			Delete
		</button>
		<button
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

	mounted() {},

	methods: {
		handleClickConfirm() {
			alert("Confirm");
		},

		handleClickDelete() {
			alert("Delete");
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
