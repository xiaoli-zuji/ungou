<template>
	<view class="search">
		<icon type="search" class="seach-icon" size="16" color="#bbb"></icon>
		<input type="text" confirm-type="search" @confirm="confirmHandel" v-model="inputValue" placeholder="输入你想要的商品"/>
		<icon v-show="inputValue" @click="clearVal" type="clear" class="clear-icon" size="16" color="#ccc"></icon>
	</view>
</template>

<script>
	export default {
		props: ['keyword'],
		data() {
			return {
				inputValue: this.keyword
			}
		},
		methods: {
			// 清空输入框
			clearVal() {
				this.inputValue = ''
			},
			// 触发搜索按钮事件
			confirmHandel() {
				if (this.inputValue) {
					this.$emit('search', this.inputValue)
				}
			}
		},
		watch: {
			"keyword"(newVal) {
				this.inputValue = newVal
			}
		}
	}
</script>

<style lang="less" scoped>
	.search {
		width: 100%;
		height: 100rpx;
		background-color: #eeeeee;
		box-sizing: border-box;
		padding: 20rpx 16rpx;
		position: relative;

		.seach-icon {
			position: absolute;
			top: 36rpx;
			left: 36rpx;
			font-size: 28rpx;
		}

		.clear-icon {
			position: absolute;
			top: 36rpx;
			right: 36rpx;
			font-size: 28rpx;
			z-index: 999;
		}

		input {
			height: 60rpx;
			font-size: 28rpx;
			background-color: #fff;
			border-radius: 4rpx;
			padding-left: 80rpx;
		}
	}
</style>
