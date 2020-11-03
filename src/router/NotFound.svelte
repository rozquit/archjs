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
    <svelte:component this={$activeRoute.layout}>
      {#if $activeRoute.component}
        <svelte:component
          this={$activeRoute.component}
          {...$$restProps} />
      {:else}
        <slot />
      {/if}
    </svelte:component>
  {:else if $activeRoute.component}
    <svelte:component
      this={$activeRoute.component}
      {...$$restProps} />
  {:else}
    <slot />
  {/if}
{/if}
