<script>
  import { Box, Switcher } from '../layouts/primitives'
</script>

<header>
  <Box borderWidth={0} invert>
    <Switcher limit="5">
      <div>
        <div><a href="/">Home</a></div>
        <div><a href="/about">About</a></div>
        <div><a href="/profile/arch">Profile</a></div>
        <div><a href="/private">Private</a></div>
        <div><a href="/login">Login</a></div>
      </div>
    </Switcher>
  </Box>
</header>

<style>
  header {
    overflow: hidden;
    position: fixed;
    top: 0;
    width: 100%;
  }
</style>
