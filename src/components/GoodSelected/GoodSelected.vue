<template>
  <div class="good-selected">
    <div v-if="isTypeGood.services" class="good-selected__good-type">
        <div class="good-type__item" v-for="(goodSelected, index) in goodListSelected" :key="index">
            <div>{{goodSelected.goodInfo.serviceName}}</div>
            <div>{{goodSelected.qty}}</div>
            <div @click="handleDeleteItem(goodSelected, 1)">X</div>
        </div>
    </div>
    <div v-if="isTypeGood.products" class="good-selected__good-type">
        <div class="good-type__item" v-for="(goodSelected, index) in goodListSelected" :key="index">
            <div>{{goodSelected.goodInfo.productName}}</div>
            <div>{{goodSelected.qty}}</div>
            <div @click="handleDeleteItem(goodSelected, 2)">X</div>
        </div>
    </div>
    <div v-if="isTypeGood.prepaidCard" class="good-selected__good-type"></div>
    <div v-if="isTypeGood.prepaidService" class="good-selected__good-type"></div>
    <div v-if="isTypeGood.packages" class="good-selected__good-type"></div>
  </div>
</template>

<script>
export default {
    mounted() {
        console.log('goodListSelected', this.goodListSelected)
    },
    
    props: {
        isTypeGood: {
            type: Object,
            default: function() {
                return {};
            }
        },

        goodListSelected: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },

    computed: {},

    methods: {
        handleDeleteItem(item, type) {
            if(type === 1){
                this.$emit('handleDeleteItemSelected', item.goodInfo.serviceId.toString())
            }
            if(type === 2){
                this.$emit('handleDeleteItemSelected', item.goodInfo.productId.toString())
            }
        },
    },
}
</script>

<style lang="scss" scoped>
    @import "./GoodSelected.scss";
</style>