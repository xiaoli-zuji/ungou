<template>
	<view class="category">
		<!-- 搜索部分 -->
		<searchlink />
		<!-- 内容部分 -->
		<view class="content" v-if="categoryList[selectIndex]">
			<!-- 左侧 -->
			<view class="left">
				<view class="cate1" :class="{active:selectIndex===index1}" @click="getCate1(index1)" v-for="(cate1,index1) in categoryList" :key="index1">
					{{cate1.cat_name}}
				</view>
			</view>
			<!-- 右侧 -->
			<view class="right" >
				<image src="../../static/images/titleImage.png" mode=""></image>
				<view class="cate2" v-for="(cate2,index2) in categoryList[selectIndex].children" :key="index2">
					<view class="name">/ <text>{{cate2.cat_name}}</text> /</view>
					<view class="product-list">
						<view class="cate3" @click="toSearchList(cate3.cat_name)" v-for="(cate3,subindex) in cate2.children" :key="subindex">
							<image :src="cate3.cat_icon" mode=""></image>
							<text>{{cate3.cat_name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import searchlink from '../../components/searchLink.vue'
	export default {
		components: {
			searchlink
		},
		data() {
			return {
				selectIndex: 0,
				// 分类列表数据
				categoryList: []
			}
		},
		methods:{
			getCate1(index) {
				console.log('123')
				this.selectIndex = index
			},
			// 获取分类列表数据
			async getCategoryList() {
				this.categoryList = await this.$request({
					url: '/api/public/v1/categories'
				})
			},
			// 跳转到搜索页面
			toSearchList(catName){
				uni.navigateTo({
					url: '/pages/search_list/search_list?cateName=' + catName
				})
			}
				
		},
		onLoad() {
			// 获取列表数据
			this.getCategoryList()
		}
	}
</script>

<style lang="less">
	.content {
		position: absolute;
		top: 100rpx;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;

		.left {
			width: 198rpx;
			overflow: scroll;

			.cate1 {
				width: 100%;
				height: 100rpx;
				border-bottom: 1px solid #eee;
				background-color: #f4f4f4;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				&.active{
					background-color: #fff;
					position: relative;
					&::before{
						position: absolute;
						top: 20rpx;
						left: 0;
						content: '';
						width: 8rpx;
						height: 60rpx;
						background-color: #eb4450;
					}
				}
			}
		}

		.right {
			flex: 1;
			padding: 20rpx 16rpx;
			overflow: scroll;

			>image {
				width: 520rpx;
				height: 180rpx;
			}

			.cate2 {
				.name {
					width: 100%;
					height: 110rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #e0e0e0;

					text {
						color: #333;
						margin: 0 30rpx;
					}
				}

				.product-list {
					display: flex;
					flex-wrap: wrap;

					.cate3 {
						width: 33.33%;
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-bottom: 10rpx;
						image {
							width: 120rpx;
							height: 120rpx;
						}
						text{
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
</style>
