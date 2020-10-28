<script>
  export let error
</script>

<svelte:head>
  <title>ArchJS | 404 Not Found</title>
</svelte:head>

<h2>{error.code} {error.message}</h2>
