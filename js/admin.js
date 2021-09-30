let results = [];
let dataSet = [];
let dataType = "whirpool";

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
		`<a target='blank' href='https://mywhirlpool.com.ua/${e.photodownload}'>https://mywhirlpool.com.ua/${e.photodownload}</a>`,
		e.photo2download
			? `<a target='blank' href='https://mywhirlpool.com.ua/${e.photo2download}'>https://mywhirlpool.com.ua/${e.photo2download}</a>`
			: "---",
	]);
}
function renderTable(data) {
	$("#dataTable").DataTable({
		paging: false,
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
			{ title: "Чек" },
			{ title: "ІПН" },
		],
	});
}
function filterByInterval(from, to) {
	const f = new Date(from);
	const t = new Date(to);
	f.setTime(f.getTime() - 1000 * 60 * 60 * 3);
	t.setTime(t.getTime() + 1000 * 60 * 60 * 21);
	const filtered = results.filter((e) => {
		const date = new Date(e.submitted_on);
		return date <= t && date >= f;
	});
	dataSet = objectsToArray(filtered);
}
function resetTable() {
	$("#dataTable").DataTable().clear().destroy();
	renderTable(dataSet);
}
function exportReportToExcel() {
	let table = document.getElementById("dataTable");
	TableToExcel.convert(table, {
		name: `export.xlsx`,
		sheet: {
			name: "Sheet 1",
		},
	});
}
function fetchAndUpdate(cb) {
	$.ajax({
		type: "POST",
		url: "https://mywhirlpool.com.ua/admin/receipt.php",
		data: { token: sessionStorage.getItem("token"), type: dataType },
		success: (data) => {
			results = JSON.parse(data).data || [];
			dataSet = objectsToArray(results);
			resetTable();
			if (cb) cb();
		},
	});
}

$(document).ready(function () {
	if (sessionStorage.getItem("token")) {
		$("#loginForm").hide();

		$.ajax({
			type: "POST",
			url: "https://mywhirlpool.com.ua/admin/receipt.php",
			data: { token: sessionStorage.getItem("token"), type: dataType },
			success: (data) => {
				results = JSON.parse(data).data || [];
				dataSet = objectsToArray(results);
				renderTable(dataSet);
			},
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
			$("#dateFilter").removeClass("error");
		} else {
			$("#dateFilter").addClass("error");
			dataSet = objectsToArray(results);
			resetTable();
		}
	});
	$("#exportFile").on("click", exportReportToExcel);
	$("#dataType").on("input", () => {
		dataType = document.getElementById("dataType").value;
		fetchAndUpdate(() => {
			$("#dateFilter").trigger("click");
			$("#dateFilter").removeClass("error");
		});
	});
});
