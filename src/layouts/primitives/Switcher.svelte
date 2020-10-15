<script>
  import { onMount } from 'svelte'
  
  export let threshold = '60ch'
  export let space = '1.5rem'
  export let limit = 4
  
  let switcher
  
  onMount(() => {
    switcher.querySelectorAll(`.switcher > * > :nth-last-child(n+${Number(limit) + 1}), .switcher > * > :nth-last-child(n+${Number(limit) + 1}) ~ *`)
    .forEach(e => e.style.flexBasis = '100%')
  })
</script>

<div
  bind:this={switcher}
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
</style>
