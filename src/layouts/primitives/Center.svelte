<script>
  export let max = 'var(--measure)'
  export let andText = false
  export let gutters = 0
  export let intrinsic = false
</script>

<div
  class="center"
  class:and-text={andText}
  class:gutters={gutters}
  class:intrinsic={intrinsic}
  style="--max: {max}; --gutters: {gutters}">
  <slot />
</div>

<style>
  .center {
    box-sizing: content-box;
    margin-left: auto;
    margin-right: auto;
    max-width: var(--max);
  }
  
  .center.and-text {
    text-align: center;
  }
  
  .center.gutters {
    padding-left: var(--gutters);
    padding-right: var(--gutters)
  }
  
  .center.intrinsic {
    display:flex;
    flex-direction: column;
    align-items: center;
  }
</style>
