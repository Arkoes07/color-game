onmessage = function(e){
    if(e.data !== undefined){
        let check = 0;
        console.log('hello from worker',e.data.finish,e.data.start);
        do{
            let currentDate = new Date();
            let currentTime = currentDate.getTime();
            check = e.data.finish - currentTime;
            if((check/1000)%1==0){
                this.postMessage({result:parseInt(check/1000),status:'play'});
            }
        }while(check > 0);
        this.postMessage({result:"END",status:'stop'});
    }
}