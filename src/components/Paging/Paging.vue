<template>
	<div class="paging">
		<label class="page-total paging__page-total"
			>Page {{ page.pageNumber }} of {{ page.pageTotal }}</label
		>

		<button
			class="paging__btn paging__btn--go-to-first-page"
			@click="clickGoToFirstPage"
		>
			&lt;&lt;
		</button>

		<button
			class="paging__btn paging__btn--go-to-previous-page"
			@click="clickGoToPreviousPage"
		>
			&lt;
		</button>

		<button
			class="paging__btn paging__btn--go-to-next-page"
			@click="clickGoToNextPage"
		>
			>
		</button>

		<button
			class="paging__btn paging__btn--go-to-last-page"
			@click="clickGoToLastPage"
		>
			>>
		</button>

		<button class="paging__btn paging__btn--go-to" @click="clickGoto">
			{{ isShowSelectPage ? "Goto" : "Hide" }}
		</button>

		<select
			v-model="pageSelected"
			@click="clickSelectedPage"
			:hidden="isShowSelectPage"
		>
			<option
				v-for="option in optionsPage"
				:value="option.value"
				:key="option.value"
			>
				{{ option.text }}
			</option>
		</select>
	</div>
</template>

<script>
const DEFAULT_PAGING = {
	pageTotal: 1,
	pageNumber: 1,
};

export default {
	name: "SalonThankzPaging",

	data() {
		return {
			pageSelected: 1,
			isShowSelectPage: true,
			// page: Object.assign({}, DEFAULT_PAGING),
		};
	},

	props: {
		page: {
			type: Object,
			default: function () {
				return Object.assign({}, DEFAULT_PAGING);
			},
		},
	},

	computed: {
		optionsPage() {
			const optionsPage = [];

			for (let page = 1; page <= this.page.pageTotal; page++) {
				optionsPage.push({ text: page, value: page });
			}
			return optionsPage;
		},
	},

	mounted() {},

	methods: {
		clickGoToFirstPage() {
			this.pageSelected = 1;
			this.$emit("handlePaging", { pageNumber: 1 });
		},

		clickGoToPreviousPage() {
			if (this.page.pageNumber > 1) {
				this.pageSelected = this.page.pageNumber - 1;
				this.$emit("handlePaging", { pageNumber: this.page.pageNumber - 1 });
			}
		},

		clickGoToNextPage() {
			if (this.page.pageNumber < this.page.pageTotal) {
				this.pageSelected = this.page.pageNumber + 1;
				this.$emit("handlePaging", { pageNumber: this.page.pageNumber + 1 });
			}
		},

		clickGoToLastPage() {
			this.pageSelected = this.page.pageTotal;
			this.$emit("handlePaging", { pageNumber: this.page.pageTotal });
		},

		clickSelectedPage() {
			if (this.pageSelected !== this.page.pageNumber) {
				this.$emit("handlePaging", { pageNumber: this.pageSelected });
			}
		},

		clickGoto() {
			this.isShowSelectPage = !this.isShowSelectPage;
		},
	},
};
</script>

<style lang="scss" scoped>
@import "./Paging.scss";
</style>
