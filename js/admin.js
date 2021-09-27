let results = [
	{
		id: 1,
		fName: "Андрий",
		lName: "Селезняк",
		phone: "0993847563",
		email: "равырав@gmail.com",
		poshta: "Київ відділення такето",
		serialNumber: "9485663754",
		registrationDate: "2021-09-21",
		purchaseDate: "2021-09-14",
		fiscalNumber: "3353366757",
		shopName: "Eldorado",
		photo: null,
	},
	{
		id: 2,
		fName: "Сережка",
		lName: "Запорожец",
		phone: "0503847563",
		email: "123акик23@gmail.com",
		poshta: "Київ відділення такето",
		serialNumber: "94485663754",
		registrationDate: "2021-09-20",
		purchaseDate: "2021-09-13",
		fiscalNumber: "33533366757",
		shopName: "фокстрот",
		photo: null,
	},
	{
		id: 3,
		fName: "Максимка",
		lName: "Шляпик",
		phone: "0673847563",
		email: "safsf2323@gmail.com",
		poshta: "Київ відділення такето",
		serialNumber: "94856863754",
		registrationDate: "2021-09-19",
		purchaseDate: "2021-09-12",
		fiscalNumber: "33533866757",
		shopName: "Eldorado",
		photo: null,
	},
	{
		id: 4,
		fName: "Андрий",
		lName: "Селезняк",
		phone: "0993847563",
		email: "равырав@gmail.com",
		poshta: "Київ відділення такето",
		serialNumber: "94856693754",
		registrationDate: "2021-09-18",
		purchaseDate: "2021-09-11",
		fiscalNumber: "33533696757",
		shopName: "Eldorado",
		photo: null,
	},
	{
		id: 5,
		fName: "Сашко",
		lName: "Зеленський",
		phone: "0993847563",
		email: "зеленюк@gmail.com",
		poshta: "Київ відділення такето",
		serialNumber: "948566223754",
		registrationDate: "2021-09-17",
		purchaseDate: "2021-09-10",
		fiscalNumber: "335336556757",
		shopName: "Eldorado",
		photo: null,
	},
];

let dataSet = objectsToArray(results);
let dataType = "Whirpool";

function objectsToArray(objs) {
	return objs.map((e) => [
		e.id,
		e.fName,
		e.lName,
		e.phone,
		e.email,
		e.poshta,
		e.serialNumber,
		e.registrationDate,
		e.purchaseDate,
		e.fiscalNumber,
		e.shopName,
		"<a href='https://madewithvuejs.com/enso-datatable' target='blank'>https://madewithvuejs.com/enso-datatable</a>",
		e.photo2 || "",
		// "<a href='" + e.photo + "'" + "target='blank'>" + e.photo + "</a>",
		// e.photo,
	]);
}
function renderTable(data) {
	$("#dataTable").DataTable({
		data,
		columns: [
			{ title: "ID" },
			{ title: "Ім'я" },
			{ title: "Прізвище" },
			{ title: "Телефон" },
			{ title: "E-Mail" },
			{ title: "Укр Пошта" },
			{ title: "Серійний Номер" },
			{ title: "Дата реєстрації" },
			{ title: "Дата Придбання" },
			{ title: "Номер Фіскального Чеку" },
			{ title: "Назва Магазину" },
			{ title: "Фото" },
			{ title: "Фото2" },
		],
	});
}
function filterByInterval(from, to) {
	const f = new Date(from);
	const t = new Date(to);
	const filtered = results.filter((e) => {
		const date = new Date(e.registrationDate);
		return date <= t && date >= f;
	});
	dataSet = objectsToArray(filtered);
}
function resetTable() {
	$("#dataTable").DataTable().clear().destroy();
	dataSet = results.map((e) => [
		e.id,
		e.fName,
		e.lName,
		e.phone,
		e.email,
		e.poshta,
		e.serialNumber,
		e.registrationDate,
		e.purchaseDate,
		e.fiscalNumber,
		e.shopName,
		e.photo,
	]);
	renderTable(dataSet);
}
function exportReportToExcel() {
	// $("#dataTable tr td:last-of-type").each((i, e) => {
	// 	console.log(e);
	// 	$(e).attr("data-hyperlink", $(e).text());
	// });
	let table = document.getElementById("dataTable");
	TableToExcel.convert(table, {
		name: `export.xlsx`,
		sheet: {
			name: "Sheet 1",
		},
	});
}
function fetchAndUpdate() {
	//TODO
}

$(document).ready(function () {
	if (sessionStorage.getItem("token")) {
		$("#loginForm").hide();
	}

	renderTable();
	$("#dataTable").DataTable().clear().destroy();
	//FETCH INITIAL WHIRPOOL HERE

	$("#loginSubmit").on("click", () => {
		const userName = document.getElementById("username").value;
		const password = document.getElementById("password").value;
		$.ajax({
			type: "POST",
			url: "../admin/login.php",
			data: { user: userName, pass: password },
			success: (data) => {
				const result = JSON.parse(data);
				if (result.status === "success") {
					$("#loginSubmit").removeClass("error");
					document.getElementById("loginForm").style.display = "none";
					sessionStorage.setItem("token", result.token);
				} else {
					$("#loginSubmit").addClass("error");
				}
			},
			error: () => {
				$("#loginSubmit").addClass("error");
			},
		});
	});

	$("#dateFilter").on("click", () => {
		const from = document.getElementById("dateFrom").value;
		const to = document.getElementById("dateTo").value;
		if (from && to) {
			$("#dataTable").DataTable().clear().destroy();
			filterByInterval(from, to);
			renderTable(dataSet);
		} else {
			resetTable();
		}
	});
	$("#exportFile").on("click", exportReportToExcel);
	$("#dataType").on("input", () => {
		dataType = document.getElementById("dataType").value;
		///FETCH NEW DATA HERE
		$("#dataTable").DataTable().clear().destroy();
		renderTable(dataSet);
	});
});
