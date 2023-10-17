
class Productos {
    constructor(nombre, precio, stock, id, img, cantidad) {
      this.nombre = nombre;
      this.precio = precio;
      this.stock = stock;
      this.id = id;
      this.img = img;
      this.cantidad= cantidad=0;
    }
  }
  let totalCompraHtml= document.querySelector(".totalcompraHtml")
  let inventarioHtml = document.querySelector(".inventarioHtml");
  contenedorCarrito = document.querySelector("#lista__carrito tbody");
  let carro =document.querySelector("#carrito");
  let btnVaciarCarrito =document.querySelector("#vaciar__carrito")
  let btnResiduos = document.querySelector(".btn__residuos")
  let btnFinalizarCompra= document.querySelector("#finalizarCompra")
  let filtro = document.querySelector("#filtro") 
  let btnFiltro= document.querySelector("#btnFiltro")

  let inventario = [];
  let carrito =[];
  let carritoFiltrado=[];

  const jabon = new Productos("Jabon", 1000, 5, 1, "Imagenes/SKIP-ORIGINAL-5L.jpg");
  const suavizante = new Productos("Suavizante", 500, 5, 2,"Imagenes/Suavizante.jpg");
  const cloro = new Productos("Cloro", 750, 5, 3,"Imagenes/cloro.jpg");
  const perfumina = new Productos("Perfumina", 250, 5, 4,"Imagenes/perfu.png");
  const detergente = new Productos("Detergente", 400, 5, 5,"Imagenes/deter.jpg");
  const cera = new Productos("Cera", 600, 5, 6,"Imagenes/cera.png");
  const desengrasante = new Productos("Desengrasante", 600, 5, 7,"Imagenes/desengra.jpg");
  const shampoo = new Productos("Shampoo", 200, 5, 8,"Imagenes/shampoo.jpg");
  inventario.push(jabon, suavizante, cloro, perfumina, detergente, cera, desengrasante, shampoo);
  
  crearHtml(inventario);
  let totalCompra = 0;

  function crearHtml(arr) {
    let html = "";
    arr.forEach((el) => {
      const { nombre, precio, stock, id, img } = el;
        html += `<div class="col-sm-6 col-md-6 col-lg-3" >
        <div class="bg-light card text-center detalleClass">
          <div>
              <img src="${img}" class="card-img-top" height="200" alt="...">
          </div>
            <div class="mb-2 mt-3 flex-column fs-4 text-dark">
             ${nombre}
            </div>
            <p class="m-1">-Precio: ${precio}</p>
           
            <div>
              <button id="btn${id}" class="comprar-btn mt-2 btn btn-dark mb-2">Agregar al Carrito.</button>
            </div>
          </div>
      </div>`;
    });
    inventarioHtml.innerHTML = html;
    

    // botones //
    document.querySelectorAll(".comprar-btn").forEach((boton) => {
      boton.addEventListener("click", () => {
        const id = parseInt(boton.id.replace("btn", ""));
        const producto = arr.find((el) => el.id === id);
        
        // if (producto.stock > 0) {
        //   producto.stock -= 1;
          
          if (!existeEnCarrito(producto.id))   //manejo la cantidad cuando borro el carrito.
            producto.cantidad =1;
          else
            producto.cantidad ++;

          agregarCarrito(producto)
          actualizarCarrito(carrito)
          totalCompra += producto.precio;
         
          // Actualizar la visualización del stock en el HTML
          crearHtml(arr);

           Swal.fire({
             title: 'Producto Agregado!',
             showClass: {
               popup: 'animate__animated animate__fadeInDown'
             },
             hideClass: {
               popup: 'animate__animated animate__fadeOutUp'
             }
           })
          
          totalCompraHtml.innerHTML="-El total de la compra es de: $ " + totalCompra;
          
        // } else {
        //   console.log("No hay stock disponible.");
        // }
       
      });
    });
  }
  let prodFiltrado;
  filtro.addEventListener("keyup", () => {
    
   prodFiltrado = filtro.value.toLowerCase();
   
    let productoEncontrado = inventario.find(producto => producto.nombre.toLowerCase() === prodFiltrado);
   if (inventario.includes(productoEncontrado)) {
    carritoFiltrado.push(productoEncontrado)
    // inventarioHtml.innerHTML ="";
    crearHtml(carritoFiltrado)
    carritoFiltrado=[]
  } else {
    crearHtml(inventario)
    
  }

  })
  
  
  btnVaciarCarrito.addEventListener("click", () => {
    limpiarHTMLcarro();
    carrito=[];
   totalCompra=0;
   crearHtml(inventario)
   totalCompraHtml.innerHTML="";
  })
  
  btnFinalizarCompra.addEventListener("click", () => {
    if(carrito.length<1)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Parece que el Carrito esta vacío...',
      
    })
    else{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success m-1',
        cancelButton: 'btn btn-danger m-1'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Verificaste todos los datos?',
      text: "Estás a un paso de confirmar tu compra por: $" + totalCompra,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No, deseo cancelar!',
      confirmButtonText: 'Si, Confirmar',

      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Compra realizada!',
          'Gracias por seleccionar nuestros Productos RM!',
          'success'
        )
        limpiarHTMLcarro();
        totalCompra=0;
        totalCompraHtml.innerHTML="";
        carrito=[];
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Podés regresar y verificar tu Carrito :)',
          'error'
        )
      }
    })
  }
  })

// funcion que agrega productos al carrito
function agregarCarrito(producto){
   if (producto.id && !existeEnCarrito(producto.id))   //si no exxiste. pushealo. si existe no lo pushea
    carrito.push(producto)                              //pero se actualiza la cantidad igual.
  
}
function existeEnCarrito(id) {
  return carrito.some(producto => producto.id === id); // hago una fiuncion que me dice si existe en el carrito
}                                                      //recorre la lista carrito y compara el prod.id.

  
  

// funcion para dibujar productos de la lista


function actualizarCarrito(carrito) {
  //Limpiar el HTML
  limpiarHTMLcarro();
  
  //Recorre el carrito y genera html
  carrito.forEach((producto) => {
    const { img, nombre, precio, id, cantidad } = producto;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>
                        <p class="mod" >${id}</p>
                      </td>
                      <td class="imgCarrito">
                        <img class="imgCarrito"src="${img}"></img>
                      </td>
                      <td>
                      <p class="mod" >${nombre}</p>
                      </td>
                      <td>
                      <p class="mod" >${cantidad}</p>
                      </td>
                      <td>
                      <p  class="mod" <strong>$${precio}</strong></p> 
                      </td>
                      <td>
                        <input id="borrar${id}" class="mod btn__residuos" type="image" src="./Imagenes/residuos.svg"/> 
                      </td>`;
    contenedorCarrito.appendChild(tr);

    //Funcion parar borrar un producto del carrito
    const borrarId = document.getElementById(`borrar${id}`);
    
    borrarId.addEventListener("click", () => {
    // if(producto.cantidad>0)
    //   producto.cantidad --;
    // else{ 
    //   carrito.remove(producto.id);
    
    // }
    if (producto.cantidad > 1) {
      producto.cantidad--;
      totalCompra= totalCompra- producto.precio;
      actualizarCarrito(carrito)
      totalCompraHtml.innerHTML="-El total de la compra es de: $ " + totalCompra;
  } else {
    const indice = carrito.findIndex(item => item.id === producto.id);
    if (indice !== -1) {
      carrito.splice(indice, 1);
      totalCompra= totalCompra- producto.precio;
      actualizarCarrito(carrito)
      totalCompraHtml.innerHTML="-El total de la compra es de: $ " + totalCompra ;
      
  }
  if(totalCompra==0)
      totalCompraHtml.innerHTML="";
    actualizarCarrito(carrito)
  }
    
  });
  })}
function limpiarHTMLcarro (){
  contenedorCarrito.innerHTML = "";
}



function borrarProd(){
  const producto = arr.find((el) => el.id === id);
 producto.stock = producto.stock + producto.cantidad;
}
