<script>
  import { onMount } from 'svelte'
  
  export let space = '1.5rem'
  export let minHeight = '100vh'
  export let noPad = false
  export let centered = '.centered'
  
  let cover
  
  onMount(() => {
    cover.querySelectorAll(`.cover > ${centered}`)
    .forEach(e => {
      e.style.marginTop = 'auto'
      e.style.marginBottom = 'auto'
    })
    cover.querySelectorAll(`.cover > :first-child:not(${centered})`)
      .forEach(e => e.style.marginTop = '0')
    cover.querySelectorAll(`.cover > :last-child:not(${centered})`)
      .forEach(e => e.style.marginBottom = '0')
  })
</script>

<div
  bind:this={cover}
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
</style>
