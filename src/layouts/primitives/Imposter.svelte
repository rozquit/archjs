<script>
  export let breakout = false
  export let margin = '0'
  export let fixed = false
</script>

<div
  class="imposter"
  class:contain={!breakout}
  style="--margin: {margin}; --position: {fixed ? 'fixed' : 'absolute'}">
  <slot />
</div>

<style>
  .imposter {
    position: var(--position);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .imposter.contain {
    overflow: auto;
    max-width: calc(100% - (var(--margin) * 2));
    max-height: calc(100% - (var(--margin) * 2));
  }
</style>
