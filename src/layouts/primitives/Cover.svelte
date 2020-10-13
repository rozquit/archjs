<script>
 export let space = 'var(--s1)'
 export let minHeight = '100vh'
 export let noPad = false
</script>

<div
  class="cover"
  style="--space: {space === '0' ? '0px' : space}; --min-height: {minHeight}; --padding: {noPad ? 0 : space}">
  <slot />
</div>

<style>
  .cover {
    display: flex;
    flex-direction: column;
    min-height: var(--min-height);
    padding: var(--padding);
  }
  
  .cover > :global(*) {
    margin-top: var(--space);
    margin-bottom: var(--space);
  }
  
  .cover > :global(:first-child:not(.centered)) {
    margin-top: 0;
  }
  
  .cover > :global(:last-child:not(.centered)) {
    margin-bottom: 0;
  }
  
  .cover > :global(.centered) {
    margin-top: auto;
    margin-bottom: auto;
  }
</style>
