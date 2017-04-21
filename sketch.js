//constantes
const WORLD_WIDTH = innerWidth;
const WORLD_HEIGHT = innerHeight;

const NUM_FOOD = 200;
const NUM_POISON = 100;
const NUM_AGENTS = 200;
const RADIUS = 6;
const INFOS_HEIGHT = 50;

//variables globales
let agents;
let food;
let poison;
let graph;

let currentAvgFit = 0;
let currentTotalFit = 0;
let currentMaxFit = 0;
let totalMaxFit   = 0;
let totalDeath = 0;
let totalBirth = NUM_AGENTS;
let bestAgent = null;
let t = 0;
let delta = 60;


function setup()
{
    createCanvas(WORLD_WIDTH,WORLD_HEIGHT);

    food = new Array();
    agents = new Array();
    poison = new Array();
    graph = new Graph(delta);

    for(let i = 0; i < NUM_AGENTS; i++)
    {
        let x = random(width);
        let y = random(height);
        agents.push(new Agent(x,y, RADIUS, new Dna()));
    }

    for(let i = 0; i < NUM_FOOD; i++)
    {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x,y));
    }

    for(let i = 0; i < NUM_POISON; i++)
    {
        let x = random(width);
        let y = random(height);
        poison.push(createVector(x,y));
    }

    let nombre = 120;
}

function draw()
{
    background(50, 100);

    currentTotalFit = 0;
    currentMaxFit = 0;
    bestAgent = agents[0];


    //food drawing
    for(let i = food.length-1; i >= 0 ; i--)
    {
        fill("#f1c40f");
        noStroke();
        ellipse(food[i].x,food[i].y, RADIUS);
    }

    //poison drawing
    for(let i = poison.length-1; i >= 0 ; i--)
    {
        fill("#16a085");
        noStroke();
        ellipse(poison[i].x,poison[i].y, RADIUS);
    }


    for(let i = agents.length-1; i >= 0; i--)
    {
        if(agents[i].health <= 0)
        {
            removeIn(agents,i);
            totalDeath++;
        }
        else
        {
            agents[i].update(food,poison,agents);
            agents[i].draw();

            currentTotalFit+=agents[i].fitness;
            if(agents[i].fitness > currentMaxFit)
            {
                currentMaxFit = agents[i].fitness;
                bestAgent = agents[i];
            }
            if(agents[i].fitness > totalMaxFit)
            {
                totalMaxFit = agents[i].fitness;
            }

            //reproduction
            if(random(1) < 0.001 && agents[i].fitness >= currentAvgFit)
            {
                //-2 to not spawn it directly on it's parent
                let spawnOffsetX = random(-RADIUS*3,RADIUS*3);
                let spawnOffsetY = random(-RADIUS*3,RADIUS*3);
                agents.push(new Agent(agents[i].position.x+spawnOffsetX,agents[i].position.y+spawnOffsetY,RADIUS,agents[i].dna.copy()));
                totalBirth++;
            }
        }
    }

    if(agents.length <= 0)
    {
        push();
        fill("rgba(192, 57, 43,1.0)");
        textAlign(CENTER,CENTER);
        textSize(40);
        text("ALL DEAD",width/2,height/2);
    }
    else
    {
        currentAvgFit = currentTotalFit/agents.length;

        //highlight best agent
        fill(255,255,255,20);
        noStroke();
        ellipse(bestAgent.position.x,bestAgent.position.y,bestAgent.size*10);
    }

    //infos
    pop();
    fill(255);
    rect(0,height-INFOS_HEIGHT,width,INFOS_HEIGHT);
    fill(0);
    textAlign(LEFT,CENTER);
    text("agents: "+agents.length,                        10,height-INFOS_HEIGHT/2);
    text("death: "+totalDeath,                            90,height-INFOS_HEIGHT/2);
    text("birth: "+totalBirth,                            170,height-INFOS_HEIGHT/2);
    text("current average fitness: "+floor(currentAvgFit),250,height-INFOS_HEIGHT/2);
    text("current max fitness: "+floor(currentMaxFit),    450,height-INFOS_HEIGHT/2);
    text("total max fitness: "+floor(totalMaxFit),        650,height-INFOS_HEIGHT/2);

    if(t % delta === 0)
    {
        graph.data.push([bestAgent.dna.copy(false),totalMaxFit]);
    };

    graph.update();
    graph.draw();

    t++;
}

function removeIn(list,index)
{
    list.splice(index,1);
}

function addIn(list)
{
    list.push(createVector(random(width),random(height)));
}

function keyPressed() {
  if (keyCode === TAB) {
    console.log(bestAgent.dna);
  }
}