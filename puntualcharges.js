var n=3; //Variable que da el número de filas de carga
var m=3; //Variable que da el número de columnas de carga
var c = []; //Variable para el valor de las cargas
var number = []; // Variable para el número de líneas de campo de cada carga
var slider = []; //Variable para las barras deslizantes
var checkbox = []; //Variable para los botones
var posx = []; //Variable que da la coordenada x de posición de las cargas
var posy = []; //Variable que da la coordenada y de la posición de las cargas

//Bucle para generar los array necesarios
for(var i = 0; i < n; i++){
  slider[i]=[];
  c[i]=[];
  number[i]=[];
  for(var j = 0; j < m; j++){
    number[i][j]=[]
  }
}

//Función para establecer los parámetros iniciales
function setup(){
  //Se crea el lienzo
  var myCanvas = createCanvas(1000, 500);
  myCanvas.position((windowWidth-width)/2, 50);

  //Bucle para limitar el número máximo de cargas
  if(n>8){
    var txt = createDiv("Demasiadas cargas por fila");
    txt.position(windowWidth/2-150, windowHeight/2-100);
  }

  else{
    //Se generan las barras deslizantes
    for(var j = 0; j < m; j++){
      for(var i = 0; i < n; i++){
        var l = i + 1;
        var k = j + 1;
        var txt = createDiv("Valor de la carga "+k+l);
        if(n!=1 && n<7){
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
        else if (n==1){
          txt.position(windowWidth/2-100, 80+height+50*j);
          slider[i][j]= createSlider(-4, 4, 0, 1);
          slider[i][j].position(windowWidth/2-100, 100+height+50*j);
        }
      }
    }
    //Se generan los botones
    checkbox[0]=createCheckbox('flechas', false)
    checkbox[0].position((windowWidth-width)/2, 20);
    checkbox[1]=createCheckbox('líneas de campo', false)
    checkbox[1].position((windowWidth-width)/2+(width-200)/2, 20);
    checkbox[2]=createCheckbox('superficies equipotenciales', false)
    checkbox[2].position((windowWidth-width)/2+(width-200), 20);
  }

  //Se asigna la posición a las cargas
  Position();
}

//Función para dibujo interactivo
function draw(){
  //Se generan los marcos del lienzo
  background(255);
  noFill();
  strokeWeight(1);
  rect(0, 0, width, height);

  //Se asignan los valores de las cargas
  for(var i = 0; i < n; i++){
    for(var j = 0; j < m; j++){
      c[i][j] =slider[i][j].value();
    }
  }

  //Se pinta las flechas del campo eléctrico
  if(checkbox[0].checked()){ElectricField()};

  //Se pintan las líneas de campo
  if(checkbox[1].checked()){Lineas()};

  //Se pintan las superficies equipotenciales
  if(checkbox[2].checked()){Lineas1()};

  //Se pintan las cargas
  Charges();

}

//Función para que cuando el ratón esté pulsado se ejecute el código
function mousePressed() {
  loop();
}

//Función para que cuando el ratón no esté pulsado el código no se ejecute
function mouseReleased() {
noLoop();
}

//Función para dar la posición de las cargas
function Position(){
  for(var i=0; i<n; i++){
    for(var j=0; j<m; j++){
      posx[i] = (i+1)*width/(n+1);
      posy[j] = (j+1)*height/(m+1);
    }
  }
}

//Función para dibujar las cargas
function Charges(){
  strokeWeight(3);
  for(var i=0; i<n; i++){
    for(var j=0; j<m; j++){
      if(c[i][j]!=0){
        fill(255);
        ellipse(posx[i], posy[j], 30, 30);
        fill(0)
        if(c[i][j]>0){
          text("+" + c[i][j], posx[i]-5, posy[j]+5);
        }
        else {
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

//Función para dibujar las flechas del campo eléctrico
function ElectricField(){
  var charge; //Variable para la posición de las cargas respecto del centro
  var punto //Variable para la posición del punto respecto del centro
  var r; //Variable para dar posición del punto respecto de las cargas
  var ang ; //Variable para el ángulo de u_r
  var d; //Varible para las distancias
  var b = []; //Variable para el campo eléctrico
  var phi; //Variable para el ángulo del campo eléctrico

  push();
  translate(width/2, height/2);

  //Bucle para recorrer la pantalla de forma discreta
  for(var i=-width/2+20; i<=width/2-20; i += 20){
    for(var j=-height/2+20; j<= height/2-20; j +=20){
      b[1] = 0;
      b[2] = 0;

      //Bucle para recorrer las cargas no nulas
      for(var k=0; k<n; k++){
        for(var l=0; l<m; l++){
          if(c[k][l]!=0){

            //Se da la posición de las cargas respecto del centro
            charge = createVector(posx[k]-(width/2), posy[l]-height/2);

            //Se da la posición de un punto genérico del lienzo respecto al origen
            punto = createVector(i, j);

            //Se da la posición de un punto genérico respecto de las cargas
            r = p5.Vector.sub(punto, charge);

            //Se halla el ángulo del punto genérico respecto de las cargas
            ang = r.heading();

            //Se calculan las distancias de cada punto a las cargas
            d = punto.dist(charge);

            //Se calcula el campo eléctrico en el eje X
            b[1] += c[k][l]/(sq(d))*cos(ang);

            //Se calcula el campo eléctrico en el eje Y
            b[2] += c[k][l]/(sq(d))*sin(ang);
          }
        }
      }

      //Se calcula la dirección del campo eléctrico
      phi = atan2(b[2],b[1]);

      //Se dibujan las flechas que indican la dirección y magnitud del campo eléctrico
      Flecha(i, j, phi, 50*pow(sq(b[2])+sq(b[1]),(1/9)), 0);
    }
  }
  pop();
}

//Función para calcular el ángulo del campo electrico en el punto (x,y)
function ElectricFieldAng(x, y){
  var charge; //Variable para la posicion de las cargas respecto del centro
  var punto;  //Variable para la posición del punto respecto del centro
  var r; // Variable para la posición del punto respecto de las cargas
  var ang; //Variable para el ángulo de u_r
  var d; //Varible para las distancias
  var b = []; //Variable para el campo eléctrico
  var phi; //Variable para el ángulo del campo eléctrico
  var i = x-width/2; //Posición x del punto buscado en el nuevo sistema de referencia
  var j = y-height/2; // Posición y del punto buscado en el nuevo sistema de referencia

  push();
  translate(width/2, height/2);
  b[1] = 0;
  b[2] = 0;

  //Bucle para recorrer las cargas no nulas
  for(var k=0; k<n; k++){
    for(var l=0; l<m; l++){
      if(c[k][l]!=0){

        //Se da la posición de las cargas respecto del centro
        charge = createVector(posx[k]-width/2, posy[l]-height/2);

        //Se da la posición de un punto genérico del lienzo respecto al origen
        punto = createVector(i, j);

        //Se da la posición de un punto genérico respecto de las cargas
        r = p5.Vector.sub(punto, charge);

        //Se halla el ángulo del punto genérico respecto de las cargas
        ang = r.heading();

        //Se calculan las distancias de cada punto a las cargas
        d = punto.dist(charge);

        //Se calcula el campo eléctrico en el eje X
        b[1] += c[k][l]/(sq(d))*cos(ang);

        //Se calcula el campo eléctrico en el eje Y
        b[2] += c[k][l]/(sq(d))*sin(ang);
      }
    }
  }

  //Se calcula la dirección del campo eléctrico
  phi = atan2(b[2],b[1]);

  pop();

  //Se devuelve la dirección del campo en la posición requerida
  return phi;
}

//Función para dar un número a cada línea de campo que parte de cada carga
function Number(){
  for(var i=0; i<n; i++){
    for(var j=0; j<m; j++){
      for(var k=0; k<6*(abs(c[i][j])); k++){
        number[i][j][k] = 1;
      }
    }
  }
}

//Función para dibujar las líneas de campo
function Lineas(){
  Number();

  var condition=0; //Variable para dar la condición de fin de las líneas

  //Bucle para recorrer las cargas de mayor a menor valor
  for(var contador = -4; contador<0; contador++){
    //Bucle para que se recorran los valores positivos y negativos
    for(var repetition = 0; repetition<2; repetition++){
      //Bucle para recorrer todas las cargas
      for(var i=0; i<n; i++){
        for(var j=0; j<m; j++){
          if(c[i][j]==contador){
            //Bucle para dibujar las diferentes líneas de campo
            for(var k=0; k<6*(abs(c[i][j])); k++){
                if(number[i][j][k]==1){
                var a=0;  //Variable para cortar líneas de campo que terminan
                var x;  //Variable para la coordenada x de la línea de campo
                var y;  //Variable para la coordenada y de la línea de campo
                var h=1;  //Variable que da el salto entre cada iteracción
                //Se da como posición inicial la posición de la carga
                //Se va varía ligeramente la posicíon para que cada línea de campo salga en un ángulo diferente
                x = posx[i] + 10 * cos(k * 2 * PI / (6*(abs(c[i][j]))));
                y = posy[j] + 10 * sin(k * 2 * PI / (6*(abs(c[i][j]))));

                //Bucle para hacer la iteracción de la línea de campo
                while ((h < x) && (x < width-h) && (h < y) && (y < height-h)){
                  x0 = x;
                  y0 = y;

                  //Si la carga es positiva las líneas de campo siguen la dirrección del campo
                  if (c[i][j]>0){
                    x += h * cos(ElectricFieldAng(x,y));
                    y += h * sin(ElectricFieldAng(x,y));
                  }
                  //Si la carga es negativa las líneas de campo van en dirección contraria al campo
                  else {
                    x -= h * cos(ElectricFieldAng(x,y));
                    y -= h * sin(ElectricFieldAng(x,y));
                  }
                  //Se va dibujando la línea como sucesión de líneas pequeñas
                  strokeWeight(1);
                  line(x0, y0, x, y);
                  //Bucle para cortar las líneas y eliminar las repetidas
                  a++;
                  if(a>50){
                    for(var p=0; p<n; p++){
                      for(var q=0; q<m; q++){
                        if((c[p][q]!=0)  && (abs(x-posx[p])<10) && (abs(y-posy[q])<10) && sqrt(sq(x-posx[p])+sq(y-posy[q]))<10){
                          condition = 1;
                          //Cálculo para hallar el ángulo que forma la línea al llegar
                          var v1 = createVector(x-posx[p], y-posy[q]);
                          var ang = v1.heading();
                          //Bucle para eliminar la línea repetida
                          for(var l=0; l<6*(abs(c[p][q])); l++){
                            var v2 = createVector(10*cos(l*2*PI/(6*(abs(c[p][q])))), 10*sin(l*2*PI/(6*(abs(c[p][q])))));
                            if(abs(v1.angleBetween(v2))<PI/(6*(abs(c[p][q])))){
                              number[p][q][l]=0;
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                  if(condition == 1){
                    condition = 0;
                    break;
                  }
                  if(a>1000){
                    break;
                  }
                }
              }
            }
          }
        }
      }
      contador=-contador;
    }
  }
}

//Función para calcular el flujo del campo electrico en el punto (x,y)
function ElectricFlux(x, y){
  var charge; //Variable para la posicion de las cargas respecto del centro
  var punto; //Varible par la posición del punto respecto del centro
  var d; //Varible para las distancias
  var f = 0; //Variable para el flujo del campo eléctrico
  var i = x-width/2; //Posición x del punto respecto del centro
  var j = y-height/2; // Posición y del punto respecto del centro

  push();
  translate(width/2, height/2);

  //Bucle para recorrer todas las cargas no nulas
  for(var k=0; k<n; k++){
    for(var l=0; l<m; l++){
      if(c[k][l]!=0){

        //Se da la posición de las cargas respecto del centro
        charge = createVector(posx[k]-width/2, posy[l]-height/2);

        //Se da la posición de un punto genérico del lienzo respecto al origen
        punto = createVector(i, j);

        //Se calculan las distancias de cada punto a las cargas
        d = punto.dist(charge);

        //Se calcula el flujo eléctrico en el punto (x,y)
        f += c[k][l]/d;
      }
    }
  }

  pop();

  //Se devuelve valor del flujo en la posición requerida
  return f;
}

//Función para dibujar las líneas equiponteciales del campo eléctrico
function Lineas1(){
  var corner = []; //Variable para almacenar los valores de flujo de las esquinas del cuadrado
  var flmin = 0; //Variable para almacenar el valor de flujo mínimo
  var flmax = 0; //Variable para almacenar el valor de flujo máximo
  var fl = []; //Variable para almacenar valores de flujo
  var linea; //Variable para dar el valor del flujo de la linea buscada
  var h = 5; //Variable para dar el interlineado de la rejilla

  strokeWeight(1);

  //Bucle para elegir los valores de las líneas de campo a representar
  for(var i=0; i<=width; i+=h){
    fl[i] = [];
    for(var j=3; j<=height; j+=h){
      var temp = ElectricFlux(i,j)
      fl[i][j] = temp;
      if(temp<flmin){flmin=temp;}
      if(temp>flmax){flmax=temp;}
    }
  }

  var intervalo = (flmax-flmin)/400;

//Bucle para dibujar las superficies equipotenciales
  for(var linea = flmin+intervalo; linea<flmax-intervalo; linea += intervalo){
    //Bucle para generar la rejilla sobre la cual dibujar
    for(var i=0; i<width; i+=h){
      for(var j=3; j<height; j+=h){
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
          else if(exp3 && exp4){
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
