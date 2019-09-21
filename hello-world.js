var hello = "Hello World!";
var num = 10;
console.log(hello);
console.log(num);
function area(shape, width, height) {
    var area = width * height;
    return "I'm a " + shape + " with an area of " + area + " cm squared.";
}
document.body.innerHTML = area("rectangle", 30, 15);
