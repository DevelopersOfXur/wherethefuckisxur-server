const express = require('express');
const request = require('request-promise-native');
const fs = require('fs');

var app = express();

var data;
var manifest;
var manifesturl;

if (!fs.existsSync('config.json')) {
    throw "No config.json, can't run";
}

let config = JSON.parse(fs.readFileSync('config.json'));

if (config.token.expires < (new Date).getTime() / 1000) {
    throw "Refresh token expired, please get a new one!";
}

app.get('/data', (req, res) => {
    res.send(data);
})

bungiefetch().then(() => {

    nextFetch();

    app.listen(80);
});

async function bungiefetch() {
    let refreshurl = 'https://www.bungie.net/platform/app/oauth/token/';
    let refreshopts = {
        form: {
            'grant_type': 'refresh_token',
            'refresh_token': config.token.refresh,
            'client_id': config.api.id,
            'client_secret': config.api.secret
        },
        json: true
    };
    let refresh = await request.post(refreshurl, refreshopts);
    let token = refresh.access_token;
    config.token.refresh = refresh.refresh_token;
    config.token.expires = ((new Date).getTime() / 1000) + 7776000;

    fs.writeFileSync('config.json', JSON.stringify(config));

    let headers = {
        'X-API-Key': config.api.key,
        'Authorization': 'Bearer ' + token
    };

    let manifestsurl = 'https://www.bungie.net/platform/Destiny2/Manifest';
    let manifestsopts = {
        headers: headers,
        json: true
    }
    let manifests = await request.get(manifestsurl, manifestsopts);

    let newmanifesturl = 'https://www.bungie.net' + manifests.Response.jsonWorldContentPaths.en;
    if (newmanifesturl != manifesturl) {
        manifesturl = newmanifesturl;
        let manifestopts = {
            headers: headers,
            json: true
        }
        manifest = await request.get(manifesturl, manifestopts);
    }

    let bungiedata = {
        'spiderinventory': [],
        'bansheeinventory': [],
        'activenightfalls': []
    };

    let vendorparams = {
        'components': '401,402'
    }

    let vendorurl = 'https://www.bungie.net/platform/Destiny2/' + config.charinfo.platform + '/Profile/' + config.charinfo.membershipid + '/Character/' + config.charinfo.charid + '/Vendors';
    let vendoropts = {
        headers: headers,
        qs: vendorparams,
        json: true
    }
    let vendordata = await request.get(vendorurl, vendoropts);
    let vendorsales = vendordata.Response.sales.data;
    let vendorcats = vendordata.Response.categories.data;

    let spidercats = vendorcats['863940356'].categories;
    let spidersales = vendorsales['863940356'].saleItems;

    let itemstoget = spidercats[0]['itemIndexes'];

    for (let keyindex in itemstoget) {
        let key = itemstoget[keyindex];

        let item = spidersales[key];
        let itemhash = item.itemHash;
        if (itemhash != 1812969468) {
            let currency = item.costs[0];
            let itemdef = manifest.DestinyInventoryItemDefinition[itemhash];
            let currencydef = manifest.DestinyInventoryItemDefinition[currency.itemHash];
            let itemname = itemdef.displayProperties.name;
            itemname = itemname.substr(itemname.indexOf(" ") + 1)
            let currencycost = currency.quantity.toString();
            let currencyname = currencydef.displayProperties.name;

            let itemdata = {
                name: itemname,
                cost: currencycost + ' ' + currencyname
            }
            bungiedata.spiderinventory.push(itemdata);    
        }
    }

    if ('2190858386' in vendorsales) {
        bungiedata.xur = {
            'xurweapon': '',
            'xurarmor': []
        }
        let xursales = vendorsales['2190858386'].saleItems;
        for (let key in xursales) {
            let itemhash = xursales[key].itemHash;
            if (itemhash != 4285666432) {
                let itemdef = manifest.DestinyInventoryItemDefinition[itemhash]
                let itemname = itemdef.displayProperties.name;
                if (itemdef.itemType == 2) {
                    let itemsockets = itemdef.sockets.socketEntries;
                    let plugs = [];
                    for (let skey in itemsockets) {
                        let s = itemsockets[skey];
                        if (s.reusablePlugItems.length > 0 && s.plugSources == 2) {
                            plugs.push(s.reusablePlugItems[0].plugItemHash);
                        }
                    }

                    plugs = plugs.splice(2);

                    let perks = [];

                    for (let pkey in plugs) {
                        let p = plugs[pkey];
                        let plugurl = 'https://www.bungie.net/platform/Destiny2/Manifest/DestinyInventoryItemDefinition/' + p + '/';
                        let plugopts = {
                            headers: headers,
                            json: true
                        }
                        let plugdef = manifest.DestinyInventoryItemDefinition[p];
                        let perk = {
                            name: plugdef.displayProperties.name,
                            desc: plugdef.displayProperties.description
                        }
                        perks.push(perk);
                    }

                    let exotic = {
                        name: itemname,
                        perks: perks
                    }

                    if (itemdef.classType == 0) {
                        exotic.class = 'Titan';
                    } else if (itemdef.classType == 1) {
                        exotic.class = 'Hunter';
                    } else if (itemdef.classType == 2) {
                        exotic.class = 'Warlock';
                    }

                    bungiedata.xur.xurarmor.push(exotic);
                } else {
                    bungiedata.xur.xurweapon = itemname;
                }
            }
        }
    }

    let bansheesales = vendorsales['672118013'].saleItems;

    for (let key in bansheesales) {
        let itemhash = bansheesales[key].itemHash;
        if (itemhash != 2731650749) {
            let itemdef = manifest.DestinyInventoryItemDefinition[itemhash]

            let itemname = itemdef.displayProperties.name;
            let itemperkhash = itemdef.perks[0].perkHash;
            let perkdef = manifest.DestinySandboxPerkDefinition[itemperkhash];
            let itemdesc = perkdef.displayProperties.description;

            let mod = {
                name: itemname,
                desc: itemdesc
            }

            bungiedata.bansheeinventory.push(mod);
        }
    }

    let nightfallurl = 'https://www.bungie.net/platform/Destiny2/Milestones';
    let nightfallopts = {
        headers: headers,
        json: true
    }
    let nightfallresp = await request.get(nightfallurl, nightfallopts);
    let nightfallactivities = nightfallresp.Response['2171429505'].activities;

    for (let activitykey in nightfallactivities) {
        let activity = nightfallactivities[activitykey];
        let activitydefurl = 'https://www.bungie.net/platform/Destiny2/Manifest/DestinyActivityDefinition/' + activity['activityHash'] + '/'; 
        let activitydefopts = {
            headers: headers,
            json: true
        }
        let activityresp = await request.get(activitydefurl, activitydefopts);
        if ('modifierHashes' in activity) {
            let nightfallname = activityresp.Response.displayProperties.name;
            nightfallname = nightfallname.substr(nightfallname.indexOf(" ") + 1);
            bungiedata.activenightfalls.push(nightfallname);
        }
    }

    let firstResetTime = 1539709200;
    let currentTime = Math.floor((new Date()).getTime() / 1000);
    let secondsSinceFirst = currentTime - firstResetTime;
    let daysSinceFirst = Math.floor(secondsSinceFirst / 86400);
    let weeksSinceFirst = Math.floor(secondsSinceFirst / 604800);

    let dailies = ['Crucible', 'Heroic Adventure', 'Strikes', 'Gambit'];
    let challenges = ['#1: Ouroborea', '#2: Forfeit Shrine', '#3: Shattered Ruins', '#4: Keep of Honed Edges', '#5: Agonarch Abyss', '#6: Cimmerian Garrison'];
    let epbosses = ['Naksud, the Famine', 'Bok Litur, Hunger of Xol', 'Nur Abath, Crest of Xol', 'Kathok, Roar of Xol', 'Damkath, the Mask'];
    let epguns = ['Every IKELOS gun', 'Every IKELOS gun', 'IKELOS_SG_v1.0.1 (Shotgun)', 'IKELOS_SMG_v1.0.0 (SMG)', 'IKELOS_SR_v1.0.1 (Sniper)'];
    let wellbosses = ['Sikariis and Varkuuriis, Plagues of the Well', 'Cragur, Plague of the Well', 'Inomia, Plague of the Well'];

    bungiedata.dailies = {
        current: dailies[daysSinceFirst % 4],
        next: [dailies[(daysSinceFirst + 1) % 4], dailies[(daysSinceFirst + 2) % 4], dailies[(daysSinceFirst + 3) % 4]]
    }

    bungiedata.dailies.next.push({
        daily: dailies[(daysSinceFirst + 1) % 4]
    })
    bungiedata.dailies.next.push({
        daily: dailies[(daysSinceFirst + 2) % 4]
    })
    bungiedata.dailies.next.push({
        daily: dailies[(daysSinceFirst + 3) % 4]
    })

    bungiedata.ac = {
        text: challenges[weeksSinceFirst % 6],
        id: weeksSinceFirst % 6
    }
    bungiedata.ep = {
        boss: epbosses[weeksSinceFirst % 5],
        gun: epguns[weeksSinceFirst % 5],
        id: weeksSinceFirst % 5
    }
    bungiedata.bw = {
        text: wellbosses[weeksSinceFirst % 3],
        id: weeksSinceFirst % 3
    }

    console.log(bungiedata);

    data = bungiedata;
}

function nextFetch() {
    let currentMs = (new Date()).getTime();
    let msThroughDay = currentMs % 86400000;
    if (msThroughDay > 61200000) {
        setTimeout(() => {
            bungiefetch().then(() => {
                nextFetch();
            })
        }, 86400000 - msThroughDay)
    } else {

        console.log(61200000 - msThroughDay);
        setTimeout(() => {
            bungiefetch().then(() => {
                nextFetch();
            })
        }, 61200000 - msThroughDay)
    }
}