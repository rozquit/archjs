<script>
  export let space = 'var(--s1)'
  export let recursive = false
</script>

<div
  class="{recursive ? 'stack recursive' : 'stack basic'}"
  style="--space: {space === '0' ? '0px' : space}">
  <slot />
</div>

<style>
  .stack {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  .basic > :global(*) {
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .basic > :global(* + *) {
    margin-top: var(--space);
  }
  
  .recursive :global(*) {
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .recursive :global(* + *) {
    margin-top: var(--space);
  }
  
  .stack :global(:only-child) {
    height: 100%;
  }
  
  .stack > :global(.split-after) {
    margin-bottom: auto;
  }
</style>
