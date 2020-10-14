<script>
  import { reel } from './layouts/primitives'
  
  import {
    Router,
    Route,
    NotFound,
    redirect
  } from './router'
  
  import {
    Login,
    Home,
    About,
    Profile
  } from './pages'

  const data = { name: 'ArchJS', version: 'v0.1.0' }

  const guard = (ctx, next) => true ? redirect('/login') : next()
  
  reel()
</script>

<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/profile/arch">Profile</a>
    <a href="/private">Private</a>
    <a href="/login">Login</a>
  </nav>
</header>

<main>
  <Router>
    <Route path="/" {data} component={Home} />
    <Route path="/about" component={About} />
    <Route path="/profile/:username" let:params component={Profile} />
    <Route path="/private" middleware={[guard]}>
      <h2>Private</h2>
    </Route>
    <Route path="/login" component={Login} />
    <NotFound>
      <h2>404 Not Found</h2>
    </NotFound>
  </Router>
</main>

<footer></footer>

<style>
  /* Axioms: https://every-layout.dev/rudiments/axioms/ */
  :global(:root) {
    --measure: 60ch;
  }
  
  :global(.max-width\:measure) {
    max-width: var(--measure);
  }
  
  :global(.max-width\:measure\/2) {
    max-width: calc(var(--measure) / 2);
  }
  
  :global(*) {
    max-width: var(--measure);
  }
  /* Modular Scale: https://every-layout.dev/rudiments/modular-scale/ */
  :global(:root) {
    --ratio: 1.5;
    --s-5: calc(var(--s-4) / var(--ratio));
    --s-4: calc(var(--s-3) / var(--ratio));
    --s-3: calc(var(--s-2) / var(--ratio));
    --s-2: calc(var(--s-1) / var(--ratio));
    --s-1: calc(var(--s0) / var(--ratio));
    --s0: 1rem;
    --s1: calc(var(--s0) * var(--ratio));
    --s2: calc(var(--s1) * var(--ratio));
    --s3: calc(var(--s2) * var(--ratio));
    --s4: calc(var(--s3) * var(--ratio));
    --s5: calc(var(--s4) * var(--ratio));
  }

  html,
  body,
  div,
  header,
  nav,
  main,
  footer {
    max-width: none;
  }
  /* A Modern CSS Reset: https://hankchizljaw.com/wrote/a-modern-css-reset/ */
  /* Box sizing rules */
  :global(*),
  :global(*)::before,
  :global(*)::after {
    box-sizing: border-box;
  }
  /* Remove default padding */
  ul[class],
  ol[class] {
    padding: 0;
  }
  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul[class],
  ol[class],
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }
  /* Set core body defaults */
  body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
  }
  /* Remove list styles on ul, ol elements with a class attribute */
  ul[class],
  ol[class] {
    list-style: none;
  }
  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }
  /* Make images easier to work with */
  img {
    /*max-width: 100%;*/
    width: 100%;
    display: block;
  }
  /* Natural flow and rhythm in articles by default */
  article > :global(* + *) {
    margin-top: 1em;
  }
  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }
  /* Remove all animations and transitions for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
</style>
