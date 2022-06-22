<template>
	<div class="list-good-type">
		<div 
            :key="index"
            class="good-type"
            @click="() => handleClickGoodType(goodType)" 
            v-for="(goodType, index) in Object.values(goodTypes)" 
            :class="{'good-type--selected': handleGoodTypeSelected(goodType.text)}" 
        >
            {{ goodType.text }}
        </div>
	</div>
</template>

<script>
import constant from "@constant";

export default {
	name: "SalonThankzGoodType",

	data() {
		return {
			windowWidth: window.innerWidth,
            goodTypes: Object.assign({}, constant.sales.itemSalesType),
            goodTypeSelected: Object.values(constant.sales.itemSalesType)[0].text,
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

	methods: {
        handleGoodTypeSelected(goodType) {
            return goodType === this.goodTypeSelected
        },

        handleClickGoodType(goodType) {
            this.goodTypeSelected = goodType.text;
            this.$emit('handleGoodTypeSelect', goodType.id);
        }
    },
};
</script>

<style lang="scss" scoped>
@import "./Good-Type.scss";
</style>
