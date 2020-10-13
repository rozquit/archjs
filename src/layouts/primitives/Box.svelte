<script>
  export let padding = 'var(--s1)'
  export let borderWidth = 0
  export let invert = false
  export let colorLight = '#eee'
  export let colorDark = '#000'
</script>

<div
  class="box"
  class:invert = {invert}
  style="--padding: {padding}; --border-thin: {borderWidth}; --color-light: {colorLight}; --color-dark: {colorDark}">
  <slot />
</div>

<style>
  .box {
    padding: var(--padding);
    border: var(--border-thin) solid;
    color: var(--color-dark);
    background-color: var(--color-light);
  }
  
  .box :global(*) {
    color: inherit;
  }
  
  .box.invert {
    color: var(--color-light);
    background-color: var(--color-dark);
  }
</style>
