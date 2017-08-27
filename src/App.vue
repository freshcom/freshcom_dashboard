<template>
  <div id="app">
    <div class="container">
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

/* START Layout */
a {
  color: #20a0ff;
  text-decoration: none;

  &:hover {
    color: #1D8CE0;
  }
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
      padding: 0
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
/* END Layout */

.text-center {
  text-align: center;
}

.pull-right {
  float: right;
}
</style>
