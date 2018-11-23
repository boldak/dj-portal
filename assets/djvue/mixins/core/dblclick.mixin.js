export default {
	data: () => ({
        delay: 700,
        clicks: 0,
        timer: null
    }),    
    
    methods: {
        onClickHandler(event, onClick, onDblClick ){
          this.clicks++ 
          if(this.clicks === 1) {
            var self = this
            this.timer = setTimeout(() => {
              if(onClick) onClick()
              self.clicks = 0
            }, this.delay);
          } else{
             clearTimeout(this.timer);  
             if(onDblClick) onDblClick()
             this.clicks = 0;
          }         
        }      
	}
}	