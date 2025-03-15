math.config({
    number: 'BigNumber',
    precision: 128,            // Number of significant digits for BigNumbers
    relTol: 1e-512,
    absTol: 1e-512
})
function binomialCoefficient(n, k) {
    let a="1";
    let b="1";
    for(var i=0;i<k;i++){
        a=`${a}*${n-i}`;
        b=`${b}*${i+1}`;
    }

    const res=`(${a})/(${b})`;
    return res;
    // return factorial(n) / (factorial(k) * factorial(n - k));
}

function binomialDistribution(n, k, p) {
    const coefficient = binomialCoefficient(n, k);
    return `(${p}^${k})*((1-${p})^${n - k})*(${coefficient})`;
}

let n; // 試行回数
let k;  // 成功回数
let p; // 成功確率

// var test=(math.evaluate(binomialDistribution(100,100,0.1)));
// console.log(test);
// test2=test.d.join("");
// console.log(test2);
// // console.log(math.evaluate("1/2"))

window.addEventListener("load", () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    n = params.get('n');
    p = params.get('p');
    document.querySelector("#n").value=n;
    document.querySelector("#p").value=p;
    var data={
        sort:true,
        columns:["k","P(X=k)"],
        data:[]
    }
    var chart_data=[];
    var chart_labels=[];
    document.querySelector("#expected-value").innerHTML=`${n*p}`;
    for(k = 0; k <= n; k++) {
        var res=math.evaluate(binomialDistribution(n, k, p));
        var res2=res.d.join("");
        // console.log(res2[7])
        res2=`${res2.slice(0,1)}${res2.length>=2?".":""}${res2.slice(1,6)}${res2[7]===undefined?0:Number(res2[7])>=5?String(Number(res2[6])+1):String(Number(res2[6]))}e${res.e}`;
        data.data.push([k,res.e<=-4?`${res2.split("e")[0]}&nbsp;&times;&nbsp;10<sup>${res2.split("e")[1]}</sup>`:Number(res2)]);
        chart_data.push(Number(res2));
        chart_labels.push(k);
    }
    // const grid=new gridjs.Grid(data);
    // grid.render(document.querySelector("#binomial-result-table"))
    document.querySelector("#binomial-result-table table tbody").innerHTML=data.data.map((e)=>`<tr><td>${e[0]}</td><td>${e[1]}</td></tr>`).join("");

    createChart([chart_labels,chart_data]);

    setTimeout(() => {
        track.style.height=`${window.innerHeight**2/document.body.clientHeight-10}px`;
        scrollbar();
    }, 500);
})
function createChart(data){
    // console.log(data)
// document.querySelector("#binomial-result-chart .b-div").style.width=`${data[0].length*5}px`
var ctx = document.getElementById("myBarChart");
var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: data[0],
        datasets: [
            {
                label: 'P(x=k)',
                data: data[1],
                backgroundColor: "rgba(0, 60, 255, 0.5)"
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: '二項分布'
        },
        // scales: {
        //     yAxes: [{
        //     ticks: {
        //         suggestedMax: Math.ceil((Math.max(...data[1]))*100)/100,
        //         suggestedMin: 0,
        //         stepSize: 0.01,
        //         callback: function(value, index, values){
        //         return  value
        //     }
        //     }
        // }]
        // }
        }
    });
}