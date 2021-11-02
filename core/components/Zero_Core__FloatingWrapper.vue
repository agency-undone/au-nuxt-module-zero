<template>
  <div class="anchor-container" ref="parent">
    <div
      :class="['floating-content', { 'info-fixed': sticky }]"
      :style="`transform: ${transform}`">

      <slot :jump="jumpToSection"></slot>

    </div>
  </div>
</template>

<script>
// =================================================================== Functions
const stickyElementInViewport = (instance) => {
  const anchorElement = instance.$refs.parent
  const coords = getElementDocumentCoords(anchorElement)
  const anchorTop = coords.top
  const anchorLeft = coords.left
  const threshold = window.pageYOffset + instance.thresholdoffset

  const cutoffElement = document.getElementById(instance.cutoffid)
  const cutoffTop = getElementDocumentCoords(cutoffElement).top

  if (anchorTop < threshold && cutoffTop > threshold) {
    if (!instance.sticky) {
      instance.sticky = true
    }
    instance.transform = `translate(${anchorLeft}px, ${instance.thresholdoffset}px)` // outside of if statement for resize
  } else if (cutoffTop < threshold) {
    if (instance.sticky) {
      instance.sticky = false
      instance.transform = `translate(0px, ${cutoffTop - anchorTop}px)`
    }
  } else {
    if (instance.sticky) {
      instance.sticky = false
      instance.transform = 'translate(0px, 0px)'
    }
  }
}

const getElementDocumentCoords = (elem) => {
  const box = elem.getBoundingClientRect()

  const body = document.body
  const docEl = document.documentElement

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

  const clientTop = docEl.clientTop || body.clientTop || 0
  const clientLeft = docEl.clientLeft || body.clientLeft || 0

  const top = box.top + scrollTop - clientTop
  const left = box.left + scrollLeft - clientLeft

  return { top: Math.round(top), left: Math.round(left) }
}

// ====================================================================== Export
export default {
  name: 'FloatingWrapper',

  props: {
    thresholdoffset: {
      type: Number,
      required: false,
      default: 120
    },
    cutoffid: {
      type: String,
      required: false
    }
  },

  data () {
    return {
      sticky: false,
      transform: 'translate(0px, 0px)'
    }
  },

  mounted () {
    this.scroll = () => { stickyElementInViewport(this) }
    window.addEventListener('scroll', this.scroll)
    this.resize = () => { stickyElementInViewport(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    jumpToSection (id) {
      const element = document.getElementById(id) || document.querySelector(`[data-id='${id}']`)
      this.$scrollToElement(element, 0, -50)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.anchor-container {
  position: relative;
  z-index: 10000;
}

.floating-content {
  position: absolute;
  top: 0;
  z-index: 10000;
  &.info-fixed {
    position: fixed;
  }
}

.heading {
  cursor: pointer;
  z-index: 10000;
}

</style>
