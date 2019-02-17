<template>
    <Wrapper>
        <div class="content_box">
            <div id="left_content">
                <div class="scrollbox">
                    <!-- 这里存放主要内容 -->
                    <slot></slot>
                </div>
            </div>
            <aside>
                <div class="profile_banner" />
                <div class="profile_logo">
                <img src="../assets/logo.png" alt="">
                </div>
                <div class="profile_name">
                qoxop
                </div>
                <div class="profile_motto">
                没有什么不能被改变，就像没有什么值得被改变~
                </div>
                <div class="profile_info">
                <div>
                    <div class="iconbox"><em class="iconfont icon-github"></em></div>
                    <div class="icontext">github</div>
                </div>
                <div>
                    <div class="iconbox"><em class="iconfont icon-resume"></em></div>
                    <div class="icontext">resume</div>
                </div>
                <div>...</div>
                </div>
            </aside>
        </div>
  </Wrapper>
</template>
<script>

import Wrapper from './Wrapper.vue';

export default {
    components: {Wrapper},
}
</script>

<style>
  @import "../assets/style/common.css";
    #left_content {
        width: 900px;
        height: 100%;
    }
   .scrollbox {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .scrollbox > * {
    box-sizing: border-box;
    padding-right: 10%;
    width: 110%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden
  }
  /* 右侧内容 */
  aside {
    position: absolute;
    width: 290px;
    border-radius: 4px;
    top: 20px;
    right: 0;
    background-color: #fff;
  }
  aside .profile_banner {
    background: #005AA7;  /* fallback for old browsers */
    background: linear-gradient(110deg, #005AA7, #FFFDE4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    height: 120px;
  }
  aside  .profile_logo {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    margin-top: -62px;
    border: 4px solid #fff;
    border-radius: 50%;
    overflow: hidden;
  }
  aside  .profile_logo img{
    height: 100%;
    width: 100%;
  }
  aside  .profile_name {
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    letter-spacing: 8px;
    line-height: 0.9;
  }
  aside .profile_motto {
    padding: 12px;
    padding-top: 18px;
    line-height: 1.6;
    font-style: italic;
    color: #999;
  }
  aside .profile_info {
    display: flex;
    flex-flow: row nowrap;
    border-top: 0.5px solid #ebcbcb;
  }
  aside .profile_info > div {
    flex: 1;
    text-align: center;
    border-right: 0.5px solid #ebcbcb;
    padding: 10px;
    cursor: pointer;
    color: #666;
  }
  aside .profile_info > div:hover {
      background-color: chocolate;
      color: #fff;
  }
  aside .profile_info > div:last-child {
    border: none;
  }
  aside .profile_info .icontext {
    font-size: 14px;
    line-height: 1;
    color: inherit;
  }
  aside .profile_info .iconfont {
    font-size: 20px;
    color: inherit;
    line-height: 0.8;
  }
</style>
