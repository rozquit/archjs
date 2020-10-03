<script>
  import {
    Router,
    Route,
    NotFound,
    redirect
  } from './router'

  import Login from './pages/Login.svelte'
  import Home from './pages/Home.svelte'
  import About from './pages/About.svelte'
  import Profile from './pages/Profile.svelte'

  const data = { name: 'ArchJS', version: 'v0.2.0' }

  const guard = (ctx, next) => true ? redirect('/login') : next()
</script>

<main>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/profile/arch">Profile</a>
    <a href="/private">Private</a>
    <a href="/login">Login</a>
  </nav>

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

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  h1 {
    color: #8204f9;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  h2 {
    color: #8204f9;
    text-transform: uppercase;
    font-size: 3em;
    font-weight: 200;
  }
  nav a {
    padding: 1em;
  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
