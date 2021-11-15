<template>
  <component :is="rootNode">

    <slot :filtered="filtered" />

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// =================================================================== Functions
const projectIncluded = (selection, tags, type) => {
  switch (type) {
    case 'and': return selection.every((val) => { return tags.includes(val) })
    case 'or': return selection.some((val) => { return tags.includes(val) })
  }
  return false
}

const filterProjects = (selected, collection, matchType) => {
  const filtered = []
  if (selected.length) {
    for (let i = 0; i < collection.length; i++) {
      const project = collection[i]
      const projectTags = []

      for (let j = 0; j < project.taxonomies.length; j++) {
        const tax = project.taxonomies[j]
        for (let k = 0; k < tax.tags.length; k++) {
          projectTags.push(tax.tags[k])
        }
      }
      const success = projectIncluded(selected, projectTags, matchType)
      if (success) { filtered.push(collection[i]) }
    }
    return filtered
  }
  return collection
}


// ====================================================================== Export
export default {
  name: 'Filters',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    },
    projects: {
      type: [Boolean, Array],
      required: false,
      default: false
    },
    filters: {
      type: [Boolean, Array],
      required: false,
      default: false
    },
    selected: {
      type: [Boolean, Array],
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    settings () {
      return this.siteContent.settings
    },
    target () {
      return this.settings.behavior.targetCategoryMatch
    },
    targetCategory () {
      const array = []
      const category = this.siteContent.taxonomy.categories.find(cat => cat.slug === this.target.categorySlug)
      category.tags.forEach(tag => array.push(tag.slug))
      return array
    },
    targetSelection () {
      return this.selected.filter((tag) => this.targetCategory.includes(tag))
    },
    primarySelection () {
      return this.selected.filter((tag) => !this.targetCategory.includes(tag))
    },
    primaryMatchType () {
      return this.settings.behavior.tagMatchType
    },
    filtered () {
      let collection
      if (this.target.categorySlug) {
        collection = filterProjects(
          this.primarySelection,
          filterProjects(this.targetSelection, this.projects, this.target.tagMatchType),
          this.primaryMatchType
        )
      } else {
        collection = filterProjects(this.selected, this.projects, this.primaryMatchType)
      }
      if (collection.length === 0) { collection = false }
      const payload = { type: 'filtered', collection }
      this.setCollection(payload)
      console.log(collection)
      return collection
    }
  },

  methods: {
    ...mapActions({
      setCollection: 'core/setCollection'
    })
  }
}
</script>
