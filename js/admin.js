let results = [];
let dataSet = [];
let dataType = "Whirpool";

function objectsToArray(objs) {
	return objs.map((e) => [
		e.id,
		e.firstname,
		e.lastname,
		e.userphone,
		e.useremail,
		e.department,
		e.serialnumber,
		e.submitted_on,
		e.purchasedate,
		e.fiscalCheck,
		e.shopname,
		e.photodownload,
		e.photo2download,
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
		const date = new Date(e.submitted_on);
		return date <= t && date >= f;
	});
	console.log(filtered);
	dataSet = objectsToArray(filtered);
}
function resetTable() {
	$("#dataTable").DataTable().clear().destroy();
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
function fetchAndUpdate(token, type) {
	fetch(
		`https://mywhirlpool.com.ua/admin/receipt.php?type=${dataType}&token=${sessionStorage.getItem(
			"token"
		)}`
	)
		.then((data) => data.json())
		.then((rows) => {
			results = rows.data || [];
			dataSet = objectsToArray(results);
			resetTable();
		});
}

$(document).ready(function () {
	if (sessionStorage.getItem("token")) {
		$("#loginForm").hide();
		fetch(
			`https://mywhirlpool.com.ua/admin/receipt.php?type=${dataType}&token=${sessionStorage.getItem(
				"token"
			)}`
		)
			.then((data) => data.json())
			.then((rows) => {
				results = rows.data || [];
				dataSet = objectsToArray(results);
				renderTable(dataSet);
			});
	}

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
					window.location.reload();
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
		fetchAndUpdate();
	});
});
