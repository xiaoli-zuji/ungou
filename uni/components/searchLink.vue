<template>
	<view>
		<view class="search-link">
			<view class="search" @click="toSearch">
				<icon type="search" size="16" color="#bbb"></icon>
				<text>搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			// 跳转到搜索页面
			toSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			}
		}
	}
</script>

<style scoped lang="less">
	// 搜索
	.search-link {
		width: 100%;
		height: 100rpx;
		background-color: #eb4450;
		box-sizing: border-box;
		padding: 20rpx 16rpx;

		.search {
			width: 100%;
			height: 100%;
			background-color: #fff;
			border-radius: 4rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			icon {
				margin-right: 16rpx;
				margin-top: 4rpx;
			}

			text {
				color: #bbb;
				font-size: 32rpx;
			}
		}
	}
</style>
