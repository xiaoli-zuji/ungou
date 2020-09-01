<template>
	<view class="home">
		<!-- 搜索链接 -->
		<searchlink />
		<!-- 轮播图 -->
		<swiper circular indicator-dots autoplay indicator-color="rgba(255,255,255,0.3)" indicator-active-color="#fff">
			<swiper-item v-for="(item,index) in swiperdataList" :key="index">
				<image :src="item.image_src" mode=""></image>
			</swiper-item>
		</swiper>
		<!-- 导航 -->
		<view class="nav">
			<image v-for="(item,index) in catitemsList" :key="index" :src="item.image_src" mode=""></image>
		</view>
		<!-- 楼层 -->
		<view class="floor">
			<view v-for="(item,index) in floordataList" :key="index" class="floor-item">
				<image :src="item.floor_title.image_src" mode=""></image>
				<view class="product-list">
					<image :src="item.product_list[0].image_src" mode=""></image>
					<view class="right">
						<block v-for="(freitem,freindex) in item.product_list" :key="freindex">
							<image v-if="freindex" :src="freitem.image_src" mode=""></image>
						</block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import searchlink from '../../components/searchLink.vue'
	export default {
		components:{
			searchlink
		},
		data() {
			return {
				swiperdataList: [],
				catitemsList: [],
				floordataList: []
			}
		},
		methods: {
			// 获取轮播图
			async getSwiperdata() {
				let data = await this.$request({
					url: '/api/public/v1/home/swiperdata'
				})
				this.swiperdataList = data
			},
			// 获取导航图
			async getCatitemsList() {
				let data = await this.$request({
					url: '/api/public/v1/home/catitems'
				})
				this.catitemsList = data
			},
			// 获取楼层图
			async getFloordataList() {
				let data = await this.$request({
					url: '/api/public/v1/home/floordata'
				})
				this.floordataList = data
			}
		},
		onLoad() {
			this.getSwiperdata()
			this.getCatitemsList()
			this.getFloordataList()
		}
	}
</script>

<style lang="less">
	.home {		
		// 轮播图
		swiper {
			height: 340rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		// 导航
		.nav {
			height: 194rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;

			image {
				width: 128rpx;
				height: 140rpx;
			}
		}

		// 楼层
		.floor {
			.floor-item {

				// >代表子代
				>image {
					width: 100%;
					height: 88rpx;
				}

				.product-list {
					display: flex;
					padding: 20rpx 17rpx;

					>image {
						width: 232rpx;
						height: 386rpx;
					}

					.right {
						flex: 1;
						display: flex;
						flex-wrap: wrap;

						image {
							width: 232rpx;
							height: 188rpx;
							margin: 0 0 10rpx 10rpx;
						}
					}
				}
			}
		}
	}
</style>
