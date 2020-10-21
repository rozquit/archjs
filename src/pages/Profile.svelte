<script>
  export let username
</script>

<svelte:head>
  <title>ArchJS | Profile</title>
</svelte:head>

<h2>Hello, {username}!</h2>

<style>
  h2 {
    color: #8204f9;
    text-transform: uppercase;
    font-size: var(--s2);
    font-weight: 200;
  }
</style>
