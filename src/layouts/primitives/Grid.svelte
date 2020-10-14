<script>
  export let min = '250px'
  export let space = 'var(--s1)'
</script>

<div
  class="grid"
  style="--min: {min}; --space: {space === '0' ? '0px' : space}">
  <slot />
</div>

<style>
  .grid {
    display: grid;
    grid-gap: var(--space);
  }
  
  @supports (width: min(var(--min), 100%)) {
    .grid {
      grid-template-columns: repeat(auto-fit, minmax(min(var(--min), 100%), 1fr));
    }
  }
</style>
