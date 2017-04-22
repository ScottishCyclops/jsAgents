class Graph
{
    constructor(delta)
    {
        this.data = [];
        this.w = 10;
        this.speed = this.w/delta;
        this.offset = width+this.w;
        this.maxHeight = -1;
        this.height = height/2;
    }

    update()
    {
        this.offset-=this.speed;
    }

    draw()
    {
        push();
        let graphMidY = height-(this.height/2);
        let amplitude = -30;

        stroke(255,255,255, 100);
        //attraction data 0 line
        line(0,graphMidY,width,graphMidY);

        //population 0 line
        line(0,height-INFOS_HEIGHT-10,width,height-INFOS_HEIGHT-10);

        translate(this.offset,0);
        strokeWeight(3);
        for(let i = 0; i < this.data.length-1; i++)
        {
            //max fit
            if(this.data[i][1] > this.maxHeight)
            {
                this.maxHeight = this.data[i][1];
            }
            let heightRatio = (this.height/this.maxHeight);
            stroke("#2980b9");
            line(i*this.w, height-(this.data[i][1])*heightRatio, (i+1)*this.w, height-(this.data[i+1][1])*heightRatio);

            //num agents
            stroke("#ecf0f1");
            line(i*this.w, height-INFOS_HEIGHT-10-(this.data[i][2]), (i+1)*this.w, height-INFOS_HEIGHT-10-(this.data[i+1][2]));
        
            //bagoodd attraction
            stroke("#f1c40f");
            line(i*this.w, this.data[i][0].goodAttraction*amplitude+graphMidY, (i+1)*this.w, this.data[i+1][0].goodAttraction*amplitude+graphMidY);

            //bad attraction
            stroke("#16a085");
            line(i*this.w, this.data[i][0].badAttraction*amplitude+graphMidY, (i+1)*this.w, this.data[i+1][0].badAttraction*amplitude+graphMidY);

            //mate attraction
            stroke("#e74c3c");
            line(i*this.w, this.data[i][0].mateAttraction*amplitude+graphMidY, (i+1)*this.w, this.data[i+1][0].mateAttraction*amplitude+graphMidY);
        }


        pop();
    }
}