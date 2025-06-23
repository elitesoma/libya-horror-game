const scenes = {
    start: {
        text: "You arrive in Libya, seeking an ancient artifact in the desert. The wind howls, and you feel an eerie presence watching you...",
        image: "images/desert.jpg",
        choices: [
            { text: "Investigate the strange feeling", next: "investigate" },
            { text: "Ignore it and press forward", next: "forward" }
        ]
    },
    investigate: {
        text: "You look around, heart pounding. Shadows flicker in the dunes. Suddenly, a jinn materializes before you!",
        image: "images/jinn.jpg",
        choices: [
            { text: "Fight the jinn", next: "fight" },
            { text: "Run away", next: "run" }
        ]
    },
    forward: {
        text: "You ignore the feeling and continue. The desert grows darker, and whispers surround you. Something is following you...",
        image: "images/darkdesert.jpg",
        choices: [
            { text: "Turn back to confront it", next: "investigate" },
            { text: "Keep moving", next: "ruins" }
        ]
    },
    fight: {
        text: "You swing at the jinn with all your might. It shrieks and vanishes, but you feel weaker. The artifact is still out there...",
        image: "images/fight.jpg",
        choices: [
            { text: "Continue your journey", next: "ruins" }
        ]
    },
    run: {
        text: "You sprint across the dunes, but the jinn's laughter echoes behind you. You stumble into ancient ruins.",
        image: "images/ruins.jpg",
        choices: [
            { text: "Explore the ruins", next: "ruins" },
            { text: "Hide and wait", next: "hide" }
        ]
    },
    ruins: {
        text: "The ruins are ancient, filled with strange symbols. A jinn appears, more powerful than before. What do you do?",
        image: "images/strongjinn.jpg",
        choices: [
            { text: "Fight the jinn", next: "finalfight" },
            { text: "Search for the artifact", next: "artifact" }
        ]
    },
    hide: {
        text: "You hide in the shadows, but the jinn finds you. Its eyes glow red. Game over.",
        image: "images/gameover.jpg",
        choices: []
    },
    finalfight: {
        text: "You battle the jinn fiercely. With a final blow, it dissipates. You find the artifact, but at what cost? You win... for now.",
        image: "images/victory.jpg",
        choices: []
    },
    artifact: {
        text: "You find the artifact glowing faintly. As you touch it, the jinn reappears, enraged. Game over.",
        image: "images/gameover.jpg",
        choices: []
    }
};

let currentScene = 'start';

function displayScene() {
    const scene = scenes[currentScene];
    document.getElementById('scene-text').innerText = scene.text;
    document.getElementById('scene-image').src = scene.image;
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice.text;
        button.onclick = () => {
            currentScene = choice.next;
            displayScene();
        };
        choicesDiv.appendChild(button);
    });
    if (scene.choices.length === 0) {
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Restart';
        restartButton.onclick = () => {
            currentScene = 'start';
            displayScene();
        };
        choicesDiv.appendChild(restartButton);
    }
}

displayScene();
