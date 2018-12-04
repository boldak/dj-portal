<template>
  <div>
    <h2>Chart Config</h2>
    <h3>Options</h3>
    <pre>{{conf.options}}</pre>
    <h3>Data</h3>
    <pre>{{conf.data}}</pre>
  </div>   
</template>

<script>

 

   export default {
    
    name: 'chart-config',
    props: ["conf"]

  }  
    
     
 

</script>

