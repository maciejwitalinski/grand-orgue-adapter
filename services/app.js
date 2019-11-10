const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const prompt = require('prompt');

const GrandOrgue = require('./grandOrgue').GrandOrgue;

app.use(cors() );
app.use(bodyParser.json());

const easymidi = require('easymidi');
const outputs = easymidi.getOutputs();

const GOoutputs = outputs.reduce((prev, str, i) => {
    if(str.search('GrandOrgue') > -1) {
        prev.push(str);
    }
    return prev;
}, []);

const prompt_attributes = {
    properties: {
        'config name':  {
            message: 'config file (skrzatusz is a default)'
        },
        "midi device": {
            message: `Select Midi device [number]: \n ${GOoutputs.map((name, i) => {
                return `${i + 1}. ${name} \n`;
            }) }`
        }
    }
};

prompt.start();

prompt.get(prompt_attributes, function (err, result) {
    if (err) {
        console.log(err);
        return 1;
    } else {
        let configName = result['config name'];
        if(!configName) configName = 'skrzatusz';

        let output = '';
        if(GOoutputs[result['midi device'] - 1]) {
            output = GOoutputs[result['midi device'] - 1];
        } else {
            output = GOoutputs[0];
        }

        console.info('Using', `${configName} Sample set, MIDI: `, output);
        init(configName, output);
    }
});


const init = (config, output) => {
    const grandOrgue = new GrandOrgue(app, config, output);

    app.patch('/api/reset', (req, res) => {
        return res.json({status: 'ok', data: grandOrgue.reset(req, res) });
    });
    
    app.patch('/api/piston', (req, res) => res.json({
        status: 'ok',
        data: grandOrgue.switch(req)
    }));

    app.patch('/api/pistons', (req, res) => res.json({
        status: 'ok',
        data: grandOrgue.switchAll(req)
    }));

    app.listen(port, () => console.log(`GOadapter is listening on port ${port}!`));
}