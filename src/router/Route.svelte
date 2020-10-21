<script>
  import { register, activeRoute } from './Router.svelte'

  export let path = '/'
  export let layout = null
  export let component = null
  export let middleware = []

  let params = {}

  register({ path, layout, component, middleware })

  $: if ($activeRoute.path === path) {
    params = $activeRoute.params
  }
</script>

{#if $activeRoute.path === path}
  {#if $activeRoute.layout}
    <svelte:component
      this={$activeRoute.layout}
      {...$$restProps}
      {...params} />
  {:else if $activeRoute.component}
    <svelte:component
      this={$activeRoute.component}
      {...$$restProps}
      {...params} />
  {:else}
    <slot {params} />
  {/if}
{/if}
