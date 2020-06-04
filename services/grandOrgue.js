const easymidi = require('easymidi');

class GrandOrgue {
    constructor(app, config, output) {
        this.midi = new easymidi.Output(output);
        this.config = require(`./organ/${config}.json`);
        this.channel = 0;
        this.reset();
    }

    reset() {
        let pistons = Array.from({length: this.config.pistons}, (_, n) => n);
        for(let piston of pistons) {
            this.midi.send('noteon', {
                note: this.config.start + piston,
                velocity: 0,
                channel: this.channel
            });
        }
    }

    switchPiston(req) {
        console.log(req);
        this.midi.send('noteon', {
            note: req.body.key,
            velocity: req.body.on ? 100 : 0,
            channel: this.channel
        });

        return 'Piston set';
    }

    switchPistons(req) {
        for(let piston of req.body.pistons) {
            this.midi.send('noteon', {
                note: piston.key,
                velocity: piston.on ? 100 : 0,
                channel: this.channel
            });
        }
        return 'Pistons set';
    }
}

exports.GrandOrgue =  GrandOrgue;