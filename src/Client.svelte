<script>
  import {
    Router,
    Route,
    NotFound,
    redirect
  } from './router'
  
  import { Shell } from './layouts'
  
  import {
    Login,
    Home,
    About,
    Profile,
    Error
  } from './pages'

  const guard = (ctx, next) => true ? redirect('/login') : next()

  const data = { name: 'ArchJS', version: 'v0.1.0' }
  const error = { code: 404, message: 'Not Found'}
</script>

<Router>
  <Route path="/" layout={Shell} component={Home} {data} />
  <Route path="/about" layout={Shell}><h2>About</h2></Route>
  <Route path="/profile/:username" let:params layout={Shell} component={Profile} />
  <Route path="/private" middleware={[guard]}><Shell><h2>Private</h2></Shell></Route>
  <Route path="/login" layout={Shell} component={Login} />
  <NotFound component={Error} {error} />
</Router>
