class Agent
{
    constructor(x,y, radius, dna)
    {
        this.position = createVector(x, y);
        this.velocity = createVector(0,0);
        this.steering = createVector(0,0);


        this.size = radius;
        this.maxVelocity = 5;
        this.maxAngular = .2;
        this.mass = 2;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.dna = dna;
        this.fitness = 0;
        this.healthDecreaseRate = .2;

        this.debugMate = false;
        this.debugGood = false;
        this.debugBad = false;
    }

    getPositionsList(agents)
    {
        let list = new Array();
        
        agents.forEach(function(agent) {
            list.push(agent.position);
        }, this);

        return list;
    }

    getClosest(list)
    {
        let distance = Infinity;
        let closestIndex = -1;

        for(let i = list.length-1; i >= 0; i--)
        {
            let d = list[i].dist(this.position);
            if(d < distance)
            {
                distance = d;
                closestIndex = i;
            }
        }

        return [closestIndex,distance];
    }

    seek(target, attraction)
    {
        //+1 to prevent log of 0
        let speed = log(p5.Vector.dist(this.position,target)+1);

        let desiredVelocity = p5.Vector.sub(target,this.position).normalize().mult(speed);

        let steering = p5.Vector.sub(desiredVelocity,this.velocity);
        steering = steering.div(this.mass).mult(attraction).limit(this.maxAngular);
        return steering;
    }

    addSteering(velocity)
    {
        this.steering.add(velocity).limit(this.maxAngular);
    }

    update(good, bad, mates)
    {

        let closestGood = this.getClosest(good);
        if(closestGood[1] < this.size)
        {
            //we eat it
            let nutr = 10;
            this.health+=nutr;
            this.fitness+=nutr;
            this.size+=.2;
            removeIn(good,closestGood[0]);
            addIn(good);
        }
        else if(closestGood[1] <= this.dna.goodCareDist);
        {
            //we move towards it at the speed from the dna (can be negative)
            this.addSteering(this.seek(good[closestGood[0]],this.dna.goodAttraction));
        }

        let closestBad = this.getClosest(bad);
        if(closestBad[1] < this.size)
        {
            let nutr = 15;
            this.health-=nutr;
            this.fitness-=nutr;
            this.healthDecreaseRate+=.1;
            this.size+=2;
            removeIn(bad,closestBad[0]);
        }
        else if(closestBad[1] <= this.dna.badCareDist)
        {
            this.addSteering(this.seek(bad[closestBad[0]],this.dna.badAttraction));
        }

        let closestMate = this.getClosest(this.getPositionsList(mates));
        if(closestMate[0] != -1 && closestMate[1] <= this.dna.mateCareDist)
        {
            this.addSteering(this.seek(mates[closestMate[0]].position,this.mateAttraction));
        }


        this.velocity.add(this.steering).limit(this.maxVelocity);
        this.position.add(this.velocity);
        this.steering.set(0,0);

        this.health-=this.healthDecreaseRate;
        if(this.size > RADIUS)
            this.size-=.01;
        //TODO: as they eat, they get fatter (mass) and if they don't eat, mass goes down

        this.mass = this.size/3;
        this.maxVelocity = 10/this.mass;
    }

    draw()
    {
        let aliveColor = color("#e74c3c");
        let deadColor = color(0,0,0);
        
        fill(
        lerpColor(deadColor,aliveColor,this.health/this.maxHealth));
        noStroke();
        ellipse(this.position.x,this.position.y,this.size);

        if(this.debugMate)
        {
            push();
            if(this.dna.mateAttraction < 0)
            { 
                stroke(255,0,0,30);
            }
            else
            {
                stroke(0,255,0,30);  
            }
            noFill();
            strokeWeight(abs(this.dna.mateAttraction));
            ellipse(this.position.x,this.position.y,this.dna.mateCareDist*2);
            pop();
        }

        if(this.debugGood)
        {
            push();
            if(this.dna.goodAttraction < 0)
            { 
                stroke(255,0,0,30);
            }
            else
            {
                stroke(0,255,0,30);  
            }
            noFill();
            strokeWeight(abs(this.dna.goodAttraction));
            ellipse(this.position.x,this.position.y,this.dna.goodCareDist*2);
            pop();
        }

        if(this.debugBad)
        {
            push();
            if(this.dna.badAttraction < 0)
            { 
                stroke(255,0,0,30);
            }
            else
            {
                stroke(0,255,0,30);  
            }
            noFill();
            strokeWeight(abs(this.dna.badAttraction));
            ellipse(this.position.x,this.position.y,this.dna.badCareDist*2);
            pop();
        }
    }
}