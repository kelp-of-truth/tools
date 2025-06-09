math.config({
    number: 'BigNumber',
    precision: 128,
    relTol: 1e-512,
    absTol: 1e-512
})
let mem=1;
function binomialCoefficient(n, k) {
    let a=1;
    let b=1;
    
    if(k!==0){
        a=`(${a}*${n-(k-1)})`;
        b=`(${b}*${k})`;
    }
    const res=`(${mem})*(${a})/(${b})`;
    mem=res;
    // mem*=(`${n-i}/${k+1}`);
    // const res;
    return res;
}

function binomialDistribution(n, k, p) {
    const coefficient = binomialCoefficient(n, k);
    return `(${p}^${k})*((1-${p})^${n - k})*(${coefficient})`;
}

let n; // 試行回数
let k;  // 成功回数
let p; // 成功確率

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

    const expectation=JSON.parse(math.evaluate(`${n}*${p}`));
    const variance=JSON.parse(math.evaluate(`${n}*${p}*${1-p}`));
    const standard_deviation=JSON.parse(math.evaluate(`sqrt(${variance})`));

    document.querySelector("#expectation").innerHTML=String(expectation);
    document.querySelector("#variance").innerHTML=String(variance);
    document.querySelector("#standard_deviation").innerHTML=String(standard_deviation);

    for(k = 0; k <= n; k++) {
        var res=math.evaluate(binomialDistribution(n, k, p));
        var res2=res.d.join("");
        res2=`${res2.slice(0,1)}${res2.length>=2?".":""}${res2.slice(1,6)}${res2[7]===undefined?0:Number(res2[7])>=5?String(Number(res2[6])+1):String(Number(res2[6]))}e${res.e}`;
        data.data.push([k,res.e<=-4?`${res2.split("e")[0]}&nbsp;&times;&nbsp;10<sup>${res2.split("e")[1]}</sup>`:Number(res2)]);
        chart_data.push(Number(res2));
        chart_labels.push(k);
    }
    document.querySelector("table tbody").innerHTML=data.data.map((e)=>`<tr><td>${e[0]}</td><td>${e[1]}</td></tr>`).join("");

    createChart([chart_labels,chart_data]);
})
function createChart(data){
    console.log(data)
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
            }
        }
    });
}
