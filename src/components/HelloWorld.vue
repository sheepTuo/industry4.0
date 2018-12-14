<template>
  <div id="LoginPage">
    <div class="pagediv">
      <div class="loginWarp">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="账号密码登录" name="first">
              <div class="err-tip" v-if="serveErr">{{serveErr}}</div>
              <el-form
                :model="accountLogin"
                :rules="formRules"
                ref="accountLogin"
                class="loginForm"
              >
                <el-form-item prop="account">
                  <el-input
                    v-model.trim="accountLogin.account"
                    auto-complete="off"
                    placeholder="请输入用户名"
                    @keyup.enter.native="accountLoginSubmit()"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model.trim="accountLogin.password"
                    auto-complete="off"
                    placeholder="请输入密码"
                    @keyup.enter.native="accountLoginSubmit()"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="verifyWarpShow">
                  <el-input
                    class="verifyCode"
                    type="text"
                    v-model="accountLogin.verifyCode"
                    auto-complete="off"
                    placeholder="请输入验证码"
                    @keyup.enter.native="accountLoginSubmit()"
                    clearable
                  ></el-input>
                  <img
                    @click="getVerifyCode()"
                    v-if="accountLogin.verifyImg"
                    alt
                    :src="accountLogin.verifyImg"
                  >
                </el-form-item>
                <el-form-item>
                  <el-button @click.native.prevent="accountLoginSubmit()" class="submitMBtn">登录</el-button>
                </el-form-item>
                <el-form-item class="forgetregit al">
                  <a
                    class="link"
                    href="javascript:void(0)"
                    @click="$emit('openDialog','resetPw')"
                  >忘记密码</a>
                  <a
                    class="link"
                    href="javascript:void(0)"
                    @click="$emit('openDialog','register')"
                  >注册账户</a>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="手机验证码登录" name="second">
              <div class="err-tip" v-if="serveErr">{{serveErr}}</div>
              <el-form :model="phoneLogin" :rules="formRules" ref="phoneLogin" class="loginForm">
                <el-form-item prop="mobile">
                  <el-input
                    type="tel"
                    maxlength="11"
                    auto-complete="off"
                    v-model.trim="phoneLogin.mobile"
                    placeholder="请输入手机号码"
                    @keyup.enter.native="phoneLoginSubmit()"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item prop="verifyCode">
                  <el-input
                    class="verifyCode"
                    maxlength="4"
                    type="text"
                    v-model.trim="phoneLogin.verifyCode"
                    auto-complete="off"
                    placeholder="请输入验证码"
                    @keyup.enter.native="phoneLoginSubmit()"
                    clearable
                  ></el-input>
                  <u v-if="yzShow" @click="getCode">免费获取验证码</u>
                  <u class="time-btn" v-if="!yzShow">{{count}}秒后重新获取</u>
                  <!-- 这里不能用v-show,必须使用v-if重新渲染dom否则数字没有变化 -->
                </el-form-item>
                <el-form-item>
                  <el-button @click.native.prevent="phoneLoginSubmit()" class="submitMBtn">登录</el-button>
                </el-form-item>
                <el-form-item class="forgetregit al">
                  <a
                    class="link"
                    href="javascript:void(0)"
                    @click="$emit('openDialog','resetPw')"
                  >忘记密码</a>
                  <a
                    class="link"
                    href="javascript:void(0)"
                    @click="$emit('openDialog','register')"
                  >注册账户</a>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </div>
  </div>
</template>

<script type="es6" src="./index.js"></script>

<style lang="scss" src="./index.scss"></style>

