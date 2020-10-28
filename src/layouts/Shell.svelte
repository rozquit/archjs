<script>
  import { Sidebar, Stack, Center } from './primitives'
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
        <slot />
      </Center>
    </main>
  </div>
</Sidebar>
