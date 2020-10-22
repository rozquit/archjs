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
    Profile,
    Error
  } from './pages'

  const data = { name: 'ArchJS', version: 'v0.1.0' }
  const error = { code: 404, message: 'Not Found'}

  const guard = (ctx, next) => true ? redirect('/login') : next()
</script>

<Router>
  <Route path="/" layout={Dashboard} component={Home} {data} />
  <Route path="/about" layout={Dashboard}><h2>About</h2></Route>
  <Route path="/profile/:username" let:params layout={Dashboard} component={Profile} />
  <Route path="/private" middleware={[guard]}><Dashboard><h2>Private</h2></Dashboard></Route>
  <Route path="/login" layout={Dashboard} component={Login} />
  <NotFound component={Error} {error} />
</Router>
