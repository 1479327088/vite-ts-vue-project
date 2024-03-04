//基础类型
const isDone:string = 'jkskfjskdk';  //         基础类型string、number、boolean
const arr:number[] = [1,2]           //         数组类型
const arr1:Array<number> = [3,4]           

const isNum = <number>20;            //类型断言

let nArr = [...arr1,...arr]
console.log(nArr);

//元组Tuple
const x:[string,number,number] = ['x',1,2]
console.log('x---->>>',x);



//枚举类型
enum Color {
    Red = 3,
    Green,
    Blue
}
const r:Color = Color.Red;
let colorName: string = Color[4];
console.log('colorName',r,colorName);


//任意类型
//有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。
const a:any = 'fd321'
const list:any[] = ['12', 12, false]

//void类型
//某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void：
const warnUser = function():void{
    console.log("This is my warning message");
}


//接口
interface Point {
    readonly x :number | string,
    readonly y :number | string
}
let p1:Point = {x:10,y:'20'}

console.log(r);


//类
class Greeter {
    name:string
    constructor(message:string){
        this.name = message
    }
    getMess(){
        return `hello, + ${this.name}`
    }
}
let lisiC = new Greeter('lisi');
console.log('lisiC--->',lisiC);

console.log(lisiC.getMess());




export {isDone, isNum, r, a, list ,warnUser, p1}