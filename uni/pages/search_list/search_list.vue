<template>
	<view>
		<!-- 第一种方法:头部固定 -->
		<!-- <view class="top-header" :style="{position:isFixed?'fixed':'static'}"> -->
		<!-- 第二种方法:运用 position:sticky -->
		<view class="top-header">
			<!-- 搜索 -->
			<searchbar @search="doSearch" :keyword="keyword" />
			<!-- 过滤菜单 -->
			<view class="filter-menu">
				<text :class="{active:selectIndex===index}" @click="getSelect(index)" v-for="(item,index) in menuList" :key="index">{{item}}</text>
			</view>
		</view>
		<!-- 商品列表 -->
		<!-- 第一种方法:头部固定 -->
		<!-- <view class="good-list" :style="{marginTop:isFixed?'200rpx':'0'}"> -->
		<view class="good-list">
			<view class="goods" v-for="(item,index) in goodList" :key="index" @click="toItem(item.goods_id)">
				<image :src="item.goods_small_logo" mode=""></image>
				<view class="right">
					<view class="text text-line2">{{item.goods_name}}</view>
					<view class="price"> ￥<text>{{item.goods_price}}</text>.00</view>
				</view>
			</view>
		</view>
		<!-- 提示已经到底了 -->
		<view class="btm-line" v-if="isLastPage">--没有更多了--</view>
	</view>
</template>

<script>
	import searchbar from '../../components/searchBar.vue'
	const PAGE_SIZE = 6
	const HISTORY_KEY = 'history'
	export default {
		components: {
			searchbar
		},
		data() {
			return {
				menuList: ['综合', '销量', '价格'],
				// 选中的菜单下标
				selectIndex: 0,
				// 关键字
				keyword: '',
				// 商品列表
				goodList: [],
				// 是否是最后一页
				isLastPage: false,
				// 第一种方法:头部固定
				// isFixed: false
			}
		},
		onLoad(options) {
			// Vue实例添加属性
			// 页码
			// this.pageNum = 1
			// 是否在请求
			this.isRequest = false
			// 搜索的关键字
			this.keyword = options.cateName
			// 获取商品数据
			this.queryGoodList()
			// 添加关键字到搜索列表
			this.addHistory(this.keyword)
		},
		// 监听页面下拉刷新
		onPullDownRefresh() {
			// 第一种方法:头部固定
			// this.isFixed = false
			this.reload()
		},
		// 监听页面上拉加载
		onReachBottom() {
			// 如果不是最后一页发送请求
			if (!this.isLastPage) {
				// 页码
				this.pageNum++
				this.queryGoodList()
			}
		},
		// 监听页面滚动
		// onPageScroll(){
		// 	// 第一种方法:头部固定
		// 	// this.isFixed = true
		// },
		methods: {
			// 添加历史搜索
			addHistory(inputVal) {
				let _historyList = uni.getStorageSync(HISTORY_KEY)
				// 把输入的内容插入到前面
				_historyList = [inputVal, ..._historyList]
				// 去重
				_historyList = [...new Set(_historyList)]
				// 存储搜索记录
				uni.setStorageSync(HISTORY_KEY, _historyList)
			},
			// 触发搜索按钮事件
			doSearch(inputValue) {
				this.keyword = inputValue
				this.reload()
			},
			// 跳转到商品详情页
			toItem(goodsId) {
				uni.navigateTo({
					url: '/pages/item/item?goodsId=' + goodsId
				})
			},
			// 过滤菜单选中
			getSelect(index) {
				this.selectIndex = index
			},
			// 根据关键字发送请求
			async queryGoodList() {
				if (this.isRequest) {
					return
				}
				this.isRequest = true
				let data = await this.$request({
					url: '/api/public/v1/goods/search',
					data: {
						query: this.keyword,
						pagenum: this.pageNum,
						pagesize: PAGE_SIZE
					},
					// 分页不需要loading
					isloading: false
				})
				// 请求结束后,停止下拉刷新动画
				uni.stopPullDownRefresh()
				// 请求结束后,设置请求状态为请求结束
				this.isRequest = false

				// 追加商品列表数据
				this.goodList = [...this.goodList, ...data.goods]
				// 判断是否是最后一页
				if (data.total <= this.goodList.length) {
					this.isLastPage = true
				}

			},
			// 输入框以及下拉触发的搜索
			reload() {
				// 更改是否是最后一页状态
				this.isLastPage = false
				// 重新加载第一页数据
				this.pageNum = 1
				// 清空商品列表
				this.goodList = []
				this.queryGoodList()
			}
		}
	}
</script>

<style lang="less">
	// 第一种方法:头部固定
	// .top-header{
	// 	position: static;
	// 	left: 0;
	// 	top: 0;
	// 	width: 100%;
	// 	background-color: #fff;
	// }
	// 第二种方法 运用 position:sticky
	.top-header {
		position: sticky;
		left: 0;
		top: 0;
		right: 0;
		width: 100%;
		background-color: #fff;
		z-index: 999;
	}

	// 过滤菜单
	.filter-menu {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100rpx;

		.active {
			color: #eb4450;
		}
	}

	// 商品列表
	.good-list {
		.goods {
			display: flex;
			align-items: center;
			height: 260rpx;
			padding: 0 20rpx;
			border-top: 1px solid #ddd;

			>image {
				width: 200rpx;
				height: 200rpx;
			}

			.right {
				flex: 1;
				margin-left: 26rpx;

				.price {
					margin-top: 80rpx;
					font-size: 24rpx;
					color: #eb4450;

					text {
						font-size: 36rpx;
					}
				}
			}
		}
	}

	.btm-line {
		text-align: center;
		padding: 20rpx 0;
	}
</style>
