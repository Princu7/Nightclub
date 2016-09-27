var url=require('url');
var request=require('request');
var express=require('express');
var path=require('path');
var app=express();
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var mongoClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/voting";
var uuid=require('node-uuid');
var crypto=require('crypto');
app.use(express.static(path.join(__dirname,'public')));
app.set('views','./views');
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",function(req,res){
    res.render('index');
});
function getCordinates(url,callback){
	request(url,function(error,response,body){
        if(error)
            throw error;
        var obj=JSON.parse(body);
        var cordinates=(obj["results"][0]["geometry"]["location"]);
        callback(cordinates);
		});
}

function getPlaceDetails(cordinates){
	console.log(cordinates);
    var url="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+cordinates.lat+","+cordinates.lng+"&radius=20000&type=bar&key=AIzaSyDgddP1FZXJqccZNOXMzvqf1AUpQPdNano"
    //console.log(url);
    request.get(url,function(error,response,body){
        if(error)
            throw error;
        var obj=JSON.parse(body);
        var results=obj["results"].slice(0,3);
        //console.log(results);
        var resArr=[];
        var counter=0;
        results.forEach(function(element){
            var newObj={};
            newObj.name=element.name;
            newObj.rating=element.rating;
            newObj.address=element.vicinity;
            var key="AIzaSyDgddP1FZXJqccZNOXMzvqf1AUpQPdNano";
            var photoParameters="maxwidth=300&maxheight=300&photoreference="+element["photos"][0].photo_reference+"&key="+key;
            var photourl="https://maps.googleapis.com/maps/api/place/photo?"+photoParameters;
            var placeUrl="https://maps.googleapis.com/maps/api/place/details/json?placeid="+element["place_id"]+"&key="+key;
            //console.log(placeUrl);
            //console.log(photourl);
            request(photourl,function(error,response,body){
                //console.log(response.request.uri.href);
                newObj.photoLink=response.request.uri.href;
                request.get(placeUrl,function(error,response,body){
                    var obj=JSON.parse(body);
                    //console.log(obj["result"]["reviews"][0].text);
                    newObj.review=obj["result"]["reviews"][0].text;
                    counter++;
                    resArr.push(newObj);
                    if(counter==3)
                        console.log(resArr);
                });
            });
        });
    });
}
	
app.get("/city/:name",function(req,res){
    var cityname=req.params.name;
    console.log(cityname);
    var url="https://maps.googleapis.com/maps/api/geocode/json?address="+cityname;
    console.log(url);
    getCordinates(url,getPlaceDetails);
});
app.listen(8000);
