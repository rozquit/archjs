<script>
  import {
    Router,
    Route,
    NotFound,
    redirect
  } from './router'
  
  import { Dashboard } from './layouts'
  
  import {
    Login,
    Home,
    About,
    Profile
  } from './pages'

  const data = { name: 'ArchJS', version: 'v0.1.0' }

  const guard = (ctx, next) => true ? redirect('/login') : next()
</script>

<Router>
  <Route path="/">
    <Dashboard>
      <Home {data} />
    </Dashboard>
  </Route>
  <Route path="/about">
    <Dashboard>
      <About />
    </Dashboard>
  </Route>
  <Route path="/profile/:username" let:params>
    <Dashboard>
      <Profile {params}/>
    </Dashboard>
  </Route>
  <Route path="/private" middleware={[guard]}>
    <h2>Private</h2>
  </Route>
  <Route path="/login" component={Login} />
  <NotFound>
    <h2>404 Not Found</h2>
  </NotFound>
</Router>
