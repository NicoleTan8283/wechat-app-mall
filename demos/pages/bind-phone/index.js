const WXAPI = require('apifm-wxapi')
const AUTH = require('../../../utils/auth')

Page({
    data: {
        phone: "",
        code: "",
        verifyBtnHint: "发送验证码"
    },
    onLoad: function (n) {},
    onReady: function () {},
    onShow: function () {
        AUTH.wxaCode().then(code => {
            this.data.code = code
        })
    },
    async getPhoneNumber(e) {
        if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
            wx.showToast({
                title: e.detail.errMsg,
                icon: 'none'
            })
            return;
        }
        let res
        const extConfigSync = wx.getExtConfigSync()
        if (extConfigSync.subDomain) {
        // 服务商模式
        res = await WXAPI.wxappServiceBindMobile({
            token: wx.getStorageSync('token'),
            code: this.data.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
        })
        } else {
        res = await WXAPI.bindMobileWxapp(wx.getStorageSync('token'), this.data.code, e.detail.encryptedData, e.detail.iv)
        }
        AUTH.wxaCode().then(code => {
            this.data.code = code
        })
        if (res.code == 0) {
            wx.showToast({
                title: '绑定成功',
                icon: 'success'
            })
            setTimeout(() => {
                wx.navigateBack()
            }, 2000);
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    },
});