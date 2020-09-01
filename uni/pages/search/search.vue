<template>
	<view>
		<searchbar ref="clearvalue" @search="toSearchList" />
		<view class="history-search">
			<view class="title"  >
				<text class="title">历史搜索</text>
				<icon type="clear" @click="clearHistory" v-show="clearBtn" size="18">
				</icon>
			</view>
			<view class="history">
				<view v-for="(item , index) in historyList" @click="toSearchList(item)" :key="index">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const HISTORY_KEY = 'history'
	import searchbar from '../../components/searchBar.vue'
	export default {
		components: {
			searchbar
		},
		data() {
			return {
				// 历史搜索列表
				historyList: [],
				// 清除按钮
				clearBtn: false
			}
		},
		onShow() {
			this.historyList = uni.getStorageSync(HISTORY_KEY) || []
			this.$refs.clearvalue.inputValue = ''			
		},
		watch:{
			historyList(){
				// 判断搜索列表是否有值
				if(this.historyList.length === 0){
					this.clearBtn = false
				}else{
					this.clearBtn = true
				}
			}
		},
		methods: {
			
			toSearchList(inputVal) {
				// let _historyList = uni.getStorageSync(HISTORY_KEY)
				// // 把输入的内容插入到前面
				// _historyList = [inputVal,..._historyList]
				// // 去重
				// _historyList = [...new Set(_historyList)]
				// // 存储搜索记录
				// uni.setStorageSync(HISTORY_KEY,_historyList)
				uni.navigateTo({
					url: '/pages/search_list/search_list?cateName=' + inputVal
				})
			},
			// 清除历史搜索记录
			clearHistory() {
				uni.showModal({
					title:'提示',
					content: '你确定要删除吗?',
					success:(res)=> {
						if (res.confirm) {
							// 确定删除
							// 清空本地储存
							uni.removeStorageSync(HISTORY_KEY)
							// 清空搜索列表
							this.historyList = []
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.history-search {
		color: #333;
		font-size: 28rpx;
		padding: 30rpx 30rpx 30rpx 15rpx;

		.title {
			display: flex;
			justify-content: space-between;
		}

		.history {
			display: flex;
			flex-wrap: wrap;
			margin-top: 30rpx;

			view {
				height: 64rpx;
				line-height: 64rpx;
				padding: 0 26rpx;
				background-color: #ddd;
				margin: 0 30rpx 16rpx 0;
			}
		}
	}
</style>
