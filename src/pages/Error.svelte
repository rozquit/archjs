<script>
  export let error
</script>

<svelte:head>
  <title>ArchJS | 404 Not Found</title>
</svelte:head>

<h2>{error.code} {error.message}</h2>

<style>
  h2 {
    color: red;
    text-transform: uppercase;
    font-size: var(--s2);
    font-weight: 200;
  }
</style>
