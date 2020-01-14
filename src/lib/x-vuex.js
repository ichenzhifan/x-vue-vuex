let Vue;

class XVuex {
  constructor(options) {
    this.$options = options;

    // 使用vue做数据响应.
    this.vm = new Vue({
      data: this.$options.state
    });

    this.mutations = options.mutations;
    this.getters = options.getters;
    this.actions = options.actions;
  }
}

XVuex.install = _Vue => {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
};

export default XVuex;
