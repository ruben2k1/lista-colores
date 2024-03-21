const contenedorColores = document.querySelector('ul');
const formulario = document.querySelector('form');
const inputTexto = document.querySelector("input[type='text']");
const mensajeError = document.querySelector('.error');

function color(id, r ,g ,b) {
    let item = document.createElement('li');
    item.innerText = [ r, g, b ].join(', ');
    item.style.backgroundColor = `rgb(${[r,g,b].join(',')})`;
    
    item.addEventListener('click', () => {
        fetch('https://api-colores-full-no3c.onrender.com/colores/borrar/' + id, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(({ resultado, error }) => {
            if (!error && resultado === 'ok') {
                return item.remove();
            }

            console.error('Mostrar error al usuario');
        });
    });

    return item;
}

function main() {
    fetch('https://api-colores-full-no3c.onrender.com/colores')
    .then(res => res.json())
    .then(colores => {
        colores.forEach(({ id, r, g, b }) => {
            contenedorColores.appendChild(color(id, r, g, b));
        })
    });

    formulario.addEventListener('submit', e => {
        e.preventDefault();
        mensajeError.classList.remove('visible');

        let textoError = 'No puede estar en blanco';

        if (inputTexto.value.trim() !== '') {
            let numeros = inputTexto.value.split(',').map(n => Number(n));
            let valido = numeros.length === 3;

            if (valido) {
                numeros.forEach(n => valido = valido && n >= 0 && n <= 255 && n - parseInt(n) === 0);
            
                if (valido) {
                    let [ r, g, b] = numeros;

                    return fetch('https://api-colores-full-no3c.onrender.com/colores/nuevo', {
                        method: 'POST',
                        body: JSON.stringify({ r, g, b }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(({ id, error }) => {
                        if (!error) {
                            contenedorColores.appendChild(color(id, r, g, b));

                            return inputTexto.value = '';
                        }

                        console.error('Error');
                    });


                }
            }

            textoError = 'Deben ser tres números entre 0 y 255 separados por comas';
        }

        mensajeError.innerText = textoError;
        mensajeError.classList.add('visible');
    })
}

document.addEventListener('DOMContentLoaded', main);