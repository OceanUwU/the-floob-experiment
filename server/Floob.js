const fs = require('fs');
const numPath = './floobNum.json';

const mainMenu = require('./socket/playersOnline.js');

const aspects = require('../src/data/aspects.json');

const clothes = require('../src/data/clothes.json');
const places = require('../src/data/places.json');
const toys = require('../src/data/toys.json');
const food = require('../src/data/food.json');
const voteOrder = [
    {
        name: 'Clothing',
        possibleOptions: clothes,
        options: 4,
        store: 'clothing',
    },
    {
        name: 'Place',
        possibleOptions: places,
        options: 5,
        store: 'place',
    },
    {
        name: 'Toy',
        possibleOptions: toys,
        options: 4,
        store: 'toy',
    },
    {
        name: 'Meal',
        possibleOptions: food,
        options: 4,
        store: 'food',
    },
    {
        name: 'Research?',
        possibleOptions: [0, 1],
        options: 2,
        store: 'investigate',
    },
    {
        name: 'Research',
        store: 'investigation',
    },
];

const chat = require('./socket/chat');
const shuffle = require('./shuffle');

const maxMaxHP = 125;
const minMaxHP = 75;
const maxHPLostPerDay = 5;

const minHappiness = -20;
const maxHappiness = 20;
const investigationCost = 15;

const maxAspectScore = 3;
const minAspectScore = -3
const toDistribute = (0-minAspectScore) * aspects.length;
const opinionToRating = {
    "-3": 0,
    "-2": 0,
    "-1": 1,
    "0": 1,
    "1": 1,
    "2": 2,
    "3": 2,
};
const opinionText = [
    'hates',
    'is okay with',
    'loves'
];

const secondsToVote = 45;
const secondsAfterAllVoted = 3;

if (!fs.existsSync(numPath))
    fs.writeFileSync(numPath, '0');  

module.exports = class Floob {
    constructor() {
        fs.writeFileSync(numPath, String(Number(fs.readFileSync(numPath)) + 1));
        this.started = true;
        this.new = true;
        this.allowVoting = false;
        this.name = `Floob ${fs.readFileSync(numPath)}`;
        this.originalMaxHP = Math.floor(Math.random()*(1 + maxMaxHP - minMaxHP)) + minMaxHP;
        this.maxHP = this.originalMaxHP;
        this.HP = this.maxHP;
        this.happiness = 0;
        this.previousHappiness = this.happiness;
        this.safeHappiness = this.happiness;
        this.day = 0;
        this.aspects = aspects.map(aspect => minAspectScore);

        let distributing = toDistribute;
        while (distributing > 0) {
            let aspect = Math.floor(Math.random() * this.aspects.length);
            if (this.aspects[aspect] < maxAspectScore) {
                this.aspects[aspect]++;
                distributing--;
            }
        }

        this.aspectGuesses = this.aspects.map(aspect => [null]);

        this.voteInfo = voteOrder[0];
        this.options = [];
        this.votes = [];

        this.clothing = null;

        chat(`${this.name} was adopted!`);

        this.beginDay();
    }

    safe(join=false) {
        let info = {
            day: this.day,
            HP: this.HP,
            maxHP: this.maxHP,
            originalMaxHP: this.originalMaxHP,
            happiness: this.safeHappiness,
            clothing: this.clothingIndex,
            voteType: this.voteInfo.name,
            votingAllowed: this.allowVoting,
            options: this.options,
            votes: this.votes.map(option => option.length),
            voteTime: this.voteTime,
        };

        if (join)
            info = {...info,
                name: this.name,
                new: this.new,
                aspectGuesses: this.aspectGuesses,
                messages: fs.readFileSync('./log.txt', 'utf8'),
                maxVoteTime: secondsToVote,
            };

        return info;
    }

    endDay() {
        global.io.emit('food', -1);
        this.beginDay();
    }

    beginDay() {
        this.previousHappiness = this.happiness;
        for (let i of ['clothing', 'place', 'toy', 'food']) {
            this[i] = null;
            this[`${i}Index`] = null;
        }
        this.vote = -1;
        chat(`===<<< Day ${++this.day} >>>===`);
        global.io.emit('newDay', this.day);

        setTimeout(this.startVote.bind(this), 3500);
    }

    emitUpdate() {
        global.io.emit('floobUpdate', this.safe(false));
    }

    startVote() {
        if (++this.vote < voteOrder.length)
            this.voteInfo = voteOrder[this.vote];
        else
            return this.endDay();

        if (this.voteInfo.name == 'Research?' && this.happiness - investigationCost < minHappiness)
            return this.endDay();
        
        if (this.voteInfo.name == 'Research')
            this.options = [
                ['Clothing', this.clothingIndex],
                ['Place', this.placeIndex],
                ['Toy', this.toyIndex],
                ['Meal', this.foodIndex],
            ];
        else
            this.options = shuffle(Object.keys(this.voteInfo.possibleOptions)).slice(0, this.voteInfo.options);
        this.votes = this.options.map(option => []);

        this.emitUpdate();
        global.io.emit('newVote');
        this.allowVoting = true;

        this.voteTime = secondsToVote + 1;
        this.tickVoteTimer();
    }

    tickVoteTimer() {
        if (--this.voteTime <= 0) {
            this.endVote();
        } else {
            let numberOfVotes = this.votes.reduce((a,b)=>a+b.length, 0);
            if (numberOfVotes > 0 && numberOfVotes == Object.keys(io.sockets.clients().connected).length)
                this.voteTime = Math.min(this.voteTime, secondsAfterAllVoted);
            this.emitUpdate();
            setTimeout(this.tickVoteTimer.bind(this), 1000);
        }
    }

    endVote() {
        this.allowVoting = false;

        let votes = Object.keys(this.options).map(option => [this.options[option], this.votes[option].length]);
        votes.sort((a,b)=>(b[1]-a[1]));
        votes = votes.filter(option => option[1] == votes[0][1]);

        let selectedIndex = votes[Math.floor(Math.random()*votes.length)][0];
        let selected;
        if (this.voteInfo.name == 'Research')
            selected = voteOrder.find(info => info.name == selectedIndex[0]).possibleOptions[selectedIndex[1]];
        else
            selected = this.voteInfo.possibleOptions[selectedIndex];

        this[`${this.voteInfo.store}Index`] = selectedIndex;
        this[this.voteInfo.store] = selected;

        if (this.voteInfo.name == 'Research?') {
            if (this.investigate == 0) {
                chat(`You voted not to research ${floob.name}.`);
                return this.endDay();
            } else {
                this.happiness -= investigationCost;
                this.safeHappiness = this.happiness;
                chat(`Commencing research on ${floob.name}...`);
            }
        } else if (this.voteInfo.name == 'Research') {
            for (let i of selected.aspects)
                chat(`Floob ${opinionText[opinionToRating[String(this.aspects[i])]]} #${i} .`);
        } else {
            if (this.voteInfo.name == 'Place') {
                global.io.emit('place', selectedIndex);
            } else if (this.voteInfo.name == 'Toy') {
                global.io.emit('place', -1);
                global.io.emit('toy', selectedIndex);
            } else if (this.voteInfo.name == 'Meal') {
                global.io.emit('toy', -1);
                global.io.emit('food', selectedIndex);
            }

            let totalChange = 0;
            for (let i of selected.aspects) {
                if (this.voteInfo.name != 'Clothing') {
                    let effect = this.clothing.effects.find(e => e.aspect == i);
                    if (effect != undefined) {
                        switch (effect.direction) {
                            case -1: this.happiness += maxAspectScore; break;
                            case 0: this.happiness += 0; break;
                            case 1: this.happiness += minAspectScore; break;
                        }
                        break;
                    }
                }
                totalChange += this.aspects[i];
            }
            this.happiness += totalChange;
            if (totalChange >= 0) {
                chat(selected.msg[0]);
            } else {
                chat(selected.msg[1]);
            }
        }
        
        if (this.vote == voteOrder.length - 2 - 1) {
            let aspectsDisplayed = '';
            let total = this.happiness - this.previousHappiness;
            for (let i of ['clothing', 'place', 'toy', 'food']) {
                for (let j of this[i].aspects) {
                    if (i != 'clothing') {
                        let effect = this.clothing.effects.find(e => e.aspect == j);
                        if (effect != undefined) {
                            switch (effect.direction) {
                                case -1: total -= maxAspectScore; break;
                                case 0: total -= 0; break;
                                case 1: total -= minAspectScore; break;
                            }
                            break;
                        }
                    }
                    aspectsDisplayed += `${aspectsDisplayed.length == 0 ? '' : ' + '}#${j}`;
                }
            }
            //chat(`Floob's happiness today went from ${this.previousHappiness} to ${this.happiness}, it changed by ${String(this.happiness - this.previousHappiness).includes('-') ? '' : '+'}${this.happiness - this.previousHappiness}. So, excluding affected aspects, ${aspectsDisplayed} = ${total}`);
            if (this.happiness - this.previousHappiness < 0) {
                chat("Floob hated today. Their happiness went down.");
            } else if (this.happiness - this.previousHappiness == 0) {
                chat("Floob thinks you made some strange decisions, but overall, today was bearable for them. Their happiness didn't change.");
            } else {
                chat("Floob enjoyed today. Their happiness went up.");
            }

            this.happiness = Math.min(Math.max(this.happiness, minHappiness), maxHappiness)
            this.safeHappiness = this.happiness;
            this.HP -= maxHPLostPerDay;
            this.maxHP -= maxHPLostPerDay;
            this.HP += this.happiness;
            this.HP = Math.min(this.HP, this.maxHP);
            this.emitUpdate();

            //chat(`Floob ${this.happiness < 0 ? 'lost' : 'gained'} ${Math.abs(this.happiness)}HP due to its happiness of ${this.happiness}.`);
            if (this.happiness < 0) {
                chat("Floob lost HP because they aren't feeling so well.");
            } else if (this.happiness == 0) {
                chat("Floob is feeling okay today. Their HP didn't change.");
            } else {
                chat("Floob is loving life! They gained some HP.");
            }

            if (this.HP <= 0)
                return this.die();
        }

        this.emitUpdate();//temporary

        setTimeout(this.startVote.bind(this), 5000);
    }

    die() {
        chat(`${this.name} died. You managed to keep them alive for ${this.day} days!`);
        global.io.emit('die', {
            ...this.safe(true),
            opinions: this.aspects,
        });
        this.started = false;
        setTimeout(mainMenu, 5000);
    }
}