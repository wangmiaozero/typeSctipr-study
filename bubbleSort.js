/*
 * @Description:
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-05-09 19:16:17
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-05-09 20:27:15
 */
//记录开始时间
function main() {
    var start = new Date().getTime();
    var num = 100000000;
    var list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = 0; i < num; i++) {
        BubbleSort(list);
    }
    //打印耗时时间
    console.log(new Date().getTime() - start);
}
//排序
function BubbleSort(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] < arr[j + 1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
main();
