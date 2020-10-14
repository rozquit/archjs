<script>
  export let threshold = 'var(--measure)'
  export let space = 'var(--s1)'
</script>

<div
  class="switcher"
  style="--threshold: {threshold}; --space: {space === '0' ? '0px' : space}">
  <slot />
</div>

<style>
  .switcher > :global(*) {
    display: flex;
    flex-wrap: wrap;
    margin: calc((var(--space) / 2) * -1);
  }
  
  .switcher > :global(*) > :global(*) {
    flex-grow: 1;
    flex-basis: calc((var(--threshold) - (100% - var(--space))) * 999);
    margin: calc(var(--space) / 2);
  }
  /*
    Limit = 4
    The maximum number of elements allowed to appear in the horizontal configuration
    https://every-layout.dev/layouts/switcher/
  */
  .switcher > :global(*) > :global(:nth-last-child(n+5)),
  .switcher > :global(*) > :global(:nth-last-child(n+5)) ~ :global(*) {
    flex-basis: 100%;
  }
</style>
