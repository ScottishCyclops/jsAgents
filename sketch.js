//constantes
const WORLD_WIDTH = innerWidth;
const WORLD_HEIGHT = innerHeight;

const NUM_FOOD = 300;
const NUM_POISON = 50;
const NUM_AGENTS = 350;
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
let totalMaxFit = 0;
let totalDeath = 0;
let totalBirth = 0;
let bestAgent = null;
let t = 0;
let delta = 60;

let debugMate = false;
let debugGood = false;
let debugBad = false;

function begin() {
    food = new Array();
    agents = new Array();
    poison = new Array();
    graph = new Graph(delta);

    for (let i = 0; i < NUM_AGENTS; i++) {
        let x = random(width);
        let y = random(height);
        agents.push(new Agent(x, y, RADIUS, new Dna()));
    }
    totalBirth += NUM_AGENTS

    for (let i = 0; i < NUM_FOOD; i++) {
        let x = random(width);
        let y = random(height);
        food.push(createVector(x, y));
    }

    for (let i = 0; i < NUM_POISON; i++) {
        let x = random(width);
        let y = random(height);
        poison.push(createVector(x, y));
    }
}

function setup() {
    createCanvas(WORLD_WIDTH, WORLD_HEIGHT);

    begin();
}

function draw() {
    background(50, 130);

    if (agents.length === 0) {
        begin();
    }

    if (t % delta === 0 && random() < 0.5) {
        addIn(poison);
    }

    currentTotalFit = 0;
    currentMaxFit = 0;
    bestAgent = agents[0];


    //food drawing
    for (let i = food.length - 1; i >= 0; i--) {
        fill("#f1c40f");
        noStroke();
        ellipse(food[i].x, food[i].y, RADIUS);
    }

    //poison drawing
    for (let i = poison.length - 1; i >= 0; i--) {
        fill("#16a085");
        noStroke();
        ellipse(poison[i].x, poison[i].y, RADIUS);
    }


    for (let i = agents.length - 1; i >= 0; i--) {
        if (agents[i].health <= 0) {

            //if it's the last, print it's ADN for reference
            if (agents.length === 1) {
                print(agents[i].dna);
            }
            poison.push(createVector(agents[i].position.x, agents[i].position.y));
            removeIn(agents, i);
            totalDeath++;
        }
        else {
            agents[i].update(food, poison, agents);
            agents[i].draw(false, false, false);

            currentTotalFit += agents[i].fitness;
            if (agents[i].fitness > currentMaxFit) {
                currentMaxFit = agents[i].fitness;
                bestAgent = agents[i];
            }
            if (agents[i].fitness > totalMaxFit) {
                totalMaxFit = agents[i].fitness;
            }

            //reproduction
            if (random(1) < 0.001 && agents[i].fitness >= currentAvgFit) {
                //-2 to not spawn it directly on it's parent
                let spawnOffsetX = random(-RADIUS * 3, RADIUS * 3);
                let spawnOffsetY = random(-RADIUS * 3, RADIUS * 3);
                agents.push(new Agent(agents[i].position.x + spawnOffsetX, agents[i].position.y + spawnOffsetY, RADIUS, agents[i].dna.copy()));
                totalBirth++;
            }
        }
    }

    if (agents.length <= 0) {
        push();
        fill("#c0392b");
        textAlign(CENTER, CENTER);
        textSize(40);
        text("ALL DEAD", width / 2, height / 2);
        pop();
    }
    else {
        currentAvgFit = currentTotalFit / agents.length;

        //highlight best agent
        fill(255, 255, 255, 20);
        noStroke();
        ellipse(bestAgent.position.x, bestAgent.position.y, bestAgent.size * 10);

        if (t % delta === 0) {
            graph.data.push([bestAgent.dna.copy(false), totalMaxFit, agents.length]);
        };
    }

    //infos
    fill(255);
    rect(0, height - INFOS_HEIGHT, width, INFOS_HEIGHT);
    fill(0);
    textAlign(LEFT, CENTER);
    text("agents: " + agents.length, 10, height - INFOS_HEIGHT / 2);
    text("death: " + totalDeath, 90, height - INFOS_HEIGHT / 2);
    text("birth: " + totalBirth, 170, height - INFOS_HEIGHT / 2);
    text("current average fitness: " + floor(currentAvgFit), 250, height - INFOS_HEIGHT / 2);
    text("current max fitness: " + floor(currentMaxFit), 450, height - INFOS_HEIGHT / 2);
    text("total max fitness: " + floor(totalMaxFit), 650, height - INFOS_HEIGHT / 2);

    graph.update();
    graph.draw();

    t++;
}

function removeIn(list, index) {
    list.splice(index, 1);
}

function addIn(list) {
    list.push(createVector(random(width), random(height)));
}

function keyPressed() {

    if (keyCode === 81) ///Q
    {
        debugMate ? debugMate = false : debugMate = true;
        agents.forEach(function (agent) {
            agent.debugMate = debugMate;
        }, this);
        if (debugMate)
            print("debugging mate")
    }
    if (keyCode === 87) //W
    {
        debugGood ? debugGood = false : debugGood = true;
        agents.forEach(function (agent) {
            agent.debugGood = debugGood;
        }, this);
        if (debugGood)
            print("debugging good")
    }
    if (keyCode === 69) ///E
    {
        debugBad ? debugBad = false : debugBad = true;
        agents.forEach(function (agent) {
            agent.debugBad = debugBad;
        }, this);
        if (debugBad)
            print("debugging bad")
    }
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function (min, max) {
    return this <= min ? min : this >= max ? max : this;
}