import rxSubs from 'vl-mixins/rx-subs'
import vmBind from 'vl-mixins/vm-bind'
import stubVNode from 'vl-mixins/stub-vnode'
import { warn } from 'vl-utils/debug'

const props = {}

const methods = {
  /**
   * @protected
   */
  initialize () {
    /**
     * @type {ol.interaction.Interaction}
     * @protected
     */
    this.interaction = this.createInteraction()
    this.bindSelfTo(this.interaction)
  },
  /**
   * @return {ol.interaction.Interaction}
   * @protected
   */
  createInteraction () {
    throw new Error('Not implemented method')
  },
  /**
   * @protected
   */
  mountInteraction () {
    if (this.map()) {
      this.map() && this.map().addInteraction(this.interaction)
      this.subscribeAll()
    } else if (process.env.NODE_ENV !== 'production') {
      warn("Invalid usage of interaction component, should have map component among it's ancestors")
    }
  },
  /**
   * @protected
   */
  unmountInteraction () {
    this.unsubscribeAll()
    this.map() && this.map().removeInteraction(this.interaction)
  },
  refresh () {
    this.interaction && this.interaction.changed()
  }
}

export default {
  mixins: [ rxSubs, vmBind, stubVNode ],
  inject: [ 'map' ],
  props,
  methods,
  stubVNode: {
    empty () {
      return this.$options.name
    }
  },
  provide () {
    return {
      interaction: () => this.interaction
    }
  },
  created () {
    this.initialize()
  },
  mounted () {
    this.$nextTick(this.mountInteraction)
  },
  destroyed () {
    this.$nextTick(() => {
      this.unmountInteraction()
      this.interaction = undefined
    })
  }
}