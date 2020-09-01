<template>
	<view>
		<view class="address-wrapper">
			<view class="address" v-if="address.userName">
				<view class="receiver">
					<view class="name">收货人：{{address.userName}}</view>
					<view class="phone-num">{{address.telNumber}}</view>
					<text class="iconfont icon-arrow-right"></text>
				</view>
				<view class="address-txt">收货地址：{{address.provinceName+address.cityName+address.countyName+address.detailInfo}}</view>
			</view>
			<!-- 选择地址 -->
			<view class="choose-address" v-else @click="getArr">
				<view>请选择地址</view>
				<text class="iconfont icon-arrow-right"></text>
			</view>
			<view class="flower">
				<image src="/static/images/cart_border@2x.png"></image>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="(item,index) in goodsList" :key="index" @click="toItem(item.goodId)">
				<image :src="item.goods_small_logo" alt="">
					<view class="right">
						<view class="line-clamp2 text-line2">{{item.goods_name}}</view>
						<view class="btm">
							<text class="price">￥<text>{{item.goods_price}}</text>.00</text>
							<view class="goods-num">
								<text>{{item.num}}</text>
							</view>
						</view>
					</view>
			</view>
		</view>

		<view class="bottom-fixed" @click="pay">
			微信支付({{totalPrice}}.00)
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				// 商品列表
				goodsList: [],
				// 
				address: uni.getStorageSync('address') || {}
			}
		},
		onLoad(options) {
			// 获取商品id
			this.goodsId = parseInt(options.goodsId)
			// 
			if (this.goodsId) {
				this.carts = [{
					goodId: this.goodsId,
					num: 1,
					checked: true
				}]
			} else {
				// 取storage中的cart获得goodid
				this.carts = uni.getStorageSync('cart') || [];
				// 只包含勾选的商品
				this.carts = this.carts.filter(item => {
					return item.checked
				})
			}

			// 获取goodids
			let goodsIdArr = this.carts.map(item => {
				return item.goodId
			})
			let goodsId = goodsIdArr.join(',')
			// 获取购物车商品
			this.getGoodsList(goodsId)
		},
		computed: {
			// 总价格
			totalPrice() {
				return this.goodsList.reduce((sum, item) => {
					return sum + item.goods_price * item.num
				}, 0)
			}
		},
		methods: {
			// 付款
			pay() {
				// 如果用户没有选择地址提示
				if (!this.address.userName) {
					uni.showToast({
						title: '请先选择地址',
						icon: 'none'
					})
					return
				}
				// 创建订单
				this.createOrder()
			},
			// 创建订单
			async createOrder() {
				let data = await this.$request({
						url: '/api/public/v1/my/orders/create',
						method: 'POST',
						// header: {
						// 	Authorization: uni.getStorageSync('token')
						// },
						isAuth: true,
						data: {
							order_price: this.totalPrice,
							consignee_addr: this.getConAddr(),
							goods: this.getFilterGoodsList()
						}
					})
					// 生成订单后,删除storage cart 里面勾选的商品
					!this.goodsId && this.arrangeCart()
				// 获取订单编号
				this.orderNumber = data.order_number
				// 获取支付参数
				this.doPay()
			},
			// 删除storage cart 里面勾选的商品
			arrangeCart() {
				// 取
				let cart = uni.getStorageSync('cart') || [];
				// 更新
				cart = cart.filter(item => {
					return !item.checked;
				})
				// 存
				uni.setStorageSync('cart', cart);
			},
			// 获取支付参数
			async doPay() {
				let data = await this.$request({
					url: '/api/public/v1/my/orders/req_unifiedorder',
					method: 'POST',
					// header: {
					// 	Authorization: uni.getStorageSync('token')
					// },
					isAuth: true,
					data: {
						order_number: this.orderNumber
					}
				})
				// console.log(data) //data.pay里面的数据为支付参数
				// 唤起微信支付
				uni.requestPayment({
					...data.pay,
					success: (res) => {
						// 成功支付
						uni.showToast({
							title: '支付成功'
						})
						// 跳转到支付结果页面
						uni.navigateTo({
							url: '/pages/order_result/order_result?orderNumber' + this.orderNumber
						})
					},
					fail: () => {
						// 支付失败
						uni.showToast({
							title: '支付失败'
						})
						// 跳转到支付结果页面
						uni.navigateTo({
							url: '/pages/order_result/order_result?orderNumber' + this.orderNumber
						})
					}
				})
			},
			// 订单数组
			getFilterGoodsList() {
				return this.goodsList.map(item => {
					return {
						goods_id: item.goodId,
						goods_number: item.num,
						goods_price: item.goods_price
					}
				})
			},
			// 收货地址
			getConAddr() {
				return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo + '' +
					this.address.userName + '' + this.address.telNumber
			},
			// 跳转到商品详情
			toItem(goodid) {
				uni.navigateTo({
					url: '/pages/item/item?goodsId=' + goodid
				})
			},
			// 获取购物车商品数据
			async getGoodsList(goodsId) {
				// 如果购物车没有商品不发请求
				if (!goodsId) {
					return
				}
				let _goodsList = await this.$request({
					url: '/api/public/v1/goods/goodslist?goods_ids=' + goodsId
				})
				this.goodsList = _goodsList.map(goodItem => {
					let targetGood = this.carts.find(cartItem => {
						return cartItem.goodId === goodItem.goods_id
					})
					return { ...goodItem,
						...targetGood
					}
				})
			},
			// 获取通讯地址			
			getArr() {
				uni.authorize({
					scope: 'scope.address',
					// 用户允许
					success: () => {
						uni.chooseAddress({
							success: (res) => {
								this.address = res
								// 存本地
								uni.setStorageSync('address', res)
							}
						})
					},
					// 用户拒绝
					fail: () => {
						// 提示在设置上打开允许
						uni.showModal({
							title: '提示',
							content: '请在设置上打开允许获取通信录',
							success: (res) => {
								if (res.confirm) {
									// 打开设置允许
									uni.openSetting()
								}
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.address-wrapper {
		background-color: #fff;
	}

	.address {
		display: flex;
		flex-direction: column;
		padding: 44rpx 30rpx 48rpx 20rpx;

		.receiver {
			display: flex;
			justify-content: space-between;
			margin-bottom: 50rpx;
			position: relative;

			.phone-num {
				margin-right: 40rpx;
			}

			.icon-arrow-right {
				position: absolute;
				top: 8rpx;
				right: 0;
				color: #999;
			}
		}
	}

	.choose-address {
		display: flex;
		padding: 44rpx 30rpx 48rpx 20rpx;
		justify-content: space-between;

		.icon-arrow-right {
			color: #999;
		}
	}

	.flower {
		image {
			height: 16rpx;
			width: 100%;
			display: block;
		}
	}

	.goods-item {
		height: 206rpx;
		background-color: #fff;
		border-top: 1rpx solid #ddd;
		display: flex;
		box-sizing: border-box;
		align-items: center;

		image {
			width: 160rpx;
			height: 160rpx;
			margin-left: 30rpx;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin: 0 20rpx 0 18rpx;

			.btm {
				display: flex;
				margin-top: 40rpx;
				justify-content: space-between;

				.price {
					color: #eb4450;

					>text {
						font-size: 24px;
					}
				}

				.goods-num {
					display: flex;
					align-items: center;

					button {
						width: 60rpx;
						height: 50rpx;
						box-sizing: border-box;
						display: flex;
						justify-content: center;
						align-items: center;
						border: 4rpx solid #666;
					}

					text {
						margin: 0 30rpx;
					}
				}
			}
		}
	}

	.goods-list {
		position: absolute;
		bottom: 98rpx;
		top: 243rpx;
		width: 100%;
		overflow: auto;
		padding-bottom: 60rpx;
		background-color: #f4f4f4;
	}

	.bottom-fixed {
		position: absolute;
		height: 98rpx;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #1aad19;
		color: #fff;
		line-height: 98rpx;
		text-align: center;
	}
</style>
