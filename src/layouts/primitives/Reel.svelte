<script>
  export let itemWidth = 'auto';
  export let space = 'var(--s0)';
  export let height = 'auto';
  export let noBar = false;
  export let overflowing = false;
  export let colorLight = '#eee';
  export let colorDark = '#000';

  (function () {
    const className = 'reel';
    const reels = Array.from(document.querySelectorAll(`.${className}`));
    const toggleOverflowClass = elem => {
      elem.classList.toggle('overflowing', elem.scrollWidth > elem.clientWidth);
    };
  
    for (let reel of reels) {
      if ('ResizeObserver' in window) {
        new ResizeObserver(entries => {
          toggleOverflowClass(entries[0].target);
        }).observe(reel);
      }
    
      if ('MutationObserver' in window) {
        new MutationObserver(entries => {
          toggleOverflowClass(entries[0].target);
        }).observe(reel, {childList: true});
      }
    }
  })();
</script>

<div
  class="reel"
  class:overflowing={overflowing}
  class:no-bar={noBar}
  style="--item-width: {itemWidth}; --space: {space === '0' ? '0px' : space}; --height: {height}; --color-light: {colorLight}; --color-dark: {colorDark}">
  <slot />
</div>

<style>
  .reel {
    display: flex;
    height: auto;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-color: var(--color-light) var(--color-dark);
  }
  
  .reel::-webkit-scrollbar {
    height: var(--space);
  }
  
  .reel::-webkit-scrollbar-track {
    background-color: var(--color-dark);
  }
  
  .reel::-webkit-scrollbar-thumb {
    background-color: var(--color-dark);
    background-image: linear-gradient(var(--color-dark) 0, var(--color-dark) 0.25rem, var(--color-light) 0.25rem, var(--color-light) 0.75rem, var(--color-dark) 0.75rem);
  }
  
  .reel > :global(*) {
    flex: 0 0 var(--item-width);
  }
  
  
  .reel > :global(img) {
    height: 100%;
    flex-basis: auto;
    width: auto;
  }
  
  .reel > :global(* + *) {
    margin-left: var(--space);
  }
  
  .reel.overflowing {
    padding-bottom: var(--space);
  }

  .reel.no-bar {
    scrollbar-width: none;
  }

  .reel.no-bar::-webkit-scrollbar {
    display: none;
  }
</style>
