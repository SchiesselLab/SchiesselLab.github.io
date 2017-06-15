// Author: Marco Tompitak, marcotompitak.github.io
// created for the Schiessel Lab, schiessellab.github.io

function readState(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var str_state = e.target.result;
        state = chunk(str_state.split("\t"),12);
        displayState(state.length);     
        destroyDNA();
        drawDNA();
        //drawBP(0, 0, 0, [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
        if (sequence.length != state.length) {
            for ( i = 0; i < state.length; i++ ) {
                sequence[i] = Math.floor((Math.random() * 4));;
            }
        }
        setDNAColors();
        camera.position.set(-25.796838150163353, 89.94719851925045, -101.71029040679385);
        camera.up = new THREE.Vector3( 0, 0, -1 );
        render();
    };
    reader.readAsText(file);
}

function displayState(contents) {
    var element = document.getElementById('state-content');
    element.innerHTML = contents;
}

document.getElementById('state-input')
.addEventListener('change', readState, false);

function readSequence(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var str_sequence = e.target.result;
        sequence = str_sequence.split("");
        sequence.pop();
        displaySequence(sequence.length);
        setDNAColors();
        render();
    };
    reader.readAsText(file);
}

function displaySequence(contents) {
    var element = document.getElementById('sequence-content');
    element.innerHTML = contents;
}

document.getElementById('sequence-input')
.addEventListener('change', readSequence, false);

function getFileFromServer(url, doneCallback) {
    var xhr;
    
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleStateChange;
    xhr.open("GET", url, false);
    xhr.send();
    
    function handleStateChange() {
        if (xhr.readyState === 4) {
            doneCallback(xhr.status == 200 ? xhr.responseText : null);
        }
    }
}

function loadDefaultFiles(statefilename, seqfilename) {
    getFileFromServer(statefilename, function(str_state) {
        if (str_state === null) {
            // An error occurred
        }
        else {
            state = chunk(str_state.split("\t"),12);
            displayState(state.length);   
            if (sequence.length != state.length) {
              for ( i = 0; i < state.length; i++ ) {
                sequence[i] = Math.floor((Math.random() * 4));;
              }
            }  
        }
    });
    
    getFileFromServer(seqfilename, function(str_sequence) {
        if (str_sequence === null) {
            // An error occurred
        }
        else {
            sequence = str_sequence.split("");
            sequence.pop();
            displaySequence(sequence.length);
            redrawDNA();
        }
    });
}

function loadNBS() {
    getFileFromServer("Input/phosphates.dat", function(str_state) {
        if (str_state === null) {
          console.log('Cannot read phosphates.dat')
        }
        else {
            binding_site_coordinates = chunk(str_state.split("\t"),3);
        }
    });
}
