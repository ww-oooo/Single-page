window.onload=function(){
	var oBox = document.getElementById("main");
				    var aBtn = oBox.getElementsByClassName("main-tit");
				    var aDiv = oBox.getElementsByClassName("content");
				    for(var i=0;i<aBtn.length;i++){
				        aBtn[i].index=i;
				        aBtn[i].onclick=function(){
				        	console.log(1)
				            for(var k=0;k<aBtn.length;k++){//先清空所有的样式
				                aBtn[k].style.background='#dfeaf5';
				                aBtn[k].style.color='#000';
				                aDiv[k].style.display ='none';
				            }
				            this.style.background ='#70a3db';
				            this.style.color ='#fff';
				            aDiv[this.index].style.display ='block';
				        };
				    }
}


