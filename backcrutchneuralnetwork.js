let mnist = require("mnist");
let fs = require("fs");

let network = [28*28,400,400,400,10];


let arr = require('easy-mnist').makeData(69000,1000);

let writeneurons = false;
let writeinterval = 100000;
let writename = "neurons.txt";

let weights = [];
let bias = [];

//console.log(Math.tanh(2))

randomweights();
//console.log(weights);
let lt = new Date().getTime();
for(var a = 0; true; a++){

    let inp = arr.traindata[a % arr.traindata.length].image;
    let out = arr.traindata[a % arr.traindata.length].label;
    //runinput(inp)
    backprop(inp, out, network.length-2);

    if(a % 4000 == 0){
      console.log(testme() + " " + a + " " + ( new Date().getTime() - lt )/1000);
      lt = new Date().getTime();
    }

    if(a!= 0 && a % writeinterval == 0){

      fs.writeFileSync(writename, JSON.stringify(weights) + "\n" + JSON.stringify(bias));

    }

}

function testme(){

  let correct = 0;

  for(var a = 0; a < arr.testdata.length; a++){

      let inp = arr.testdata[a].image;
      let out = arr.testdata[a].label;

      let result = runinput(inp);
      let max = [result[0][0], 0];
      let c = 0;

      for(var b = 0; b < result[0].length; b++){

        if(out[b] == 1) c = b;
        if(result[0][b] > max[0]) max = [result[0][b], b];
      }

      if(c == max[1]) correct++;
      //console.log(correct + " / " + a + " " + (correct/a));



  }

  return correct/a;
}


//console.log(weights);

//console.log(bias);
function backprop(inputs, outputs, i, newcost="nothing", theo="nothing"){

  let learningrate = 0.001;
  let on = theo=="nothing" ? runinput(inputs) : theo;
  let os = on[1];
  let o = on[0];

  let c = [];

  let s = 0;

  if(newcost != "nothing") c = newcost;
  else{
    for(var a = 0; a < outputs.length; a++){

      c.push(2 * (outputs[a] - o[a]) );
      s += Math.abs( outputs[a] - o[a] );
    }
  }

  let newc = [];
  let dsigs = [];

  let m = weights[i].length;

  for(var a = 0; a < weights[i].length; a++){

    newc.push(0);

    let dir = i == 0 ? inputs[a] : os[i-1][0][a];

    for(var d = 0; d < weights[i][a].length; d++){

      let cost = c[d];
      if(d >= dsigs.length) dsigs.push(deltasig(os[i][1][d]))
      let dsig = dsigs[d];

      let deltaWC = dsig*dir*cost;
      weights[i][a][d] += learningrate * deltaWC * m;

      newc[a] += dsig*weights[i][a][d]*cost;



    }

  }

  for(var d = 0; d < bias[i].length; d++){

    let cost = c[d];
    let deltaB = dsigs[d]*cost;
    bias[i][d] += learningrate*deltaB*m;
  }

  if(i > 0) backprop(inputs, outputs, i-1, newc, on);

}

function randomweights(){

  for(var a = 0; a < network.length-1; a++){

    let arr = [];
    let biasweights = [];

    for(var b = 0; b < network[a]; b++){

      let arr2 = [];

      for(var c = 0; c < network[a+1]; c++){

        arr2.push(Math.random() - 0.5);

      }

      arr.push(arr2);


    }
    for(var b = 0; b < network[a+1]; b++){
      biasweights.push(Math.random()*0.0001);
    }

    weights.push(arr);
    bias.push(biasweights);


  }

}

function runinput(input){

  let inputc = input;
  let output = [];
  let nosig = [];
  let outputs = [];

  for(var a = 0; a < weights.length; a++){

    if(output.length == 0){
      for(var b = 0; b < weights[a][0].length; b++) {
        output.push(0);
        nosig.push(0);
      }
    }


    for(var b = 0; b < bias[a]; b++){

      output[b] += bias[a][b];

    }

    for(var b = 0; b < weights[a].length; b++){
      if(inputc[b] == 0) continue;
      for(var c = 0; c < weights[a][b].length; c++){

        output[c] += weights[a][b][c] * inputc[b];
        nosig[c] = output[c];

      }

    }

    for(var b = 0; b < output.length; b++){

      output[b] = sigmoid(output[b]);

    }

    inputc = output;
    let o = [];

    o.push(output);
    o.push(nosig);

    outputs.push(o);

    output = [];
    nosig = [];



  }

  return [inputc, outputs];

}



function sigmoid(z,k=1) {
  //return Math.max(0,Math.min(1, z ))
  return ( 1 / (1 + Math.exp(-z/k)) );
  //return Math.tanh(z);
  //return z*( 1 / (1 + Math.exp(-z/k)) )
  //return 0.5*z/(Math.abs(z) + 1) + 0.5;

}

function deltasig(z,k=1){

  //return z < 0 ? 0 : (z > 1 ? 1 : z);
  return -( ( -(1/k)*Math.exp(-z/k) ) / ( 1 + Math.exp(-z/k) )**2 )
  //return 1 - Math.tanh(z) * Math.tanh(z);
  //return sigmoid(z,k) -z*( ( -(1/k)*Math.exp(-z/k) ) / ( 1 + Math.exp(-z/k) )**2 );
  //return 0.5/((Math.abs(z)+1)**2);
}
