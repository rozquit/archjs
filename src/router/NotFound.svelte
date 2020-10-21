<script>
  import { register, activeRoute } from './Router.svelte'

  export let path = '*'
  export let layout = null
  export let component = null
  export let middleware = []

  register({ path, layout, component, middleware })
</script>

{#if $activeRoute.path === path}
  {#if $activeRoute.layout}
    <svelte:component
      this={layout}
      {...$$restProps} />
  {:else if $activeRoute.component}
    <svelte:component
      this={component}
      {...$$restProps} />
  {:else}
    <slot />
  {/if}
{/if}
