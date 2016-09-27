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
function minimum(a,b){
    if(a<b)
        return a;
    return b;
}
function getCordinates(url,callback){
	request(url,function(error,response,body){
        if(error)
            throw error;
        var obj=JSON.parse(body);
        var cordinates=(obj["results"][0]["geometry"]["location"]);
		console.log(cordinates);
		var url="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+cordinates.lat+","+cordinates.lng+"&radius=20000&type=bar&key=AIzaSyDgddP1FZXJqccZNOXMzvqf1AUpQPdNano"
		console.log(url);
		request.get(url,function(error,response,body){
		    if(error)
		        throw error;
		    var obj=JSON.parse(body);
            var chosenLength=6;
            var cutLength=minimum(obj["results"].length,chosenLength);
		    var results=obj["results"].slice(0,cutLength);
		    //console.log(results);
		    var resArr=[];
		    var counter=0;
		    results.forEach(function(element){
		        var newObj={};
		        newObj.name=element.name;
                console.log("the rating is "+element.rating);
                if(element.rating===undefined)
                    newObj.rating="not available";
                else
                    newObj.rating=element.rating;
		        newObj.address=element.vicinity;
		        var key="AIzaSyDgddP1FZXJqccZNOXMzvqf1AUpQPdNano";
                var photoUrl="",placeUrl="";
                if(element["photos"]){
                    var photoParameters="maxwidth=250&maxheight=250&photoreference="+element["photos"][0].photo_reference+"&key="+key;
                    photoUrl="https://maps.googleapis.com/maps/api/place/photo?"+photoParameters;
                }
                else{
                    photoUrl="http://static2.hexblot.gr/sites/default/files/styles/articlefull/public/article_images/image-not-found.gif?itok=HhSw--GS";
                    console.log("not able to find out the image of the restaurant");
                }
		        var placeUrl="https://maps.googleapis.com/maps/api/place/details/json?placeid="+element["place_id"]+"&key="+key;
		        //console.log(placeUrl);
		        //console.log(photourl);
		        request(photoUrl,function(error,response,body){
		            //console.log(response.request.uri.href);
		            newObj.photoLink=response.request.uri.href;
		            request.get(placeUrl,function(error,response,body){
		                var obj=JSON.parse(body);
		                //console.log(obj["result"]["reviews"][0].text);
                        if(obj["result"]["reviews"])
                            newObj.review=obj["result"]["reviews"][0].text;
                        else
                            newObj.review="No reviews available";
		                counter++;
		                resArr.push(newObj);
		                if(counter==cutLength)
                            callback(resArr);
		            });
		        });
		    });
		});
	});
}
	
app.get("/city/:name",function(req,res){
    var cityname=req.params.name;
    console.log(cityname);
    var url="https://maps.googleapis.com/maps/api/geocode/json?address="+cityname;
    //console.log(url);
    getCordinates(url,function(resArr){
        console.log(resArr);
        // remember to set the headers of the response here
        res.json(resArr);
    });
});
app.listen(8000);
