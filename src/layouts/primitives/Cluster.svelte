<script>
  export let justify = 'center'
  export let align = 'center'
  export let space = 'var(--s1)'
</script>

<div
  class="cluster"
  style="--justify: {justify}; --align: {align}; --space: {space === '0' ? '0px' : space}">
  <slot />
</div>

<style>
  .cluster {
    overflow: hidden;
  }
  
  .cluster > :global(*) {
    display: flex;
    flex-wrap: wrap;
    justify-content: var(--justify);
    align-items: var(--align);
    margin: calc(var(--space) / 2 * -1);
  }
  
  .cluster > :global(*) > :global(*) {
    margin: calc(var(--space) / 2);
  }
</style>
