const checkMobile = (rule, value, callback) => {
  const reg = new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$')
  if (!value) {
    callback(new Error('电话不能为空'))
  } else if (!reg.test(value)) {
    callback(new Error('电话号码长格式不正确'))
  } else {
    callback()
  }
}
export const baseRules = {
  //key值对应prop属性
  account: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  }],
  // 校验手机号
  phone: [{
    validator: checkMobile,
    trigger: 'blur',
    required: true,
  }],
  // 密码校验
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }]
}