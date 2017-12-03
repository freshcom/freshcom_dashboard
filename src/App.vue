<template>
<div class="wrapper">

  <el-container v-if="isSessionReady">
    <el-aside width="200px" v-if="shouldShowAside">
      <left-nav></left-nav>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</div>
</template>

<script>
export default {
  name: 'app',
  beforeCreate () {
    this.spinner = this.$loading({ text: 'Loading...', lock: true })
  },
  created () {
    return this.$store.dispatch('session/getToken').then(() => {
      this.spinner.close()
    }).catch(() => {
      this.$store.dispatch('pushRoute', { name: 'Login' })
      this.spinner.close()
    })
  },
  computed: {
    shouldShowAside () {
      return this.$store.state.route.name !== 'Login'
    },
    isSessionReady () {
      return this.$store.state.session.ready
    }
  }
}
</script>

<style lang="scss">
html, body {
  background-color: #eef1f6;
  height: 100%;
  margin: 0px;

  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

.wrapper {
  min-width: 1024px;
  display: flex;
  justify-content: center
}

.wrapper > .el-container {
  max-width: 1280px;
  height: 100vh;
  min-width: 1024px;

  .el-container {
    width: 100vh;
    min-width: 824px;
    max-width: 1080px;
  }
}

.el-main {
  padding-left: 5px;
}

.secondary-nav {
  display: inline-block;
  border-bottom: none;

  &.el-menu--horizontal > .el-menu-item {
    height: 36px;
    line-height: 36px;
    border-bottom: none;
  }

  &.el-menu {
    border-right: none;
    background-color: inherit;
  }

  .el-menu-item:focus, .el-menu-item:hover {
    background-color: inherit;
  }

  .el-menu-item.is-active {
    font-weight: 500;
    color: #409EFF;
  }

  .el-menu-item:first-child {
    padding-left: 10px;
  }
}

.el-input-group__prepend {
  padding-left: 10px;
  padding-right: 10px;
}



/* START Util Class */
p.btn-group {
  display: inline-block;
}

.v-middle {
  vertical-align: middle;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.pull-right {
  float: right;
}

.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
/* END Util Class */


/* START Layout */
a {
  color: #20a0ff;
  text-decoration: none;
}

.el-table.column-compact {
  th, td {
    .cell {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}

.el-table.nested-block-table {
  &:before {
    height: 0px
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .el-table {
    &:before {
      height: 0px;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }
  }

  th, td {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  th {
    background-color: #f5f7fa;
  }

  .el-table__expanded-cell {
    padding: 0px;

    .cell {
      text-align: left;
    }
  }

  .el-table__expand-column .cell {
    padding-right: 0px;
  }

  tbody tr td:last-child {
    text-align: right;
  }

  p {
    margin: 0;
  }

  .actions {
    .el-button {
      padding: 5px 10px;
      font-size: 11px;
    }

    a {
      margin-left: 10px;
    }

    svg {
      line-height: 16px;
      min-height: 16px;
      height: 16px;
    }

    .el-button+.el-button {
      margin-left: 0px;
    }
  }
}

a:hover {
  color: #1D8CE0;
}

.block-title {
  h3 {
    display: inline-block;
    margin: 0 0 5px 0;
    line-height: 30px;
    font-size: 16px;
  }

  .block-title-actions a {
    line-height: 35px;
    color: #888;
    font-size: 15px;

    span {
      vertical-align: middle;
    }
  }
}

.block {
  border: 1px solid #eaeefb;
  border-radius: 4px;
  margin-bottom: 20px;
  width: 100%;
  overflow: hidden;

  .block-body {
    padding: 20px;

    &.full {
      padding: 0;
    }
  }

  .block-footer {
    padding: 10px 20px;
    border-top: 1px solid #eaeefb;

    &.no-divider {
      border-top: 0;
    }

    .view-more {
      font-size: 15px;
    }
  }

  .image {
    display: inline-block;

    img {
      width: 150px;
      height: 150px;
      margin: 0 10px;
      border-radius: 5px;
    }
  }

  .el-table.block-table {
    border: 0;

    &:before {
      height: 0px;
    }

    .el-table__header th:first-child > div, .el-table__body tr td:first-child > div {
      padding-left: 10px;
    }

    .el-table__header th:last-child > div, .el-table__body tr td:last-child > div {
      padding-right: 10px
    }

    .el-table__header, .el-table__body {
      tbody tr:last-child td {
        border-bottom: none;
      }

      tr td {
        padding-top: 8px;
        padding-bottom: 8px;
      }

      p {
        margin: 0;
      }

      .actions {
        .el-button {
          padding: 5px 10px;
          font-size: 11px;
        }

        a {
          margin-left: 10px;
        }

        svg {
          line-height: 16px;
          min-height: 16px;
          height: 16px;
        }

        .el-button+.el-button {
          margin-left: 0px;
        }
      }
    }
  }
}

p.search-notice {
  margin-top: 60px;
}

.el-button.icon {
  padding: 5px;
}
/* END Layout */


/* START Card Search */
.search {
  display: inline-block;
  margin-left: 35px;
  width: 400px;
}
/* END Card Search */

/* START Utils */
.m-l-10 {
  margin-left: 10px;
}

.m-r-10 {
  margin-right: 10px;
}

.m-b-20 {
  margin-bottom: 20px;
}

.m-r-20 {
  margin-right: 20px;
}

.m-b-10 {
  margin-bottom: 10px;
}

.m-t-10 {
  margin-top: 10px;
}

.m-l-20 {
  margin-left: 20px;
}

.m-l-5 {
  margin-left: 5px;
}

.m-r-5 {
  margin-right: 5px;
}

.p-r-10 {
  padding-right: 10px;
}

.p-l-10 {
  padding-left: 10px;
}
/* END Utils */

/* START Common Overwrite */
.el-table {
  th, td {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

.el-input__inner {
  text-align: inherit;
}

.el-input-group__append {
  padding: 0 10px;
}

.el-input.is-disabled .el-input__inner {
  color: #878d99;
}

.el-dialog__body {
  padding: 20px;
}

.el-dialog__header {
  border-bottom: 1px solid #eaeefb;
}

.el-pagination {
  padding: 0px;
}

hr {
  margin: 0;
  border: none;
  border-bottom: 1px solid #d1dbe5;
}

.el-form-item {
  margin: 22px 0px;
}

small {
  font-size: 12px;
}

.el-autocomplete {
  width: 100%;
}

.el-form.el-form--label-top .el-form-item > .el-form-item__label {
  line-height: inherit;
}
/* END Common Overwrite */


/* START Main Card */
.main-card .brief {
  display: inline-block;

  .avatar {
    float: left;
    height: 80px;
    width: 80px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    text-align: center;

    img {
      border-radius: 6px;
      height: 80px;
      width: 80px;
    }

    .avatar-icon {
      color: #8c939d;
      width: 45px;
      height: 80px;
      vertical-align: middle;
      line-height: 80px;
      text-align: center;
    }
  }

  &.no-avatar .detail {
    padding-left: 0px;
  }

  .detail {
    padding: 0 120px 0 91px;
    height: 80px;
    vertical-align: middle;

    h2 {
      margin: 0;
      font-weight: 500;
      line-height: 25px;
    }

    p {
      padding: 5px 0 0 0;
      margin: 0;
      line-height: 20px;
      min-height: 20px;

      &.id {
        color: #888;
        font-size: 13px;
      }
    }
  }
}

.main-card {
  .header-actions {
    float: right;
    line-height: 80px;
  }

  .el-card__header {
    padding: 20px;
  }

  .el-card__body {
    padding: 0px;

    .data {
      min-height: 100px;
      padding: 20px 20px 0px 20px;

      &.full {
        padding: 0;
      }
    }
  }

  .data.full .el-table {
    th {
      background-color: #f5f7fa;
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .el-table__header th:first-child > div, .el-table__body tr td:first-child > div {
      padding-left: 20px;
    }

    .el-table__header th:last-child > div, .el-table__body tr td:last-child > div {
      padding-right: 20px
    }

    tbody tr {
      cursor: pointer;
    }
  }

  .el-table.full.no-pointer tbody tr {
    cursor: default;
  }

  dl {
    margin: 0px;
    font-size: 14px;

    dt {
      padding: 0px 15px 0px 0;
      width: 150px;
      float: left;
      text-align: right;
      color: #888;
      line-height: 25px;
    }

    dd {
      min-height: 25px;
      line-height: 25px;
      color: #48576a;
      margin-left: 165px;
    }
  }

  dl.thin {
    dt {
      width: 100px;
    }

    dd {
      margin-left: 115px;
    }
  }

  .footer {
    padding: 20px;
    border-top: 1px solid #d1dbe5;
  }

}
/* END Main Card */

/* START File Collection */
.file-thumbnail {
  text-align: center;
  display: inline-block;
  margin: 5px 10px;
  vertical-align: top;

  .wrapper {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
    display: inline-block;
  }

  .file-icon {
    color: #8c939d;
    width: 80px;
    height: 150px;
    vertical-align: middle;
    line-height: 150px;
    text-align: center;
  }

  img {
    display: block;
    width: 150px;
    height: 150px;
  }

  .caption {
    height: 20px;
    width: 150px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .file-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;

    a {
      display: inline-block;
      margin: 5px;
      color: #fff;
    }

    &:hover {
      opacity: 1;
    }

    &:after {
      display: inline-block;
      content: "";
      height: 100%;
      vertical-align: middle;
    }
  }
}

.file-uploader {
  text-align: center;

  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
  }

  .el-upload:hover {
    border-color: #20a0ff;
  }

  .file-uploader-icon {
    color: #8c939d;
    width: 20px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .file {
    width: 150px;
    height: 150px;
    display: block;
  }

  .el-progress {
    width: 150px;
    display: inline-block;
    text-align: center;
  }
}

/* END File Collection */

/* Dialog */

.fw-lg .el-dialog {
  width: 750px;
}

.fw-sm .el-dialog {
  width: 400px;
}
</style>
