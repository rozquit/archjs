export default function () {
  const className = 'reel'
  const reels = Array.from(document.querySelectorAll(`.${className}`))
  const toggleOverflowClass = elem => {
    elem.classList.toggle('overflowing', elem.scrollWidth > elem.clientWidth)
  }

  for (const reel of reels) {
    if ('ResizeObserver' in window) {
      // eslint-disable-next-line
      new ResizeObserver(entries => {
        toggleOverflowClass(entries[0].target)
      }).observe(reel)
    }

    if ('MutationObserver' in window) {
      // eslint-disable-next-line
      new MutationObserver(entries => {
        toggleOverflowClass(entries[0].target)
      }).observe(reel, { childList: true })
    }
  }
}
