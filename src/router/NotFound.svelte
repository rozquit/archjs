<script>
  import { register, activeRoute } from './Router.svelte'

  export let path = '*'
  export let layout = null
  export let component = null
  export let middleware = []

  let Layout

  register({ path, layout, component, middleware })

  $: if ($activeRoute.layout) {
    Layout = $activeRoute.layout
  }
</script>

{#if $activeRoute.path === path}
  {#if $activeRoute.layout}
    <Layout {...$$restProps}>
      {#if $activeRoute.component}
        <svelte:component
          this={$activeRoute.component}
          {...$$restProps} />
      {:else}
        <slot />
      {/if}
    </Layout>
  {:else if $activeRoute.component}
    <svelte:component
      this={$activeRoute.component}
      {...$$restProps} />
  {:else}
    <slot />
  {/if}
{/if}
