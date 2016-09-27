window.onload=function(){
    console.log("it's working");
    var but=document.getElementById("city");
    but.addEventListener("click",handler,false);
}
function handler(e){
    var xhr=new XMLHttpRequest();
    var cityname=document.getElementById("search").value;
    var bars=document.getElementById("bars");
    bars.innerHTML="";
    console.log(cityname);
    var url="/city/"+cityname;
    console.log(url);
    xhr.open("GET",url,true);
    xhr.send(null);
    xhr.onload=function(e){
        console.log("request for city name sent");
        if(xhr.readyState===4){
            console.log("ready status is four");
            if(xhr.status===200){
                console.log("returned response is 200");
                console.log("I am coming till here");
                // never access the properties of an array using xhr.responseText or xhr.response. Most probably it doesn't work.I am really confused by all this notation.It was working in the previous project.I have to look more into it.
                var newObj=JSON.parse(xhr["response"]);
                makeBars(newObj);
            }
        }
    }
}

function makeBars(arr){
    arr.forEach(function(elem){
        var bar=document.getElementById("bars");
        console.log(elem);
        var maindiv=document.createElement('div');
        var picturediv=document.createElement('div');
        var textdiv=document.createElement('div');
        var image=document.createElement("img");
        var button=document.createElement("button");
        button.className="btn btn-default btn-large";
        button.innerHTML="I am going";
        console.log(elem.photoLink);
        image.src=elem.photoLink;
        image.className="image";
        picturediv.className="col-md-4 col-xs-12 picture"
        textdiv.className="col-md-8 col-xs-12 text";
        maindiv.className='mainrow row';
        var span=document.createElement("span");
        var header2=document.createElement('h2');
        header2.innerHTML=elem.name;
        span.appendChild(header2);
        span.appendChild(button);
        var header3=document.createElement('h3');
        header3.innerHTML=elem.address;
        var para=document.createElement("p");
        para.innerHTML=elem.review;
        textdiv.appendChild(span);
        textdiv.appendChild(header3);
        textdiv.appendChild(para);
        picturediv.appendChild(image);
        maindiv.appendChild(picturediv);
        maindiv.appendChild(textdiv);
        bars.appendChild(maindiv);
    });
}
