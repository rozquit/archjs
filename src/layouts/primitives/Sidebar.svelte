<script>
  import { onMount } from 'svelte'
  
  export let side = 'left'
  export let sideWidth = null
  export let contentMin = '50%'
  export let space = '1.5rem'
  export let noStretch = false
  
  let sidebar
  
  onMount(() => sidebar.querySelectorAll(`img`).forEach(e => e.style.width = '100%'))
</script>

<div
  bind:this={sidebar}
  class="with-sidebar"
  class:left={side === 'left'}
  class:right={side === 'right'}
  class:no-stretch={noStretch}
  style="--side-width: {sideWidth}; --content-min: {contentMin}; --space: {space === '0' ? '0px' : space}">
  <slot />
</div>

<style>
  .with-sidebar {
    overflow: hidden;
  }
  
  .with-sidebar > :global(*) {
    display: flex;
    flex-wrap: wrap;
    margin: calc(var(--space) / 2 * -1);
  }
  
  .with-sidebar > :global(*) > :global(*) {
    margin: calc(var(--space) / 2);
    flex-grow: 1;
    flex-basis: var(--side-width);
  }
  
  .with-sidebar.no-stretch > :global(*) {
    align-items: flex-start;
  }
  
  .with-sidebar.left > :global(:last-child) {
    flex-basis: 0;
    flex-grow: 999;
    min-width: calc(var(--content-min) - var(--space));
  }
  
  .with-sidebar.right > :global(:first-child) {
    flex-basis: 0;
    flex-grow: 999;
    min-width: calc(var(--content-min) - var(--space));
  }
</style>
