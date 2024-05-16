const infoCard = document.getElementById('infoCard');
infoCard.style.visibility = 'hidden';
let myGlobe;
let isPlaying = true;

fetch('https://raw.githubusercontent.com/Utku-Mese/AtlasRota/main/data/newData.json')
    .then(response => response.json())
    .then(jsonData => {
        const attacksData = jsonData.attacks.map(attack => ({
            attackType: attack.attackType,
            lineColor: attack.severity === 'Critical' ? '#7C0000' : attack.severity === 'High' ? '#FF0000' : attack.severity === 'Medium' ? '#FFA500' : '#00FF00',
            startPoint: { lat: attack.startPoint[0], lng: attack.startPoint[1] },
            endPoint: { lat: attack.endPoint[0], lng: attack.endPoint[1] },
            time: new Date(attack.time).toLocaleString('en-US', { timeZone: 'UTC' }),
            status: attack.status,
            severity: attack.severity,
            description: attack.description,
            target: attack.target,
            attackers: attack.attackers,
            attackDuration: attack.attackDuration,
            attackVolume: attack.attackVolume,
            attackMethod: attack.attackMethod,
            data: attack,
        }));

        myGlobe = Globe()
            (document.getElementById('globeViz'))
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .pointOfView({ lat: 39.9334, lng: 32.8597, altitude: 2 })
            .arcLabel(d => `${d.attackType} - ${d.status} - ${d.severity}`)
            .arcStartLat(d => +d.startPoint.lat)
            .arcStartLng(d => +d.startPoint.lng)
            .arcEndLat(d => +d.endPoint.lat)
            .arcEndLng(d => +d.endPoint.lng)
            .arcDashGap(1)
            .arcDashInitialGap(() => Math.random())
            .arcDashAnimateTime(6000)
            .arcColor(d => d.lineColor)
            .arcsTransitionDuration(0)
            .pointColor(() => 'orange')
            .pointAltitude(0)
            .pointRadius(0.02)
            .pointsMerge(true);

        myGlobe.arcsData(attacksData);

        myGlobe.controls().autoRotate = true;
        myGlobe.controls().autoRotateSpeed = 0.6;

        myGlobe.onArcClick(arc => {
            const arcData = arc.data;

            const road = document.getElementById('road');
            road.textContent = arcData.attackers + " → " + arcData.target;

            const attackerName = document.getElementById('attacker');
            attackerName.textContent = "Attacker: " + arcData.attackers;

            const targetDescription = document.getElementById('target');
            targetDescription.textContent = "Target: " + arcData.target;

            const attackDescription = document.getElementById('attackDescription');
            attackDescription.textContent = arcData.description;

            const attackType = document.getElementById('attackType');
            attackType.textContent = "Attack Type: " + arcData.attackType;

            const attackTime = document.getElementById('attackTime');
            attackTime.textContent = "Date: " + new Date(arcData.time).toLocaleString('en-US', { timeZone: 'UTC' });

            const attackStatus = document.getElementById('attackStatus');
            attackStatus.textContent = "Status: " + arcData.status;

            const attackSeverity = document.getElementById('attackSeverity');
            attackSeverity.textContent = "Severity: " + arcData.severity;

            const attackDuration = document.getElementById('attackDuration');
            attackDuration.textContent = "Duration: " + arcData.attackDuration;

            const attackVolume = document.getElementById('attackVolume');
            attackVolume.textContent = "Volume: " + arcData.attackVolume;

            const attackMethod = document.getElementById('attackMethod');
            attackMethod.textContent = "Method: " + arcData.attackMethod;

            infoCard.style.visibility = 'visible';
        });
    })
    .catch(error => {
        console.error('Veri çekme hatası:', error);
    });

var daySwitch = document.getElementById('daySwitch');

daySwitch.addEventListener('change', function () {
    if (daySwitch.checked) {
        window.location.href = 'night.html';
    } else {
        window.location.href = 'day.html';
    }
});

function openNav() {
    document.getElementById("mySidenav").style.width = "275px";
    document.getElementById("drawerSpan").style.display = "none";
    document.getElementById("pauseButton").style.visibility = "hidden";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("drawerSpan").style.display = "block";
    document.getElementById("pauseButton").style.visibility = "visible";
}

function pause() {
    if (myGlobe) {
        if (isPlaying) {
            myGlobe.controls().autoRotate = false;
            myGlobe.arcDashAnimateTime(0);
            isPlaying = false;
        } else {
            myGlobe.controls().autoRotate = true;S
            myGlobe.arcDashAnimateTime(6000);
            isPlaying = true;
        }
    }
}
