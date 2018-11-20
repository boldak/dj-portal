export default {
     methods:{
      resolve(){
        this.$emit('submit', this.config)
      },

      reject(){
        this.$emit('submit', null)
      }  
    }
}  
