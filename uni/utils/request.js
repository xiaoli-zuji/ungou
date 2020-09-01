// 设置基地址
const BASE_URL = 'https://www.uinav.com'
// const BASE_URL = 'https://api-ugo-dev.itheima.net'
// 设置一个变量,记录请求次数,没有请求关闭loading
let loadingCount = 0
// 公共请求方法
export default function request({
	url,
	isloading = true,
	data,
	method,
	header,
	isAuth
}) {
	return new Promise((resolve, reject) => {
		let header = {}
		// 如果需要登录
		if(isAuth){
			// 如果token没有,跳转登录
			let token = uni.getStorageSync('token')
			if(!token){
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return
			}
			header.Authorization = token
		}
		// 开启loading
		if (isloading) {
			uni.showLoading({
				mask: true
			})
			// 每次加载显示loading时,数量+1
			loadingCount++
		}

		uni.request({
			url: BASE_URL + url,
			data,
			method,
			header,
			success: (res) => {
				let {
					message,
					meta
				} = res.data
				if (meta.status === 200) {
					resolve(message)
				} else {
					reject(res.data)
				}
			},
			complete() {
				// 无论成功或者失败,都关闭loading
				if(isloading){
					loadingCount--
					if (loadingCount === 0) {
						uni.hideLoading()
					}
				}				
			}
		})
	})
}
