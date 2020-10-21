<script context="module">
  import { writable } from 'svelte/store'

  const routes = {}

  export const activeRoute = writable({})
  export const register = route => {
    routes[route.path] = route
  }
</script>

<script>
  import page from 'page'
  import { onMount, onDestroy } from 'svelte'

  export let disabled = false
  export let basePath = undefined

  const last = route => {
    return function (ctx) {
      $activeRoute = { ...route, params: ctx.params }
    }
  }

  const setupPage = () => {
    for (let [path, route] of Object.entries(routes)) {
      page(path, ...route.middleware, last(route))
    }

    if (basePath) {
      page.base(basePath)
    }

    page.start()
  }

  onMount(setupPage)

  onDestroy(page.stop)
</script>

{#if !disabled}
  <slot />
{/if}
