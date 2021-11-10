let results = [];
let dataSet = [];
let dataType = "whirpool";
let whirpoolData = [];
let silpoData = [];
let indesitData = [];
let all = [];
let wi = [];
let ws = [];
let is = [];

function objectsToArray(objs) {
	return objs.map((e) => [
		e.id,
		e.firstname,
		e.lastname,
		e.userphone,
		e.useremail,
		e.area,
		e.city,
		e.indexcity,
		e.department,
		e.instrument,
		e.brand,
		e.modelname,
		e.nc12,
		e.serialnumber,
		e.purchasedate,
		e.fiscalCheck,
		e.shopname,
		e.submitted_on,
		`<a target='blank' href='https://mywhirlpool.com.ua/${e.photodownload}'>https://mywhirlpool.com.ua/${e.photodownload}</a>`,
		e.photo2download
			? `<a target='blank' href='https://mywhirlpool.com.ua/${e.photo2download}'>https://mywhirlpool.com.ua/${e.photo2download}</a>`
			: "---",
		e.is_send_news == "0" ? "Ні" : "Так",
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
			{ title: "Номер телефону" },
			{ title: "E-Mail" },
			{ title: "Область" },
			{ title: "Місто" },
			{ title: "Індекс" },
			{ title: "Адреса" },
			{ title: "Вид Техніки" },
			{ title: "Бренд" },
			{ title: "Модель" },
			{ title: "Комерційний код" },
			{ title: "Серійний Номер" },
			{ title: "Дата Придбання" },
			{ title: "Номер Чека" },
			{ title: "Магазин" },
			{ title: "Дата реєстрації" },
			{ title: "Чек" },
			{ title: "ІПН" },
			{ title: "Згода" },
		],
	});
}
function clearDate() {
	document.getElementById("dateFrom").value = undefined;
	document.getElementById("dateTo").value = undefined;
}
function filterByInterval(from, to) {
	const f = new Date(from);
	const t = new Date(to);
	f.setTime(f.getTime() - 1000 * 60 * 60 * 2);
	t.setTime(t.getTime() + 1000 * 60 * 60 * 22);
	const filtered = results.filter((e) => {
		const date = new Date(e.submitted_on);
		return date <= t && date >= f;
	});
	dataSet = objectsToArray(filtered);
}
function resetTable(data) {
	$("#dataTable").DataTable().clear().destroy();
	renderTable(data);
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
function fetchAndUpdate(cb, type = "whirpool") {
	return $.ajax({
		type: "POST",
		url: "/admin/receipt.php",
		data: { token: sessionStorage.getItem("token"), type: type },
		success: (data) => {
			const res = JSON.parse(data);
			if (res.status === "error") {
				sessionStorage.setItem("token", "");
				window.location.reload();
			}
			if (cb) cb(res);
		},
	});
}

$(document).ready(async function () {
	if (sessionStorage.getItem("token")) {
		$("#loginForm").hide();

		await fetchAndUpdate((res) => {
			whirpoolData = res.data || [];
			dataSet = objectsToArray(whirpoolData);
			results = whirpoolData;
			renderTable(dataSet);
		}, "whirpool");
		await fetchAndUpdate((res) => (indesitData = res.data || []), "indesit");
		await fetchAndUpdate((res) => {
			silpoData = res.data || [];
			all = [...whirpoolData, ...silpoData, ...indesitData];
			wi = [...whirpoolData, ...indesitData];
			ws = [...whirpoolData, ...silpoData];
			is = [...indesitData, ...silpoData];
		}, "silpo");
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
			resetTable(dataSet);
		}
	});
	$("#exportFile").on("click", exportReportToExcel);
	$("#dataType").on("input", () => {
		dataType = document.getElementById("dataType").value;
		$("#dateFilter").removeClass("error");
		clearDate();

		switch (dataType) {
			case "whirpool":
				results = whirpoolData;
				dataSet = objectsToArray(whirpoolData);
				resetTable(dataSet);
				break;
			case "indesit":
				results = indesitData;
				dataSet = objectsToArray(indesitData);
				resetTable(dataSet);
				break;
			case "silpo":
				results = silpoData;
				dataSet = objectsToArray(silpoData);
				resetTable(dataSet);
				break;
			case "wi":
				results = wi;
				dataSet = objectsToArray(results);
				resetTable(dataSet);
				break;
			case "is":
				results = is;
				dataSet = objectsToArray(results);
				resetTable(dataSet);
				break;
			case "ws":
				results = ws;
				dataSet = objectsToArray(results);
				resetTable(dataSet);
				break;
			case "all":
				results = all;
				dataSet = objectsToArray(all);
				resetTable(dataSet);
				break;
		}
	});
});
