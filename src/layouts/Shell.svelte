<script>
  import { Center, Cover } from './primitives'
  import { Header } from '../components'
</script>

<Header />

<main>
  <Cover centered=".center">
    <Center intrinsic>
      <slot />
    </Center>
  </Cover>
</main>
