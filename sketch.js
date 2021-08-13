var dog, happyDog, database, foodStock;
var dogImage1, dogImage2, name;
var fedTime, lastFed, foodObj;
var feedPetButton, addFoodButton;

function preload() {
  dogImage1 = loadImage("dogImg.png"); 
  dogImage2 = loadImage("dogImg1.png");
}

function setup() {
  createCanvas(800, 710,1000,200);
  
  database = firebase.database();
  fedTime = database.ref("feedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  foodsRef = database.ref("Food");
  foodsRef.on("value",function(data){
    foodStock = data.val();
  });
  
  dog = createSprite(400,500,10,10);
  dog.addImage(dogImage1);
  dog.scale = 0.3;

  foodObj = new Food();

  var nameInput = createInput("NAME THE DOG");
  nameInput.position(500,500);
  var saveNameButton = createButton("SAVE NAME");
  saveNameButton.position(500,600);
  saveNameButton.mousePressed(function(){
    var name = nameInput.value();
    database.ref("/").update({
      Name: name
    })
  })

  addFoodButton = createButton("ADD FOOD");
  addFoodButton.position(1000,60);
  addFoodButton.mousePressed(addFoods);
  feedPetButton = createButton("FEED DOG");
  feedPetButton.position(1100,60);
  feedPetButton.mousePressed(feedDog);

}

function draw() {  
  background(color(0,mouseY,0));

  foodObj.display();
  foodObj.getFoodStock();

  drawSprites();

  textFont("lucida");
  fill(255);
  strokeWeight(3);
  stroke(0);
  if(foodStock !== undefined) {
    textSize(35);
    text("Food Remaining: "+foodStock, 250, 700);
  }
  if(lastFed>=12) {
    text("Last Fed: "+lastFed%12+" PM", 10, 30);
  } else if(lastFed===0) {
    text("Last Fed: Never", 10, 30);
  } else {
    text("Last Fed: "+lastFed + " AM", 10, 30);
  }
}

function addFoods() {
  dog.addImage(dogImage1);
  foodStock++;
  database.ref("/").update({
    Food: foodStock
  });
}

function feedDog() {
  dog.addImage(dogImage2);
  foodObj.deductFood(foodStock);
  database.ref("/").update({
    Food: foodStock,
    feedTime: hour()
  })
}
