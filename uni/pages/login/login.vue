<template>
  <view>
    <button open-type="getUserInfo" @getuserinfo="wxLogin" >点我登录</button>
  </view>
</template>

<script>
	export default{
		methods:{
			wxLogin(userInfoRes){
				// 存用户信息
				uni.setStorageSync('userInfo',userInfoRes.detail.userInfo)
				// 获取用户信息
				let {encryptedData,rawData,iv,signature} = userInfoRes.detail
				// 获取微信账号的唯一标识code
				uni.login({
					success:async (loginRes)=>{
						// 获取code
						let code = loginRes.code
						// 发请求
						let data = await this.$request({
							url:'/api/public/v1/users/wxlogin',
							method:'POST',
							data:{
								encryptedData,
								rawData,
								iv,
								signature,
								code
							}
						})
						// 提示然后存token
						uni.showToast({
							title: '登录成功'
						});
						// 存token
						uni.setStorageSync('token',data.token)
						// 返回上一页
						uni.navigateBack()
					}
				})
			}
		}
	}
</script>

<style>
</style>