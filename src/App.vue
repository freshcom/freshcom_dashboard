<template>
<div class="wrapper">

  <el-container v-if="!isLoggedIn">
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>

  <el-container v-else>
    <el-aside width="200px">
      <left-nav></left-nav>
    </el-aside>

    <router-view v-if="isSessionReady">
    </router-view>
  </el-container>

</div>
</template>

<script>
import 'vue-awesome/icons/user-circle-o'
import 'vue-awesome/icons/bell'
import 'vue-awesome/icons/book'
import freshcom from '@/freshcom-sdk'

export default {
  name: 'app',
  created () {
    if (this.isLoading) {
      this.spinner = this.$loading({ text: 'Loading...', lock: true })
    }
  },
  computed: {
    isLoading () {
      return this.$store.state.isLoading
    },
    user () {
      return this.$store.state.session.user
    },
    isLoggedIn () {
      return !!this.$store.state.session.user
    },
    isSessionReady () {
      return this.$store.state.session.ready
    }
  },
  watch: {
    isLoading (isLoading) {
      if (isLoading) {
        this.spinner = this.$loading({ text: 'Loading...', lock: true })
      } else {
        if (this.spinner) {
          this.spinner.close()
        }
      }
    }
  },
  methods: {
    userDropdownHandler (item) {
      if (item === 'logout') {
        this.$store.dispatch('session/reset')
        this.$store.dispatch('pushRoute', { name: 'Login' })
      }

      if (item === 'nuke') {
        freshcom.createAccountReset({ type: 'AccountReset' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

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

//
// MARK: Button with Icon
//
.el-button {
  .with-icon {
    display: inline-flex;
    align-items: center;
  }

  .icon-wrapper {
    display: flex;
    margin-right: 3px;
  }
}

//
// MARK: Input
//
.el-input {
  .prefix {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 24px;
  }
}

//
// MARK: Data Table
//
.el-table.data-table {
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

  .action-group {
    text-align: right;

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
  }

  p {
    margin: 0;
  }

  td {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  a {
    display: block;
    padding: 8px 0px;
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.primary {
      color: #3297d3;
      font-weight: 500;
    }

    &.with-icon {
      display: flex;
      align-items: center;

      .icon-wrapper {
        display: inline-flex;
      }
    }
  }
}

//
// MARK: Main Card
//
.main-card {
  min-height: 120px;

  .el-card__header {
    padding: 20px;
    position: relative;

    h1 {
      display: inline-block;
      line-height: 32px;
      margin: 0px;
      font-weight: 400;
      font-size: 16px;
      width: 450px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .brief-action-group {
      display: inline-block;
      float: right;
      line-height: 82px;
    }
  }

  .el-card__body {
    padding: 0px;
  }

  .foot {
    padding: 20px;
    border-top: 1px solid #d1dbe5;
  }
}

//
// MARK: Brief
//
.brief {
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

    h1 {
      margin: 0;
      font-weight: 500;
      line-height: 25px;
      font-size: 1.5em;
    }

    p {
      padding: 5px 0 0 0;
      margin: 0;
      line-height: 20px;
      min-height: 20px;
      white-space: nowrap;

      &.id {
        color: #888;
        font-size: 13px;
      }
    }
  }
}

//
// MARK: Message Box
//
.el-message-box.top {
  margin-top: -50vh;
}

//
// MARK: Resource Editor
//
.resource-editor {
  .action-group {
    margin-left: 15px;
    display: inline-block;

    .el-button.el-button--mini {
      font-size: 11px;
      padding: 5px 10px;
    }
  }
}

//
// Mark: Resource Block
//
.resource-block {
  border: 1px solid #eaeefb;
  border-radius: 4px;
  overflow: hidden;
  padding: 10px;
  display: inline-flex;
  align-items: center;

  &.medium .resource {
    width: 298px;
  }

  &.small {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .resource {
    display: inline-block;

    p {
      margin: 0px;
      line-height: 14px;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .primary {
      font-weight: 500;
    }

    .secondary {
      font-size: 11px;
    }
  }

  .action-group {
    margin-left: 15px;
    display: inline-block;
    line-height: 31px;

    .el-button.el-button--mini {
      font-size: 11px;
      padding: 5px 10px;
    }
  }
}

//
// MARK: Data
//
.data {
  min-height: 100px;
  padding: 0px 20px;

  &.full {
    padding: 0;
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
}

//
// MARK: Block
//
.block {
  margin-bottom: 20px;

  &:first-child {
    margin-top: 20px;
  }

  .header {
    h2 {
      display: inline-block;
      margin: 0 0 5px 0;
      line-height: 30px;
      font-size: 16px;
    }

    .action-group {
      line-height: 30px;
      display: inline-block;
      float: right;

      .el-button.el-button--mini {
        font-size: 11px;
        padding: 5px 10px;
      }
    }
  }

  .body {
    border: 1px solid #eaeefb;
    border-radius: 4px;
    overflow: hidden;
    padding: 20px;
    clear: both;

    &.full {
      padding: 0;
    }

    .foot {
      padding: 10px 20px;
      border-top: 1px solid #eaeefb;

      &.no-divider {
        border-top: 0;
      }

      .view-more {
        font-size: 15px;
      }
    }
  }
}

//
// MARK: Block Table
//
.el-table.data-table.block-table {
  border: 0;
  width: 100%;

  &:before {
    height: 0px;
  }

  .el-table__header th:first-child > div, .el-table__body tr td:first-child > div {
    padding-left: 0px;
  }

  .el-table__header th:last-child > div, .el-table__body tr td:last-child > div {
    padding-right: 0px
  }

  .el-table__header th:first-child > div, .el-table__body tr td:first-child > div.cell {
    padding-left: 10px;
  }

  .el-table__header th:last-child > div, .el-table__body tr td:last-child > div.cell {
    padding-right: 10px
  }

  .el-table__header, .el-table__body {
    tbody tr:last-child td {
      border-bottom: none;
    }

    tr td {
      padding-top: 0px;
      padding-bottom: 0px;
    }
  }

  .el-table__expanded-cell {
    padding: 0px;
  }
}

.el-table.column-compact {
  th, td {
    .cell {
      padding-left: 5px;
      padding-right: 5px;
    }
  }
}

// MARK: Nested Block Table

// .el-table.nested-block-table {
//   &:before {
//     height: 0px
//   }

//   tbody tr:last-child td {
//     border-bottom: none;
//   }

//   .el-table {
//     &:before {
//       height: 0px;
//     }

//     tbody tr:last-child td {
//       border-bottom: none;
//     }
//   }

//   th, td {
//     padding-top: 8px;
//     padding-bottom: 8px;
//   }

//   th {
//     background-color: #f5f7fa;
//   }

//   .el-table__expanded-cell {
//     padding: 0px;

//     .cell {
//       text-align: left;
//     }
//   }

//   .el-table__expand-column .cell {
//     padding-right: 0px;
//   }

//   tbody tr td:last-child {
//     text-align: right;
//   }

//   p {
//     margin: 0;
//   }

//   .actions {
//     .el-button {
//       padding: 5px 10px;
//       font-size: 11px;
//     }

//     a {
//       margin-left: 10px;
//     }

//     svg {
//       line-height: 16px;
//       min-height: 16px;
//       height: 16px;
//     }

//     .el-button+.el-button {
//       margin-left: 0px;
//     }
//   }
// }

//
// MARK: Divider Text
//
.divider-text {
  text-align: center;
  position: relative;
  z-index: 2;

  :after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid #eaeefb;
    z-index: -1;
  }

  .text {
    margin: 0;
    padding: 0 10px;
    background: #fff;
    display: inline-block;
  }
}

//
// MARK: Utils
//
.text-center {
  text-align: center;
}

.cursor-pointer {
  cursor: pointer;
}

p.btn-group {
  display: inline-block;
}

.v-middle {
  vertical-align: middle;
}


.text-right {
  text-align: right;
}

.pull-right {
  float: right;
}

.pull-left {
  float: left;
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

a:hover {
  color: #1D8CE0;
}

// .block-title {
//   h3 {
//     display: inline-block;
//     margin: 0 0 5px 0;
//     line-height: 30px;
//     font-size: 16px;
//   }

//   .block-title-actions {
//     line-height: 30px;
//     a {
//       line-height: 35px;
//       color: #888;
//       font-size: 15px;

//       span {
//         vertical-align: middle;
//       }
//     }

//     .el-button.el-button--mini {
//       padding: 5px 10px;
//     }

//     .el-button+.el-button {
//       margin-left: 0px;
//     }
//   }
// }

.block {
  // border: 1px solid #eaeefb;
  // border-radius: 4px;
  // margin-bottom: 20px;
  // width: 100%;
  // overflow: hidden;

  // .block-body {
  //   padding: 20px;

  //   &.full {
  //     padding: 0;
  //   }
  // }

  // .block-footer {
  //   padding: 10px 20px;
  //   border-top: 1px solid #eaeefb;

  //   &.no-divider {
  //     border-top: 0;
  //   }

  //   .view-more {
  //     font-size: 15px;
  //   }
  // }

  .image {
    display: inline-block;

    img {
      width: 150px;
      height: 150px;
      margin: 0 10px;
      border-radius: 5px;
    }
  }
}

.el-button.icon {
  padding: 5px;
}

.component-wrapper.email-template-fieldset .CodeMirror {
  height: 800px;
}
/* END Layout */

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

.m-b-20 {
  margin-top: 20px;
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

.m-t-5 {
  margin-top: 5px;
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
.hidden {
  display: none;
}

.card-wrapper {
  min-height: 300px;
}

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
  padding: 0px 15px;

  p {
    line-height: 20px;
  }
}

.el-dialog__header {
  padding: 15px;
  border-bottom: 1px solid #eaeefb;
}

.el-dialog__footer {
  padding: 15px;
  border-top: 1px solid #eaeefb;
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
.main-card {
  // .data.full .el-table {
  //   th {
  //     background-color: #f5f7fa;
  //     padding-top: 5px;
  //     padding-bottom: 5px;
  //   }

  //   .el-table__header th:first-child > div, .el-table__body tr td:first-child > div {
  //     padding-left: 20px;
  //   }

  //   .el-table__header th:last-child > div, .el-table__body tr td:last-child > div {
  //     padding-right: 20px
  //   }

  //   tbody tr {
  //     cursor: pointer;
  //   }
  // }

  // .el-table.full.no-pointer tbody tr {
  //   cursor: default;
  // }

  // dl {
  //   margin: 0px;
  //   font-size: 14px;

  //   dt {
  //     padding: 0px 15px 0px 0;
  //     width: 150px;
  //     float: left;
  //     text-align: right;
  //     color: #888;
  //     line-height: 25px;
  //   }

  //   dd {
  //     min-height: 25px;
  //     line-height: 25px;
  //     color: #48576a;
  //     margin-left: 165px;
  //   }
  // }

  // dl.thin {
  //   dt {
  //     width: 100px;
  //   }

  //   dd {
  //     margin-left: 115px;
  //   }
  // }
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

/* END File Collection */

/* Dialog */

.fw-lg .el-dialog {
  width: 750px;
}

.fw-sm .el-dialog {
  width: 400px;
}
</style>
