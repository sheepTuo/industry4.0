/* eslint-disable */
import {
  baseRules
} from '@/utils/validate.js'
import {
  getVerifyCode
} from '@/utils/index.js'
import {
  setToken,
  removeToken
} from '@/utils/auth.js'
import {
  jsencrypt
} from '@/utils/jsencrypt2.js'

export default {
  name: 'Login',
  data() {
    return {
      serveErr: '',
      accountLogin: {
        account: this.$route.params.account || '',
        password: '',
        verifyImg: '',
        verifyCode: '',
        uuid: '',
        expire: ''
      },
      phoneLogin: {
        mobile: '',
        verifyCode: ''
      },
      formRules: baseRules,
      activeName: 'first',
      count: 60,
      timer: null,
      yzShow: true,
      rsa: new jsencrypt(), // 加密
      timerTip: null
    }
  },
  computed: {
    verifyWarpShow: function () {
      if (this.$store.getters.verifyWarpShow == 'true') {
        return true
      } else {
        return false
      }
    }
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    open: function (newValue) {
      if (!newValue) {
        //重置输入框验证
        this.$refs.accountLogin.resetFields()
        this.$refs.phoneLogin.resetFields()
        //重置协议选项
        this.accountLogin.protocol = false
        this.phoneLogin.protocol = false
      }
    },
    serveErr(newValue, oldValue) {
      this.timerTip && clearTimeout(this.timerTip)
      if (newValue) {
        this.timerTip = setTimeout(() => {
          this.serveErr = ''
        }, 5000)
      }
    }
  },
  // 创建后login
  methods: {
    handleClick(tab, event) {
      this.serveErr = ''
      // console.log(tab, event)
    },
    getCode() {
      let vm = this
      let timer = null
      this.yzShow = false

      if (!timer) {
        getVerifyCode(this.phoneLogin.mobile, '光谷金信')
          .then(data => {
            vm.serveErr = ''
            vm.count = 60
            timer = setInterval(() => {
              if (vm.count > 0) {
                vm.count--
              } else {
                clearInterval(timer)
                timer = null
                vm.yzShow = true
              }
            }, 1000)
          })
          .catch(err => {
            vm.serveErr = err.msg
            vm.yzShow = true
            clearInterval(timer)
            timer = null
          })
      }
    },
    accountLoginSubmit() {
      let vm = this
      this.$refs.accountLogin.validate(valid => {
        if (valid) {
          removeToken()
          let params = null
          if (this.verifyWarpShow) {
            // 需要验证码
            if (new Date().getTime() > this.accountLogin.expire) {
              this.getVerifyCode() //刷新验证码
              this.$message.error('验证码已过期，请重新获取！')
              return false
            }
            params = {
              account: this.accountLogin.account,
              password: this.rsa.encrypt(this.accountLogin.password),
              verifyCode: this.accountLogin.verifyCode,
              uuid: this.accountLogin.uuid
            }
          } else {
            // 普通登录
            params = {
              account: this.accountLogin.account,
              password: this.rsa.encrypt(this.accountLogin.password)
            }
          }

          //重置store 中 memberInfo 信息，避免之前记录对当前账户造成影响
          vm.$store.commit('SET_MEMBERBUS', null)
          httpReq({
            url: 'userprofile/auth/login',
            needLoading: true,
            params: params,
            success: response => {
              this.$refs.accountLogin.resetFields()
              if (response.code == 200) {
                setToken(response.data.token)
                vm.$refs.accountLogin.resetFields()
                vm.$router.push({
                  path: '/personal_center'
                })
              }
            },
            error: error => {
              vm.serveErr = error.msg
              // vm.$message.error(error.msg)
              if (error.data < 3) {
                // 错误次数大于或等于3次
                vm.$store.commit('SET_VERIFYWARPSHOW', true)
                vm.getVerifyCode() // 这里必须刷新验证码，否则dom不出现
              } else {
                vm.$store.commit('SET_VERIFYWARPSHOW', false)
              }
              //  this.getVerifyCode()//账号或者密码或验证码错误，刷新验证码
            }
          })
        }
      })
    },
    getVerifyCode() {
      httpReq({
        url: 'userprofile/auth/login/defaultKaptcha',
        success: response => {
          if (response.data.img) {
            this.accountLogin.verifyImg = response.data.img
            this.accountLogin.expire = response.data.expire
            this.accountLogin.uuid = response.data.img.substring(
              response.data.img.lastIndexOf('/') + 1,
              response.data.img.length - 4
            )
            this.rsa.setPublicKey(response.data.key)
          } else {
            this.serveErr = '验证码没有生产，请检测网络！'
            // this.$message.error('验证码没有生产，请检测网络！')
            return false
          }
        }
      })
    },
    phoneLoginSubmit() {
      let vm = this
      this.$refs.phoneLogin.validate(valid => {
        if (valid) {
          removeToken()
          if (!this.phoneLogin.mobile) {
            this.$message.error('请输入手机号码')
            return false
          }
          if (!this.phoneLogin.verifyCode) {
            this.$message.error('请输入正确的验证码!')
            return false
          }
          httpReq({
            url: 'userprofile/auth/login/loginByMobile',
            needLoading: true,
            params: {
              mobile: this.phoneLogin.mobile,
              verifyCode: this.phoneLogin.verifyCode
            },
            success: response => {
              this.$refs.phoneLogin.resetFields()
              if (response.code == 200) {
                setToken(response.data.token)
                vm.$router.push({
                  path: '/personal_center'
                })
              }
            },
            error: error => {
              vm.serveErr = error.msg
              // vm.$message.error(error.msg)
              //  this.getVerifyCode()//账号或者密码或验证码错误，刷新验证码
            }
          })
        }
      })
    }
  },
  created() {
    this.getVerifyCode()
    let username = this.$route.query.userId
    let token = this.$route.query.sessionId
    if (username && token) {
      this.$router.replace('/usercenter/originaStructManageBlock')
    }
  }
}