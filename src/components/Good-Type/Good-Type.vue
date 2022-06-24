<template>
	<div class="list-good-type">
		<div 
            :key="index"
            class="good-type"
            @click="() => handleClickGoodType(goodType)" 
            v-for="(goodType, index) in Object.values(goodTypes)" 
            :class="{'good-type--selected': handleGoodTypeSelected(goodType.id)}" 
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
		};
	},

	props: {
		goodTypeSelected: {
			type: Number,
			default: Object.values(constant.sales.itemSalesType)[0].id,
		}
	},

	components: {},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", this.onResize);
		});
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
            this.$emit('handleGoodTypeSelect', goodType.id);
        }
    },
};
</script>

<style lang="scss" scoped>
@import "./Good-Type.scss";
</style>
