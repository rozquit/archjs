<script>
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher()
  
  // event handler for Pin Task
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id
    })
  }
  
  // event handler for Archive Task
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id
    })
  }
  
  // Task props
  export let task = {
    id: '',
    title: '',
    state: '',
    updated_at: new Date(2019, 0, 1, 9, 0)
  }
</script>

<div class="list-item">
  <input type="text" value={task.title} readonly />
</div>
