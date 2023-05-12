var n=1; //Variable que da el número filas de corriente
var m=1; //Variable que da el número columnas de corriente
var c = []; //Variable para el valor de las corrientes
var slider = []; //Variable para las barras deslizantes
var checkbox = []; //Variable  para los botones
var posx = []; //Variable que da la coordenada x de posición de las corrientes
var posy = []; //Variable que da la coordenada y de la posición de las corrientes

//Bucle para generar los array necesarios
for(var i = 0; i < n; i++){
  slider[i]=[];
  c[i]=[];
}

//Función para establecer los parámetros iniciales
function setup(){
  //Se crea el lienzo
  var myCanvas = createCanvas(1000, 500);
  myCanvas.position((windowWidth-width)/2, 50);

  //Bucle para limitar el número máximo de corrientes
  if(n>8){
    var txt = createDiv("Demasiadas corrientes por fila");
    txt.position(windowWidth/2-150, windowHeight/2-100);
  }

  else{
    //Se generan las barras deslizantes
    for(var j = 0; j < m; j++){
      for(var i = 0; i < n; i++){
        var l = i + 1;
        var k = j + 1;
        var txt = createDiv("Valor de la corriente "+k+l);
        if (n==1){
          txt.position(windowWidth/2-100, 80+height+50*j);
          slider[i][j]= createSlider(-4, 4, 0, 1);
          slider[i][j].position(windowWidth/2-100, 100+height+50*j);
       }
        else if(n<7){
          txt.position((windowWidth-width)/2+i*(width-150)/(n-1), 80+height+50*j);
         slider[i][j]= createSlider(-4, 4, 0, 1);
         slider[i][j].position((windowWidth-width)/2+i*(width-150)/(n-1), 100+height+50*j);
        }
       else if(n!=1 && n==7){
          txt.position((windowWidth-width)/2+i*(width)/(n-1)-75, 80+height+50*j);
         slider[i][j]= createSlider(-4, 4, 0, 1);
         slider[i][j].position((windowWidth-width)/2+i*(width)/(n-1)-75, 100+height+50*j);
        }
        else if(n!=1 && n==8){
         txt.position((windowWidth-width)/2+i*(width)/(n-2)-150, 80+height+50*j);
         slider[i][j]= createSlider(-4, 4, 0, 1);
          slider[i][j].position((windowWidth-width)/2+i*(width)/(n-2)-150 , 100+height+50*j);
        }
      }
    }
    //Se generan los botones
    checkbox[0]=createCheckbox('flechas', false)
    checkbox[0].position((windowWidth-width)/2, 20);
    checkbox[1]=createCheckbox('líneas de campo', false)
    checkbox[1].position((windowWidth-width)/2+width-200, 20);
  }

  //Se asigna la posición a las corrientes
  Position();
}

//Función para dibujo interactivo
function draw(){
  //Se generan los marcos del lienzo
  background(255);
  noFill();
  strokeWeight(1);
  rect(0, 0, width, height);

  //Se asignan los valores de las corrientes
  for(var i = 0; i < n; i++){
    for(var j = 0; j < m; j++){
      c[i][j] =slider[i][j].value();
    }
  }

  //Se pinta las flechas del campo magnético
  if(checkbox[0].checked()){MagneticField()};

  //Se pintan las líneas de campo
  if(checkbox[1].checked()){Lineas()};

  //Se pintan las corrientes perpendiculares a la pantalla
  Current();
}

//Función para que cuando el ratón esté pulsado se ejecute el código
function mousePressed() {
  loop();
}

//Función para que cuando el ratón no esté pulsado el código no se ejecute
function mouseReleased() {
noLoop();
}

//Función para dar la posición de las corrientes
function Position(){
  for(var j=0; j<m; j++){
    for(var i=0; i<n; i++){
    posx[i] = (i+1)*width/(n+1);
    posy[j] = (j+1)*height/(m+1)+5*i;
    }
  }
}

//Función para dibujar las corrientes
function Current(){
  strokeWeight(3);
  for(var i=0; i<n; i++){
    for(var j=0; j<m; j++){
      if (c[i][j]!=0) {
        fill(255);
        ellipse(posx[i], posy[j], 30, 30);
        fill(0)
        if(c[i][j]>0){
          text("+" + c[i][j], posx[i]-5, posy[j]+5);
        }
        else{
          text(c[i][j], posx[i]-5, posy[j]+5);
        }
      }
    }
  }
}

//Función para generar la forma de la flecha
function Flecha(xPosition, yPosition, angle, long, color){
  var wide = long/10;
  strokeWeight(0);
  push();
  translate(xPosition,yPosition);
  rotate(angle);
  fill(color);
  rectMode(CORNER);
  rect (-long/2, -wide/2, long, wide);
  triangle(long/2, 2*wide, long/2+long/5, 0, long/2, -2*wide);
  pop();
}

//Función para dibujar las flechas del campo magnético
function MagneticField(){
  var current; //Variable para la posición de las corrientes respecto del centro
  var punto; //Variable para la posición del punto  respecto del centro
  var r; //Variable para dar posición respecto de las corrientes
  var ang; //Variable para el ángulo de u_r
  var d; //Varible para la distancia del punto a las corrientes
  var b = []; //Variable para el campo magnético
  var phi; //Variable para el ángulo del campo eléctrico

  push();
  translate(width/2, height/2);

  //Bucle para recorrer la pantalla de forma discreta
  for(var i=-width/2+20; i<=width/2-20; i += 20){
    for(var j=-height/2+20; j<= height/2-20; j +=20){
      b[1] = 0;
      b[2] = 0;

      //Bucle para recorrer todas las corrientes no  nulas
      for(var k=0; k<n; k++){
        for(var l=0; l<m; l++){
          if (c[k][l]!=0){
            //Se da la posición de las corrientes respecto del centro
            current = createVector(posx[k]-width/2, posy[l]-height/2);

            //Se da la posición de un punto genérico del lienzo respecto al origen
            punto = createVector(i, j);

            //Se da la posición de un punto genérico respecto de las corrientes
            r = p5.Vector.sub(punto, current);

            //Se halla el ángulo del punto genérico respecto de las corrientes
            ang = r.heading();

            //Se calculan las distancias de cada punto a las corrientes
            d = punto.dist(current);

            //Se calcula el campo magnético en el eje X
            b[1] += c[k][l]/d*sin(ang);

            //Se calcula el campo magnético en el eje Y
            b[2] -= c[k][l]/d*cos(ang);
          }
        }
      }

      //Se calcula la dirección del campo magnético
      phi = atan2(b[2],b[1]);

      //Se dibujan las flechas que indican la dirección y magnitud del campo magnético
      Flecha(i, j, phi, 50*pow(sq(b[2])+sq(b[1]),(1/5)), 0);
    }
  }
  pop();
}


//Función para calcular el ángulo del campo magnético en el punto (x,y)
function MagneticFieldAng(x, y){
  var theta = []; //Variable para los ángulos
  var d = []; //Varible para las distancias
  var b = []; //Variable para el campo magnético
  var pc = [];
  var r = [];
  var i = x-width/2;
  var j = y-height/2;

  for(var k=0; k<n; k++){
    pc[k]=[];
    r[k]=[];
    theta[k]=[];
    d[k]=[];
  }

  push();
  translate(width/2, height/2);
  b[1] = 0;
  b[2] = 0;

  for(var k=0; k<n; k++){
    for(var l=0; l<m; l++){
      if(c[k][l]!=0){

        //Se da la posición de las corrientes respecto del centro
        pc[k][l] = createVector(posx[k]-width/2, posy[l]-height/2);

        //Se da la posición de un punto genérico del lienzo respecto al origen
        var p = createVector(i, j);

        //Se da la posición de un punto genérico respecto de las corrientes
        r[k][l]= p5.Vector.sub(p, pc[k][l]);

        //Se halla el ángulo del punto genérico respecto de las corrientes
        theta[k][l] = r[k][l].heading();

        //Se calculan las distancias de cada punto a las corrientes
        d[k][l] = dist(i, j, posx[k]-width/2, posy[l]-height/2);

        //Se calcula el campo magnético en el eje X
        b[1] = b[1]-c[k][l]/(sq(d[k][l]))*sin(theta[k][l]);

        //Se calcula el campo magnético en el eje Y
        b[2] = b[2]+c[k][l]/(sq(d[k][l]))*cos(theta[k][l]);
      }
    }
  }

  //Se calcula la dirección del campo magnético
  phi = atan2(b[2],b[1]);

  pop();

  //Se devuelve el ángulo del campo en la posición requerida
  return phi;
}

//Función para dibujar las líneas de campo
function Lineas(){
  var x;
  var y;

  //Bucle para recorrer todas las corrientes
  for(var i=0; i<n; i += 1){
    for(var j=0; j<m; j += 1){
      //Bucle para dibujar las lineas de campo de cada corriente
      for(var k=0; k<6*(abs(c[i][j])); k++){
        x = posx[i];
        y = posy[j] + 20 * k;
        var h=2;
        var a=0;

        //Bucle para dibujar las lineas de campo
        for(var a=0; a<1000; a++){
          x0 = x;
          y0 = y;
          if (c[i][j]>0){
            x = x + h * cos(MagneticFieldAng(x,y));
            y = y + h * sin(MagneticFieldAng(x,y));
          }
          else {
            x = x - h * cos(MagneticFieldAng(x,y));
            y = y - h * sin(MagneticFieldAng(x,y));
          }
          strokeWeight(1);
          line(x0, y0, x, y);

          //Bucle para cortar las líneas de campo
            var v = createVector(x-posx[i], y-posy[j]);
            var ang = v.heading();
          if(a > 20 && abs(ang - 1.6) < 0.05){
            break;
          }
        }
      }
    }
  }
}