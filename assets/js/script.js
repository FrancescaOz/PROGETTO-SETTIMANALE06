var nome;
var cognome;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];

window.addEventListener('DOMContentLoaded', init);

function init() {
	nome = document.getElementById('nome');
	cognome = document.getElementById('cognome');
	addBtn = document.getElementById('scrivi');
	elencoHTML = document.getElementById('elenco');
	errore = document.getElementById('errore');
	erroreElenco = document.getElementById('erroreElenco');
	printData();
}

printData = () => {
	fetch('http://localhost:3000/elenco')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			elenco = data;
			if (elenco.length > 0) {
				errore.innerHTML = '';
				elencoHTML.innerHTML = '';
				elenco.map(function (element) {
					elencoHTML.innerHTML += `<li class="list-unstyled"><button type="button" class="btn btn-outline-danger me-2"><i class="fa-solid fa-trash-can"></i></button><button type="button" class="btn btn-outline-primary m-2" onClick="modifica(${element.id})"><i class="fa-solid fa-pen-to-square"></i></button>${element.cognome} ${element.nome}</li>`;
				});
			} else {
				erroreElenco.innerHTML = 'Nessuno studente presente nel registro';
			}
		});
}

controlla = () => {
	if (nome.value != '' && cognome.value != '') {
		var data = {
			nome: nome.value,
			cognome: cognome.value,
		};
		addData(data);
	} else {
		errore.innerHTML = 'Si prega di compilare tutti i campi!';
		return;
	}
}
// CREO LA FUNZIONE CHE MI CONSENTE DI AGGIUNGERE DATI DAL FORM
async function addData(data) {
	let response = await fetch('http://localhost:3000/elenco', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});
	clearForm();
}

clearForm = () => {
	nome.value = '';
	cognome.value = '';
}
// CREO UNA FUNZIONE PER ELIMINARE UN ELEMENTO DALLA COLONNA UTENTI//
elimina = (n) => {
	var answer = window.confirm("Attenzione, l'azione che stai tentando di intraprendere è irreversibile.Desideri continuare comunque?");
	if (answer) {
		fetch('http://localhost:3000/elenco/' + n, {
			method: 'DELETE',
		});
	};
}

// CREO UNA FUNZIONE PER PRENDERE I DATI AL CLICK PER POI MODIFICARLI
modifica = (n) => {
	addBtn.setAttribute("onclick", "put(" + n + ")");
	fetch('http://localhost:3000/elenco/' + n)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			nome.value = data.nome;
			cognome.value = data.cognome;
		});
}

put = (n) => {
	if (nome.value != '' && cognome.value != '') {
		addBtn.setAttribute("onclick", "controlla()");
		var data = {
			nome: nome.value,
			cognome: cognome.value,
		};
		modData(n, data);
	} else {
		errore.innerHTML = 'Si prega di compilare tutti i campi!';
		return;
	}
}

async function modData(n, data) {
	let response = await fetch('http://localhost:3000/elenco/' + n, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});
	clearForm();
}