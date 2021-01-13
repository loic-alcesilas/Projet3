//source: https://www.developpez.net/forums/d1970440/javascript/general-javascript/canvas-signature-js-pur-poo/
let empty = true;
class Canvas {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.draw = false;
        this.signaturePoints = 0;
        this.mousePosition = {
            x: 0,
            y: 0
        };
        this.lastPosition = this.mousePosition;
        this.eventListener();
    }

    eventListener() {
        //Souris
        let self = this;
        this.canvas.addEventListener("mousedown", function (e) {
            self.draw = true;
            self.lastPosition = self.getMposition(e);
            empty = true; //pour indiquer que le canvas est sign�
        });


        this.canvas.addEventListener("mousemove", function (e) {
            self.mousePosition = self.getMposition(e);
            self.canvasResult();
            self.signaturePoints++;
        });

        //quand le clic de la souris est relev� on ne "dessine plus"
        this.canvas.addEventListener("mouseup", function (e) {
            self.draw = false;
            var element = document.getElementById('submitbutton');
            if (self.signaturePoints >= 75) {
                if(!element){
                    var parentDiv = document.createElement('input');
                    parentDiv.id = 'submitbutton';
                    parentDiv.value = 'Reserver un velo';
                    parentDiv.type = 'submit';
                    document.getElementById('book').append(parentDiv);
                }
            } else {
                alert("La signature est trop courte")
            }
        });

        //Effacer    
        document.getElementById("clearcanvas").addEventListener("click", function (e) {
            self.clearCanvas()
        });
    } // Fin eventListener()

    //renvoi les coordonn�es de la souris
    getMposition(mouseEvent) {
        if (this.draw) {
            let oRect = document.getElementById("canvas").getBoundingClientRect();
            return {
                x: mouseEvent.clientX - oRect.left,
                y: mouseEvent.clientY - oRect.top
            };
        }
    } //fin getMposition

    // Renvoie les coordonn�es du pad 
    getTposition(touchEvent) {
        var oRect = this.canvas.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - oRect.left,
            y: touchEvent.touches[0].clientY - oRect.top
        };
    }

    // Dessin du canvas
    canvasResult() {
        if (this.draw) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastPosition.x, this.lastPosition.y);
            this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
            this.ctx.stroke();
            this.lastPosition = this.mousePosition;
        }
    } // fin canvasResult()
    // Vide le dessin du canvas
    clearCanvas() {
        this.canvas.width = this.canvas.width;
        this.ctx.lineWidth = 3;
        empty = false;
        this.signaturePoints = 0;
        document.getElementById('submitbutton').remove();
    }

}
new Canvas();
