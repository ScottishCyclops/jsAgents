let muteAttrAmount = 0.3;
let muteCareAmount = 80;

let attractionGap = 4;
let careGap = 1000;

class Dna
{
    constructor(userDefined = false)
    {
        this.generation = 0;
        if(!userDefined)
        {
            this.goodAttraction = random(-attractionGap,attractionGap);
            this.badAttraction =  random(-attractionGap,attractionGap);
            this.mateAttraction = random(-attractionGap,attractionGap);

            this.goodCareDist = random(0,careGap);
            this.badCareDist = random(0,careGap);
            this.mateCareDist = random(0,careGap);
        }
        else
        {
            this.goodAttraction = 4;
            this.badAttraction =  -4;
            this.mateAttraction = -2;

            this.goodCareDist = 1000;
            this.badCareDist = 30;
            this.mateCareDist = 70;
        }
    }

    mute()
    {
        this.goodAttraction+= random(-muteAttrAmount,muteAttrAmount);
        this.badAttraction+=  random(-muteAttrAmount,muteAttrAmount);
        this.mateAttraction+= random(-muteAttrAmount,muteAttrAmount);

        this.goodCareDist+=   random(-muteCareAmount,muteCareAmount);
        this.badCareDist+=    random(-muteCareAmount,muteCareAmount);
        this.mateCareDist+=   random(-muteCareAmount,muteCareAmount);

        //correction
        if(this.goodCareDis < 0)
            this.goodCareDis = 0;
        if(this.badCareDist < 0)
            this.badCareDist = 0;
        if(this.mateCareDist < 0)
            this.mateCareDist = 0;
    }

    copy(mutate = true)
    {
        let dna = new Dna();

        dna.generation = this.generation++;
        dna.goodAttraction = this.goodAttraction;
        dna.badAttraction = this.badAttraction;
        dna.mateAttraction = this.mateAttraction;

        dna.goodCareDist = this.goodCareDist;
        dna.badCareDist = this.badCareDist;
        dna.mateCareDist = this.mateCareDist;

        if(mutate)
            dna.mute();
        return dna;
    }
}