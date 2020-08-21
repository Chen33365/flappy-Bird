var bird = {
    skyPosition: 0,
    skytep: 2,
    birdTop: 230,
    isStart: false,
    birdStepY: 0,
    minTop: 0,
    maxTop: 570,
    pipeLength: 7,
    pipeArr: [],
    lastPipeIndex: 6,
    score: 0,
    scoreArr: [],
    initData(){
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oFinalScore = this.el.getElementsByClassName('final-score')[0];
        this.oRestart = this.el.getElementsByClassName('restart')[0];
        this.oRankList = this.el.getElementsByClassName('rank-list')[0];
        if(this.getSessionPlay()){
            this.start()
        }
        this.handle()
        this.scoreArr = this.getScore()
    },
    animate(){
        var count = 0
        this.timer = setInterval(()=>{
            this.skyMove();
            if(this.isStart){
                this.birdDown()
                this.pipeMove()
            }
            if(++count%10 == 0){
                this.startBirdPosition(count);
                if(!this.isStart){
                    this.startBirdTop();
                    this.startText();
                }
            }
            if(this.score < 5){
                this.skytep  = 5
            }else if(this.score < 10){
                this.skytep  = 8
            }else if(this.score < 15 ){
                this.skytep = 12
            }else if(this.score < 20){
                this.skytep = 20
            }
        },30);



    },
    handle(){
        this.handleStart();
        this.handleClick();
        this.handkeRestart();
    },
    handleStart(){
        this.oStart.onclick =  this.start.bind(this)
    },
    start(){
        this.isStart = true;
        this.skytep = 5;
        this.el.style.cursor = 'pointer';

        this.oStart.style.display = 'none';
        this.oBird.style.transition = 'none';
        this.oScore.style.display = 'block';
        this.oBird.style.left = '100px';
        this.birdTop = 230;
        this.createPipe()
    },
    handleClick(){
        this.el.onclick = (e)=> {
            var dom = e.target;
            if(!this.isStart || e.target.classList.contains('start'))return
            this.birdStepY = -10;
        }
    },
    handkeRestart(){
        this.oRestart.onclick = () => {
            this.setSessionPlay();
            window.location.reload()
        }
    },
    birdDown(){
        this.birdTop += ++ this.birdStepY;
        this.oBird.style.top = this.birdTop + 'px';
        this.judgeKnock();
        this.addScore()
    },
    judgeKnock(){
        this.judgeBoundary();
        this.judgePipe();    
    },
    judgeBoundary(){
        if(this.birdTop < this.minTop || this.birdTop > this.maxTop){
            this.failGame();
        }
    },
    judgePipe(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;

        if((pipeX >= 38 && pipeX <= 110) && (birdY < pipeY[0] || birdY > pipeY[1]) ){
            this.failGame()
        }
    },
    addScore(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        if(pipeX < 13){
            this.oScore.innerText = ++ this.score
        }
    },
    createPipe(){
        for(var i = 1; i <= this.pipeLength; i++){
            var oPipeUpHeight = Math.floor(Math.random()*100 + 150);
            var oPipeDownHeight = 450 - oPipeUpHeight;
            var oPipeUp = this.createEle('div', ['pipe','pipe-up'], {
                height: oPipeUpHeight + 'px',
                left:  i * 300 + 'px'
            });
            var oPipeDown = this.createEle('div', ['pipe','pipe-down'], {
                height: oPipeDownHeight + 'px',
                left:  i * 300 + 'px'
            })

            this.el.appendChild(oPipeUp)
            this.el.appendChild(oPipeDown)
            this.pipeArr.push({
                up: oPipeUp,
                down: oPipeDown,
                y: [oPipeUpHeight, oPipeUpHeight + 150]
            })
        }
    },
    createEle(eleName, classArr, styleObj){
        var oPipe = document.createElement(eleName);
        classArr.forEach(item=>{
            oPipe.classList.add(item)
        });
        for (const key in styleObj) {
            oPipe.style[key] = styleObj[key]
        };
        return oPipe;
    },
    pipeMove(){
        this.pipeArr.forEach((pipe,index)=>{
            if(pipe.up.offsetLeft < -52){
                pipe.up.style.left = this.pipeArr[this.lastPipeIndex].up.offsetLeft + 300 + 'px';
                pipe.down.style.left = this.pipeArr[this.lastPipeIndex].up.offsetLeft + 300 + 'px';
                this.lastPipeIndex = index;
            }else{
                pipe.up.style.left = pipe.down.style.left = pipe.up.offsetLeft - this.skytep + 'px';
            }
        })
    },
    skyMove(){
        this.skyPosition -= this.skytep;
        this.el.style.backgroundPositionX = this.skyPosition +'px'
    },
    startBirdPosition(count){
        this.oBird.style.backgroundPositionX = count%3 * -30 + 'px'
    },
    startBirdTop(){
        this.birdTop = this.oBird.offsetTop === 230 ? 280 : 230;
        this.oBird.style.top = this.birdTop + 'px'
    },
    startText(){
        if(Array.from(this.oStart.classList).indexOf('change')===1){
            this.oStart.classList.remove('change')
        }else{
            this.oStart.classList.add('change')
        }
    },
    failGame(){
        clearInterval(this.timer);
        var length = this.setScore();
        length = length > 5 ? 5 : length; 
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oScore.style.display = 'none';
        this.oFinalScore.innerText = '得分：'+this.score;
        var htmlStr = '';
        for(var i = 1; i <= length; i++){
            var degreeClass = '';
            switch(i){
                case 1: 
                degreeClass = 'first';
                break;
                case 2: 
                degreeClass = 'scend';
                break;
            }
            htmlStr += `
            <li>
                <span class="endNumber ${degreeClass}">${i}</span>
                <span class="end-score">分数：${this.scoreArr[i].score}</span>
                <span class="time">${this.scoreArr[i].time}</span>
            </li>
            `
        }
        this.oRankList.innerHTML = htmlStr

    },
    getScore(){
        var scoreArr = this.getLocal('score');
        return scoreArr ? JSON.parse(scoreArr) :[];
    },
    setScore(){
        this.scoreArr.push({
            score: this.score,
            time: this.getDate()
        });
        this.scoreArr.sort((a,b)=>{
            return b.score - a.score;
        });

        this.setLocal('score', this.scoreArr)

        return this.scoreArr.length;
    },
    getDate(){
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();

        return `${year}.${month}.${day} ${hour}:${minute}:${second}`
    },
    getLocal(key){
        return localStorage.getItem(key);
    },
    setLocal(key, value){
        if(typeof value === 'object'){
            value = JSON.stringify(value)
        }
        localStorage.setItem(key, value)
    },
    setSessionPlay(){
        sessionStorage.setItem('play', true);
    },
    getSessionPlay(){
        return sessionStorage.getItem('play');
    }
}
bird.initData();
bird.animate()