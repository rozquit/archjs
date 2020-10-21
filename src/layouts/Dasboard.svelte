<script>
  import { register, activeRoute } from '../router/Router.svelte'
  import { Sidebar, Stack, Center } from './primitives'

  export let path = "/"
  export let layout = null
  export let component = null
  export let middleware = []

  let params = {}

  register({ path, layout, component, middleware })
</script>

<Sidebar contentMin="66.666%" sideWidth="10rem">
  <div>
    <Stack space="var(--s2)">
      <div><a href="/">Home</a></div>
      <div><a href="/about">About</a></div>
      <div><a href="/profile/arch">Profile</a></div>
      <div><a href="/private">Private</a></div>
      <div><a href="/login">Login</a></div>
    </Stack>
    <main>
      <Center>
        {#if $activeRoute.component}
          <svelte:component
            this={$activeRoute.component}
            {...$$restProps}
            {...params} />
        {:else}
          <slot {params} />
        {/if}
      </Center>
    </main>
  </div>
</Sidebar>
