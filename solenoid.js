var long; //Variable para dar la longitud del solenoide
var rad; //Variable para dar el radio del solenoide
var num; //Variable para dar el número de vueltas
var c = []; //Variable para el valor del solenoide
var slider = []; //Variable para las barras deslizantes
var checkbox = []; //Variable para los botones
var posx = []; //Variable que da la coordenada x de posición de las corrientes
var posy = []; //Variable que da la coordenada y de la posición de las corrientes

//Bucle para generar los array necesarios
for(var i=0; i<num; i++){
  c[i]=[];
}

//Función para establecer los parámetros iniciales
function setup(){
  //Se crea el lienzo
  var myCanvas = createCanvas(1000, 500);
  myCanvas.position((windowWidth-width)/2, 50);

  //Se generan las barras deslizantes
  var txt = createDiv("Número de vueltas");
  txt.position((windowWidth-width)/2, 80+height);
  var txt = createDiv("Radio");
  txt.position((windowWidth-width)/2+(width-150)/2, 80+height);
  var txt = createDiv("Longitud");
  txt.position((windowWidth-width)/2+(width-150), 80+height);
  slider[0]= createSlider(0, 20, 0, 1);
  slider[0].position((windowWidth-width)/2, 100+height);
  slider[1]= createSlider(0, (height-30)/2, 0, 1);
  slider[1].position((windowWidth-width)/2+(width-150)/2, 100+height);
  slider[2]= createSlider(0, width-30, 0, 1);
  slider[2].position((windowWidth-width)/2+(width-150), 100+height);

  //Se generan los botones
  checkbox[0]=createCheckbox('flechas', false)
  checkbox[0].position((windowWidth-width)/2, 20);
  checkbox[1]=createCheckbox('líneas de campo', false)
  checkbox[1].position((windowWidth-width)/2+width-200, 20);

  //Se asigna la posición del solenoide
  Position();
}

//Función para dibujo interactivo
function draw(){
  //Se generan los marcos del lienzo
  background(255);
  noFill();
  strokeWeight(1);
  rect(0, 0, width, height);

  //Se asignan los valores de longitud, numero de vueltas y radio
  num = round(slider[0].value());
  rad = slider[1].value();
  long = slider[2].value();

  //Se asigna la posición del solenoide
  Position();

  //Se asigna el valor a las corrientes
  for(var i=0; i<num; i++){
    c[i]=[];
    for(var j=0; j<2; j++){
      if(j==0){
        c[i][j]=1;
      }
      else{
        c[i][j]=-1;
      }
    }
  }

  //Se pinta las flechas del campo magnético
  if(checkbox[0].checked()){MagneticField()};

  //Se pintan las líneas de campo
  if(checkbox[1].checked()){Lineas()};

  //Se pinta el solenoide
  Solenoid();
}

//Función para que cuando el ratón esté pulsado se ejecute el código
function mousePressed() {
  loop();
}

//Función para que cuando el ratón no esté pulsado el código no se ejecute
function mouseReleased() {
noLoop();
}

//Función para dar la posición del solenoide
function Position(){
  for(var i=0; i<num; i++){
    for(var j=0; j<2; j++){
      if(num==1){
        posx[i] = width/2;
        posy[j] = (height)/2-rad+2*j*rad;
      }
      else{
        posx[i] = (width-long)/2+long*i/(num-1);
        posy[j] = (height)/2-rad+2*j*rad;
      }
    }
  }
}

//Función para dibujar el solenoide
function Solenoid(){
  strokeWeight(2);
  textSize(10);
  for(var i=0; i<num; i++){
    for(var j=0; j<2; j++){
      if (j!=0) {
        fill(255);
        ellipse(posx[i], posy[j], 10, 10);
        ellipse(posx[i], posy[j], 2, 2);
      }
      else{
        fill(255);
        ellipse(posx[i], posy[j], 10, 10);
        push();
        strokeWeight(1);
        translate(posx[i], posy[j]);
        rotate(PI/4);
        line(-5, 0, 5, 0);
        line(0, -5, 0, 5);
        pop();
      }
    }
  }
}

//Función para generar la forma de la flecha
function Flecha(xPosition, yPosition, angle, long, color){
  var wide = long/10;
  noStroke();
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
  var current; //Variable para el vector posición de la corriente
  var ang; //Variable para dar el ángulo 
  var b = []; //Variable para el campo magnético
  var division = 20; //Variable para dividir el solenoide en partes para hacer la integral numérica

  push();
  translate(width/2, height/2);

  //Bucle para recorrer la pantalla de forma discreta
  for(var i=-width/2+20; i<=width/2-20; i += 20){
    for(var j=-height/2+20; j<= height/2-20; j +=20){
      b[1] = 0;
      b[2] = 0;

      //Bucle para recorrer todas las espiras
      for(var k=0; k<num; k++){

        //Bucle para calcular el potencial generado por una espira
        for(var l=0; l<division; l++){

          //Se define la variable rho del punto a calcular el campo
          rho=j;

          //Se define la variable z del punto a calcular el campo
          if(num==1){z = i;}
          else{z = i + long/2 - long*k/(num-1);} 

          //Se genera un vector que tenga la dirección de la corriente
          current = createVector(rad*cos(l*2*PI/division), rad*sin(l*2*PI/division), 0)

          //Se calcula el ángulo de la corriente
          ang = current.heading();

          //Se calcula el campo magnético en ambos ejes
          b[1] += z*cos(ang)/pow(sq(rho)+sq(z)+sq(rad)-2*rad*rho*cos(ang),3/2);
          b[2] += (rad-rho*cos(ang))/pow(sq(rho)+sq(z)+sq(rad)-2*rad*rho*cos(ang),3/2);
        }
      }

      //Se calcula la dirección del campo magnético
      phi = atan2(b[1],b[2]);

      //Se dibujan las flechas que indican la dirección y magnitud del campo magnético
      Flecha(i, j, phi, 50*pow(sq(b[2])+sq(b[1]),(1/8)), 0);
    }
  }
  pop();
}

//Función para calcular el flujo magnético en un punto
function MagneticFlux(x,y){
  var solenoid; //Variable para la posición del solenoide respecto del centro
  var punto;  //Variable para la posición del punto respecto del centro
  var current; //Variable para dar el vector corriente
  var ang; //Variable para dar el ángulo de la corriente
  var d = []; //Varible para las distancias
  var a = []; //Variable para el potencial vector magnético
  var f = 0; //Variable para el flujo magnético
  var i = x-width/2; //Posición x del punto buscado en el nuevo sistema de referencia
  var j = y-height/2; // Posición y del punto buscado en el nuevo sistema de referencia
  var division = 20; //Variable para dividir el solenoide en partes para hacer la integral numérica

  //Bucle para generar los array necesarios
  for(var k=0; k<num; k++){
    d[k]=[];
  }

  a[1] = 0;
  a[2] = 0;
  a[3] = 0;

  push();
  translate(width/2, height/2);

  //Bucle para recorrer todas las espiras
  for(var k=0; k<num; k++){

    //Bucle para calcular el potencial generado por una espira
    for(var l=0; l<division; l++){

      //Caso de una única vuelta
      if(num==1){
        //Se da la posición de la espira respecto del centro
        solenoid = createVector(rad*cos(l*2*PI/division), rad*sin(l*2*PI/division), 0);
      }

      //Caso de más de una vuelta
      else {
        //Se da la posición de la espira respecto del centro
        solenoid = createVector(rad*cos(l*2*PI/division), rad*sin(l*2*PI/division), -long/2+long*k/(num-1));
      }

      //Se da la posición de un punto genérico del lienzo respecto al origen
      punto = createVector(0, j, i);

      //Se genera un vector que tenga la dirección de la corriente
      current = createVector(-rad*sin(l*2*PI/division), rad*cos(l*2*PI/division), 0)

      //Se calcula el ángulo de la corriente
      ang = current.heading();

      //Se calculan las distancias del punto a la espira
      d = punto.dist(solenoid);

      //Se calcula el potencial vector magnético en ambos ejes
      a[1] += (2*PI*rad/division)/d*cos(ang);
      a[2] += (2*PI*rad/division)/d*sin(ang);
      
    }
  }    
  //Se calcula el módulo del potencial vector
  a[3] = sqrt(sq(a[1])+sq(a[2]));

  //Se calcula el flujo magnético
  f = a[3] * j;

  pop();

  //Se devuelve el valor del flujo magnético en el punto buscado
  return f;
}

//Función para dibujar las líenas de campo magnético
function Lineas(){
  var corner = []; //Variable para almacenar los valores de flujo de las esquinas del cuadrado
  var fl = []; //Variable para almacenar valores de flujo
  var flmin = 0; //Variable para almacenar el menor valor de flujo de las esquinas del cuadrado
  var flmax = 0; //Variable para almacenar el mayor valor de flujo de las esquinas del cuadrado
  var linea; //Variable para dar el valor del flujo de la linea buscada
  var h = 5; //Variable para dar el lado de la rejilla

  strokeWeight(1);

  //Bucle para guardar los valores de flujo necesarios
  for(var i=0; i<=width; i+=h){
    fl[i] = [];
    for(var j=1; j<=height; j+=h){
      fl[i][j] = MagneticFlux(i,j);
    }
  }

  //Bucle para dibujar las líneas de campo
  for(var t=0; t<21; t++){
    var sgn = 1;
    if(t<10){sgn = -1;}
    linea = sgn*sq(t-10)*50;
    //Bucle para generar la rejilla sobre la cual dibujar
    for(var i=0; i<width; i+=h){
      for(var j=1; j<height; j+=h){
        //Se asigna a cada esquina del cuadrado actual el valor correspondiente de flujo
        corner[1] = fl[i][j];
        corner[2] = fl[i+h][j];
        corner[3] = fl[i][j+h];
        corner[4] = fl[i+h][j+h];

        //Se halla el valor máximo y mínimo de flujo del cuadrado actual
        for(var k=1; k<5; k++){
          if(corner[k]<flmin){flmin=corner[k]}
          if(corner[k]>flmax){flmax=corner[k]}
        }
        //Se comprueba si la linea atraviesa el cuadrado actual
        if(linea<flmax && linea>flmin){

          //Se definen expresiones para simplificar el codigo
          exp1 = ((linea<corner[1] && linea>corner[2]) || (linea>corner[1] && linea<corner[2]));
          exp2 = ((linea<corner[1] && linea>corner[3]) || (linea>corner[1] && linea<corner[3]));
          exp3 = ((linea<corner[2] && linea>corner[4]) || (linea>corner[2] && linea<corner[4]));
          exp4 = ((linea<corner[3] && linea>corner[4]) || (linea>corner[3] && linea<corner[4]));

          //Se dibujan las líneas suponiendo el flujo lineal
          //Se separan los 6 posibles casos de una línea de atravesar el cuadrado
          if(exp1 && exp2){
            x1 = i+abs((linea-corner[1])/(corner[2]-corner[1]))*h;
            y1 = j;
            x2 = i;
            y2 = j+abs((linea-corner[1])/(corner[3]-corner[1]))*h;
            line(x1, y1, x2, y2);
          }
          else if(exp1 && exp3){
            x1 = i+abs((linea-corner[1])/(corner[2]-corner[1]))*h;
            y1 = j;
            x2 = i + h;
            y2 = j+abs((linea-corner[2])/(corner[4]-corner[2]))*h;
            line(x1, y1, x2, y2);
          }
          else if(exp1 && exp4){
            x1 = i+abs((linea-corner[1])/(corner[2]-corner[1]))*h;
            y1 = j;
            x2 = i+abs((linea-corner[3])/(corner[4]-corner[3]))*h;
            y2 = j + h;
            line(x1, y1, x2, y2);
          }
          else if(exp2 && exp3){
            x1 = i;
            y1 = j+abs((linea-corner[1])/(corner[3]-corner[1]))*h;
            x2 = i + h;
            y2 = j+abs((linea-corner[2])/(corner[4]-corner[2]))*h;
            line(x1, y1, x2, y2);
          }
          else if(exp2 && exp4){
            x1 = i;
            y1 = j+abs((linea-corner[1])/(corner[3]-corner[1]))*h;
            x2 = i+abs((linea-corner[3])/(corner[4]-corner[3]))*h;
            y2 = j + h;
            line(x1, y1, x2, y2);
          }
          else  if(exp3 && exp4){
            x1 = i + h;
            y1 = j+abs((linea-corner[2])/(corner[4]-corner[2]))*h;
            x2 = i+abs((linea-corner[3])/(corner[4]-corner[3]))*h;
            y2 = j + h;
            line(x1, y1, x2, y2);
          }
        }
      }
    }
  }
}
