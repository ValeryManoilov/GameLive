class Cell{
    constructor(id, active, activeNeis) {
        this.id = id
        this.active = active
        this.activeNeis = activeNeis
    }

    ChangeActive() {
        this.active = !(this.active)
    }

    SetActiveNeis(ActiveNeis) {
        this.activeNeis = ActiveNeis
    }
}

class GameLive{
    Game() {
        let CellsListMatrice = []
        let Field = document.getElementsByClassName("content__container")[0]
        function FillMatriceList() {
            for (let column = 1; column <= 36; column++){
                let rowMatriceElement = []
                for (let row = 1; row <= 64; row++){
                    let id
                    if (row < 10) {
                        id = `${column}0${row}`
                    }
                    else {
                        id = `${column}${row}`
                    }
                    let cell = new Cell(id, false, 0)
                    rowMatriceElement.push(cell)

                    let newCell = document.createElement("div")
                    newCell.setAttribute("id", id)
                    newCell.classList.add("block")
                    Field.appendChild(newCell)
                }
                CellsListMatrice.push(rowMatriceElement)
            }
        }
        FillMatriceList()

        function GetCellByClickedElement(target) {
            let id = target.getAttribute("id")
            let row = Number(id.slice(-2))
            let column = Number(id.slice(0, String(id).length-2))
            return CellsListMatrice[column-1][row-1]
        }

        function GetElementByCell(cell) {
            let id = cell.id
            let elements = Field.childNodes
            for (let element in elements) {
                if (elements[element].id == id) {
                    return elements[element]
                }
            }
        }

        function ChangeCell(cell) {
            cell.ChangeActive()
            let element = GetElementByCell(cell)
            if (cell.active) {
                element.style.backgroundColor = "black"
            }
            else {
                element.style.backgroundColor = "white"
            }
        }

        function GetCellLoc(cell) {
            return [Number(cell.id.slice(0, String(cell.id).length-2)), Number(cell.id.slice(-2))]
        }
        function GetCellByLocation(loc) {
            let column = loc[0]
            let row = loc[1]
            if (column > 0 && column <= 36 && row > 0 && row <= 64) {
                return CellsListMatrice[column-1][row-1]
            }
            return null
        }

        function GetAllActivesNeis(cell) {
            let location = GetCellLoc(cell)
            let neis = [
                GetCellByLocation([Number(location[0]-1), Number(location[1]-1)]),
                GetCellByLocation([Number(location[0]-1), Number(location[1])]),
                GetCellByLocation([Number(location[0]-1), Number(location[1]+1)]),
                GetCellByLocation([Number(location[0]), Number(location[1]-1)]),
                GetCellByLocation([Number(location[0]), Number(location[1]+1)]),
                GetCellByLocation([Number(location[0]+1), Number(location[1]-1)]),
                GetCellByLocation([Number(location[0]+1), Number(location[1])]),
                GetCellByLocation([Number(location[0]+1), Number(location[1]+1)])
            ]
            return neis
        }

        function ResetActiveNeis(cell) {
            let counter = 0
            let neis = GetAllActivesNeis(cell)
            for (let cell in neis) {
                if (neis[cell] != null && neis[cell].active) {
                    counter++
                }
            }
            cell.SetActiveNeis(counter)
        }

        document.addEventListener("click", event => {
            var clickedElement = event.target
            if (clickedElement.classList[0] == "block") {
                let cell = GetCellByClickedElement(clickedElement)
                ChangeCell(cell)
            }
        })

        function Update() {
            for (let column = 0; column <= 35; column++){
                for (let row = 0; row <= 63; row++){
                    ResetActiveNeis(CellsListMatrice[column][row])
                }
            }
            for (let column = 0; column <= 35; column++){
                for (let row = 0; row <= 63; row++){
                    if ((CellsListMatrice[column][row].activeNeis == 3 && !CellsListMatrice[column][row].active)
                        ||
                        (CellsListMatrice[column][row].activeNeis < 2 || CellsListMatrice[column][row].activeNeis > 3) && CellsListMatrice[column][row].active)
                    {
                        ChangeCell(CellsListMatrice[column][row])
                        console.log(CellsListMatrice[column][row])
                        console.log(GetAllActivesNeis(CellsListMatrice[column][row]))
                    }
                }
            }
        }

        let timer

        function runGame() {
            timer = setInterval(Update, 500)
        }
        function stopGame() {
            clearInterval(timer)
        }

        let startButton = document.getElementsByClassName("start")[0]
        let stopButton = document.getElementsByClassName("stop")[0]

        startButton.addEventListener("click", runGame)
        stopButton.addEventListener("click", stopGame)
    }
}

let newGame = new GameLive()

newGame.Game()