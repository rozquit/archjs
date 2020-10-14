<script>
  export let ratio = '16:9'
  const [d, n] = ratio.split(':')
</script>

<div class="frame" style="--n: {n}; --d: {d}">
  <slot />
</div>

<style>
  .frame {
    padding-bottom: calc(var(--n) / var(--d) * 100%);
    position: relative;
  }
  
  .frame > :global(*) {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .frame > :global(img),
  .frame > :global(video) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
