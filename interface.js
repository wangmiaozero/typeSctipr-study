/* 接口可以作为一个类型批注。

编译以上代码 tsc interface.ts 不会出现错误，
但是如果你在以上代码后面添加缺失 name 参数的语句则在编译时会报错： */
function area(shape) {
    var area = shape.width * shape.height;
    return "I'm " + shape.name + " with area " + area + " cm squared";
}
console.log(area({ name: "rectangle", width: 30, height: 15 }));
console.log(area({ name: "square", width: 30, height: 30, color: "blue" }));
