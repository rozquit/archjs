<script>
  export let data
</script>

<svelte:head>
  <title>ArchJS | Home</title>
</svelte:head>

<h2>Home</h2>
<pre>{data.name} {data.version}</pre>

<style>
  h2 {
    color: #8204f9;
    text-transform: uppercase;
    font-size: var(--s2);
    font-weight: 200;
  }
</style>
