<template>
	<view class="wrapper">

		<swiper class="swiper" indicator-dots autoplay circular indicator-color="#ccc" indicator-active-color="#fff">
			<!-- <block v-for="(item, index) in goodInfo.pics" :key="index"> -->
			<swiper-item @click="prevImg(index)" v-for="(item, index) in goodInfo.pics" :key="index">
				<image class="swiper-img" :src="item.pics_big"></image>
			</swiper-item>
			<!-- </block> -->
		</swiper>
		<!-- 商品信息 -->
		<view class="goods-info">
			<view class="price">￥{{goodInfo.goods_price}}</view>
			<view class="name-favo">
				<view class="name">{{goodInfo.goods_name}}</view>
				<view class="favo">
					<text class="iconfont icon-share"></text>
					<text>分享</text>
					<button open-type="share">分享</button>
				</view>
			</view>
			<view class="express">快递: 免运费</view>
		</view>
		<view class="promote">
			<view>
				<text class="name">促销</text>
				<text class="detail">满300减30元</text>
			</view>
			<view class="brother">
				<text class="name">已选</text>
				<text class="detail gray">黑色/S/1件</text>
			</view>
		</view>
		<!-- 图文介绍 -->
		<view class="goods-detail">
			<view class="tabs">
				<text :class="{active:selectIndex === index}" @click="getSelectIndex(index)" v-for="(item,index) in tabList" :key="index">{{item}}</text>
			</view>
			<view class="main">
				<!-- 方法一:使用富文本 -->
				<rich-text v-show="!selectIndex" :nodes="intro"></rich-text>
				<!-- 方法二: v-html渲染 -->
				<!-- <view v-show="!selectIndex" v-html="goodInfo.goods_introduce"></view> -->
				<view v-show="selectIndex">商品参数</view>
			</view>
		</view>
		<view class="fixed-bottom">
			<view class="icon-text">
				<text class="iconfont icon-kefu"></text>
				<text>联系客服</text>
				<button open-type="contact">客服</button>
			</view>
			<view class="icon-text" @click="toCart">
				<text class="iconfont icon-cart"></text>
				<text>购物车</text>
			</view>
			<view class="btn add-cart-btn" @click="addCart">加入购物车</view>
			<view class="btn buy-btn" @click="toBuy">立即购买</view>
		</view>
	</view>
</template>

<script>
	const CART = 'cart'
	export default {
		data() {
			return {
				// 商品详情
				goodInfo: {},
				// tab栏列表
				tabList: ['图文介绍', '规格参数'],
				// 选中的tab栏
				selectIndex: 0
			}
		},
		computed: {
			// 处理ios系统不支持.webp图片的问题
			intro() {
				if (this.goodInfo.goods_introduce) {
					return this.goodInfo.goods_introduce.replace(/.webp/g, '.jpg')
				}
			}
		},
		onLoad(options) {
			this.getGoodsInfo(options.goodsId)
		},
		// 分享页面
		onShareAppMessage() {
			return {
				title: this.goodInfo.goods_name,
				imageUrl: this.goodInfo.pics[0].pics_big
			}
		},
		methods: {
			// 立即购买
			toBuy(){
				uni.navigateTo({
					url: '/pages/pay/pay?goodsId=' + this.goodInfo.goods_id
				})
			},
			// 选中的tab栏
			getSelectIndex(index) {
				this.selectIndex = index
			},
			// 图片预览
			prevImg(index) {
				let urls = this.goodInfo.pics.map(item => {
					return item.pics_big
				})
				uni.previewImage({
					current: index,
					// current: urls[index],
					urls
				})
			},
			// 获取商品详情
			async getGoodsInfo(goodId) {
				this.goodInfo = await this.$request({
					url: '/api/public/v1/goods/detail?goods_id=' + goodId,
					isloading: false
				})
			},
			// 跳转到购物车页面
			toCart() {
				uni.switchTab({
					url: '/pages/cart/cart'
				})
			},
			// // 加入到购物车(对象方式,对象方式是无序的)
			// addCart() {
			// 	// 取
			// 	let cart = uni.getStorageSync(CART) || {}
			// 	// 更新
			// 	// 获取商品id
			// 	let goodId = this.goodInfo.goods_id
			// 	// 判断是否是首次加入
			// 	if (cart[goodId]) {
			// 		// 非首次
			// 		cart[goodId].num = cart[goodId].num + 1
			// 		cart[goodId].checked = true
			// 	} else {
			// 		console.log(2)
			// 		// 首次
			// 		cart[goodId] = {
			// 			num: 1,
			// 			checked: true
			// 		}
			// 	}
			// 	// 存
			// 	uni.setStorageSync(CART, cart)
			// },
			// 加入到购物车(数组方式)
			addCart() {
				// 取
				let cart = uni.getStorageSync(CART) || []
				// 更新
				// 获取商品id
				let goodId = this.goodInfo.goods_id
				// 判断是否是首次加入(方法一)
				// let targetGood = cart.find(item => {
				// 	return item.goodId === goodId
				// })
				// 判断是否是首次加入(方法二)
				let targetGoodIndex = cart.findIndex(item => {
					return item.goodId === goodId
				})
				// 方法二:
				let targetGood = cart[targetGoodIndex]
				if (targetGood) {
					// 非首次
					targetGood.num = targetGood.num + 1
					targetGood.checked = true
					// 把当前商品添加到头部
					// 方法一:
					// cart = [...new Set([targetGood,...cart])]
					// 方法二:
					cart.splice(targetGoodIndex,1)
					cart.unshift(targetGood)
				} else {
					// 首次
					let newGoods = {
						goodId,
						num: 1,
						checked: true
					}
					cart.unshift(newGoods)
				}
				// 提示
				uni.showToast({
					title:'添加购物车成功'
				})
				// 存
				uni.setStorageSync(CART, cart)
			}
		}

	}
</script>
<style lang="less">
	.iconfont {
		font-size: 40rpx;
	}

	.wrapper {
		background-color: #f4f4f4;
		padding-bottom: 98rpx;
	}

	.swiper {
		height: 720rpx;
	}

	.swiper-img {
		width: 100%;
		height: 720rpx;
	}

	.goods-info {
		padding: 40rpx 0 30rpx 20rpx;
		background-color: #fff;

		.price {
			color: #eb4450;
			font-size: 40rpx;
		}

		.name-favo {
			display: flex;
			height: 78rpx;
			margin-top: 14rpx;

			.name {
				color: #333;
				flex: 1;
				font-size: 28rpx;
				padding-right: 78rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2; // 控制多行的行数
				-webkit-box-orient: vertical;
			}

			.favo {
				border-left: 1px solid #ddd;
				width: 144rpx;
				color: #999;
				font-size: 24rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;

				button {
					position: absolute;
					left: 0;
					top: 0;
					opacity: 0;
				}
			}
		}

		.express {
			color: #999;
			font-size: 24rpx;
			margin-top: 20rpx;
		}
	}

	.promote {
		margin-top: 20rpx;

		view {
			background-color: #fff;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 28rpx;
			margin-top: 20rpx;
			padding-left: 20rpx;

			&.brother {
				margin-top: 0;
			}

			.name {
				color: #404040;
			}

			.detail {
				color: #ff4055;
				margin-left: 40rpx;

				&.gray {
					color: #dfdfdf;
				}
			}
		}
	}

	.goods-detail {
		margin-top: 20rpx;
		background-color: #fff;

		.tabs {
			display: flex;

			text {
				flex: 1;
				text-align: center;
				color: #404040;
				font-size: 22rpx;
				height: 100rpx;
				line-height: 100rpx;
				box-sizing: border-box;

				&.active {
					color: #ff4055;
					border-bottom: 10rpx solid #ff2644;
				}
			}
		}
	}

	.fixed-bottom {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 98rpx;
		display: flex;
		background-color: #fff;

		.icon-text {
			flex: 2;
			font-size: 20rpx;
			color: #404040;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;

			button {
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
			}
		}

		.btn {
			flex: 3;
			color: #fff;
			text-align: center;
			line-height: 98rpx;

			&.add-cart-btn {
				background-color: #ffb400;
			}

			&.buy-btn {
				background-color: #ff2d4a;
			}
		}
	}
</style>
