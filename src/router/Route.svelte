<script>
  import { register, activeRoute } from './Router.svelte'

  export let path = '/'
  export let layout = null
  export let component = null
  export let middleware = []
  
  let params = {}
  let Layout

  register({ path, layout, component, middleware })

  $: if ($activeRoute.path === path) {
    params = $activeRoute.params
  }
  $: if ($activeRoute.layout) {
    Layout = $activeRoute.layout
  }
</script>

{#if $activeRoute.path === path}
    {#if $activeRoute.layout}
      <Layout>
        {#if $activeRoute.component}
          <svelte:component
            this={$activeRoute.component}
            {...$$restProps}
            {...params} />
        {:else}
          <slot {params} />
        {/if}
      </Layout>
    {:else if $activeRoute.component}
      <svelte:component
        this={$activeRoute.component}
        {...$$restProps}
        {...params} />
    {:else}
      <slot {params} />
    {/if}
{/if}
