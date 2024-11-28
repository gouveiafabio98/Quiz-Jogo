let menus = {
    quit: {
        title: "Queres mesmo sair?",
        content: "",
        buttons: [
            {
                text: "Sim",
                function: quitGame
            }, {
                text: "Não",
                function: keepPlaying
            }
        ]
    }
}

function quitGame() {
    console.log("#HEDJAS");
}

function keepPlaying() {
    console.log("#HEDJAS");
}