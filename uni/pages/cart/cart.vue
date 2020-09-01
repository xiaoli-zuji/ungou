<template>
	<view class="content">
		<view class="title">
			<text class="iconfont icon-shop"></text>
			<text>优购生活馆</text>
		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" @click="toItem(item.goods_id)" v-for="(item, index) in goodsList" :key="index">
				<text class="iconfont " @click.stop="changeCheck(item)" :class="item.checked?'icon-checked':'icon-unchecked'"></text>
				<image :src="item.goods_small_logo" alt="" />
				<view class="right">
					<text class="text-line2">{{item.goods_name}}</text>
					<view class="btm">
						<text class="price">￥<text>{{item.goods_price}}</text>.00</text>
						<view class="goods-num">
							<button @click.stop="subNum(item,index)">-</button>
							<text>{{item.num}}</text>
							<button @click.stop="addNum(item)">+</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="account">
			<view class="select-all" @click="toggleAll">
				<text class="iconfont " :class="isAll?'icon-checked':'icon-unchecked'"></text>
				<text>全选</text>
			</view>
			<view class="price-wrapper">
				<view class="price">
					<text>合计:<text class="num">￥{{totalPrice}}.00</text></text>
					<text class="info">包含运费</text>
				</view>
				<view class="account-btn" @click="toPay">结算({{totalNum}})</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	const CART = 'cart'
	export default {
		data() {
			return {
				// 商品列表
				goodsList: []
			}
		},
		onShow() {
			this.carts = uni.getStorageSync(CART) || []
			// 获取goodsId
			let goodsIdArr = this.carts.map(item => {
				return item.goodId
			})
			let goodId = goodsIdArr.join(',')
			// 获取购物车商品
			this.getGoodsList(goodId)
		},
		computed: {
			// 全选按钮
			isAll: {
				get() {
					return this.goodsList.every(item => {
						return item.checked
					})
				},
				set(status) {
					this.goodsList.forEach(item => {
						item.checked = status
					})
				}
			},
			// 总数量
			totalNum() {
				return this.goodsList.reduce((sum, item) => {
					return sum + (item.checked ? item.num : 0)
				}, 0)
			},
			// 总价格
			totalPrice(){
				return this.goodsList.reduce((sum,item)=>{
					return sum + (item.checked?item.goods_price*item.num:0)
				},0)
			}
		},
		watch:{
			goodsList:{
				handler(){
					// 更改本地cart
					let cart = this.goodsList.map(item=>{
						return {
							goodId: item.goodId,
							num: item.num,
							checked: item.checked
						}
					})
					// 存
					uni.setStorageSync(CART,cart)
				},
				deep:true
			}
		},
		methods: {
			// 结算
			toPay(){
				// 如果购物车没有商品,不能跳转,提示添加商品
				if(!this.totalNum){
					uni.showToast({
						title:'请添加商品',
						icon:'none'
					})
					return
				}
				// 判断用户有没有登录,没有登录跳转登录
				let token = uni.getStorageSync('token')
				if(!token){
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				// 跳转到支付页面
				uni.navigateTo({
					url:'/pages/pay/pay'
				})
			},
			// 全选状态切换
			toggleAll() {
				this.isAll = !this.isAll
			},
			// 是否勾选
			changeCheck(item) {
				item.checked = !item.checked
			},
			// 跳转到详情页面
			toItem(goodsId) {
				uni.navigateTo({
					url: '/pages/item/item?goodsId=' + goodsId
				})
			},
			// 获取购物车商品数据
			async getGoodsList(goodsId) {
				// 如果购物车没有商品不发请求
				if(!goodsId){
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
			// 增加
			addNum(item) {
				item.num++
			},
			// 减少
			subNum(item, index) {
				if (item.num === 1) {
					uni.showModal({
						title: '提示',
						content: '你确定要删除吗?',
						success: (res) => {
							if (res.confirm) {
								this.goodsList.splice(index, 1)
							}
						}
					})
					return
				}
				item.num--
			}
		}

	}
</script>

<style lang="less">
	.iconfont {
		font-size: 44rpx;
	}

	.title {
		height: 88rpx;
		display: flex;
		align-items: center;

		.iconfont {
			color: #999;
			margin: 6rpx 12rpx 0 32rpx;
		}
	}

	.goods-item {
		height: 206rpx;
		background-color: #fff;
		border-top: 1rpx solid #ddd;
		display: flex;
		box-sizing: border-box;
		align-items: center;

		.iconfont {
			color: #eb4450;
			margin: 0 30rpx;
		}

		image {
			width: 160rpx;
			height: 160rpx;
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
					display: flex;

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
		top: 88rpx;
		width: 100%;
		overflow: auto;
		padding-bottom: 60rpx;
		background-color: #f4f4f4;
	}

	.account {
		height: 98rpx;
		border-bottom: 1rpx solid #ddd;
		display: flex;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		align-items: center;

		.iconfont {
			color: #eb4450;
			margin: 0 30rpx;
		}

		.account-btn {
			width: 230rpx;
			height: 98rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			background-color: #eb4450;
		}

		.select-all {
			flex: 1;
			display: flex;
			align-items: center;

			
		}
		.price-wrapper {
			display: flex;
			flex: 3;
			justify-content: flex-end;
			align-items: center;
		}

		.price {
			margin-right: 20rpx;
			display: flex;
			flex-direction: column;

			.num {
				color: #eb4450;
			}

			.info {
				color: #999;
				font-size: 20rpx;
			}
		}
	}
</style>
