<script>
  import { onMount } from 'svelte';

  export let space = '1.5rem'
  export let recursive = false
  export let splitAfter = null

  let stack

  onMount(() => {
    stack.querySelectorAll(recursive ? `.stack *` : `.stack > *`)
      .forEach(e => {
        e.style.marginTop = '0'
        e.style.marginBottom = '0'
      })
    stack.querySelectorAll(recursive ? `.stack * + *` : `.stack > * + *`)
      .forEach(e => e.style.marginTop = `var(--space)`);
    if (splitAfter) {
      stack.querySelectorAll(`.stack :only-child`)
        .forEach(e => {
          e.style.height = '100%'
          e.style.color = 'red'
        })
      stack.querySelectorAll(`.stack > :nth-child(${splitAfter})`)
        .forEach(e => e.style.marginBottom = 'auto')
    }
  })
</script>

<div
  bind:this={stack}
  class="stack"
  style="--space: {space === '0' ? '0px' : space}">
  <slot />
</div>

<style>
  .stack {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
</style>
