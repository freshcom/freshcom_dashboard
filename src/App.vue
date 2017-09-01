<template>
  <div id="app">
    <div class="container">
      <div v-if="showLeftNav" class="left-col">
        <left-nav></left-nav>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  beforeCreate () {
    this.spinner = this.$loading({ text: 'Loading...', lock: true })
  },
  created () {
    return this.$store.dispatch('session/loadRecord').then(() => {
      this.spinner.close()
    }).catch(() => {
      this.$store.dispatch('pushRoute', { name: 'Login' })
      this.spinner.close()
    })
  },
  computed: {
    showLeftNav () {
      return this.$store.state.route.name !== 'Login'
    }
  }
}
</script>

<style lang="scss">
html, body {
  background-color: #eef1f6;
  overflow-y: hidden;
  height: 100%;
  margin: 0px;

  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* START Left Nav */
.el-menu-item a {
  text-decoration: none;
  color: #48576a;

  &:hover {
    color: #48576a;
  }
}

.el-menu-item-group__title {
  padding-bottom: 10px;
}

.el-menu-item.is-active a {
  font-weight: 500;
  color: #20a0ff;
}

.el-submenu .el-menu {
  background-color: #eef1f6;
}

.el-menu-item, .el-submenu__title, .el-submenu .el-menu-item {
  height: 35px;
  line-height: 35px;
}

.el-menu-item .fa-icon, .el-submenu .fa-icon {
  width: 20px;
}

.el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
  background-color: inherit;
  font-weight: 500;
}
/* END Left Nav */


/* START Secondary Nav */
.secondary-nav {
  margin-top: 25px;

  .el-menu--horizontal {
    display: inline-block;

    & > .el-menu-item:hover, .el-menu--horizontal > .el-submenu.is-active .el-submenu__title, .el-menu--horizontal > .el-submenu:hover .el-submenu__title {
      border: none;
    }

    .el-menu-item {
      border: none;
      line-height: 35px;
      height: 35px;

      &.is-active {
        font-weight: 500;
      }
    }

    .el-submenu .el-submenu__title {
      height: 35px;
      line-height: 35px;
      border: none;
    }

    .el-submenu {
      line-height: 35px;
      height: 35px;

      & > .el-menu {
        top: 35px;
      }
    }
  }

}
/* END Secondary Nav */


/* START Locale */
.secondary-nav .el-dropdown.locale-selector {
  float: right;
  margin-right: 20px;
}
/* END Locale */


/* START Util Class */
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
/* END Util Class */


/* START Layout */
a {
  color: #20a0ff;
  text-decoration: none;
}

a:hover {
  color: #1D8CE0;
}

.container {
  min-width: 1024px;
  margin: 0 auto;
}

.left-col {
  float: left;
  width: 200px;
}

.main-col {
  overflow: hidden;
  margin-left: 10px;

  .main {
    padding: 5px 20px 30px 5px;
  }

  .content .main-scroller {
    height: calc(100vh - 63px);
    overflow-y: scroll;
  }
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

  .block-body {
    padding: 20px;

    &.full {
      padding: 0;
    }
  }

  .block-footer {
    padding: 10px;
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

    &:after {
      width: 0;
    }

    tr td {
      padding: 0;

      p {
        margin: 0;
      }
    }

    .actions {
      a {
        margin-left: 10px;
      }

      svg {
        line-height: 16px;
        min-height: 16px;
        height: 16px;
      }
    }
  }
}

p.search-notice {
  margin-top: 60px;
}
/* END Layout */


/* START Card Search */
.search {
  display: inline-block;
  margin-left: 35px;
  width: 500px;
}
/* END Card Search */


/* START Top Search */
.search-input {
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}

.search-input input, .search-input .el-input-group__prepend {
  border: none;
}

.main-col .controls {
  margin: 10px;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
}
/* END Top Search */


/* START Common Overwrite */
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
    padding: 18px 30px;
  }

  .el-card__body {
    padding: 0px;

    .data {
      min-height: 100px;
      padding: 20px 30px 0px 30px;

      &.full {
        padding: 0;
      }
    }
  }

  .el-table.full {
    border: 0;

    &:after {
      width: 0;
    }

    &.el-table--striped {

      .el-table__body {

        tr:nth-child(2n) td {
          background-color: white;
        }

        tr td {
          background-color: #FAFAFA;
        }

      }

    }

    &.el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #eef1f6;
    }

    .el-table__header th, .el-table__header th > div {
       background-color: white;
    }

    .el-table__header th:first-child > div, .el-table__body tr td:first-child > div {
      padding-left: 30px;
    }

    .el-table__header th:last-child > div, .el-table__body tr td:last-child > div {
      padding-right: 30px
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
    margin: 0px 0px 20px 0px;
    padding: 20px 30px 0px 30px;
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


</style>
