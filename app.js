let salaryData = [];

async function loadSalaries() {
    try {
        const response = await fetch('salaries.json');
        if (!response.ok) throw new Error('Failed to load JSON');
        salaryData = await response.json();

        // Populate the shared datalist for searching
        const datalist = document.getElementById('salaryOptions');
        salaryData.forEach(item => {
            const option = document.createElement('option');
            // We use the Title as the value the user sees/searches
            option.value = item.title;
            datalist.appendChild(option);
        });

        addRoleRow();
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('roles-container').innerHTML =
            `<div class="alert alert-danger">Error loading salaries.json. Check console for details.</div>`;
    }
}

function addRoleRow() {
    const container = document.getElementById('roles-container');
    const row = document.createElement('div');
    row.className = 'row g-2 mb-3 role-row align-items-end';

    row.innerHTML = `
        <div class="col-12 col-md-7">
            <label class="form-label small fw-bold">Job Title (Searchable)</label>
            <input type="text" class="form-control title-search" list="salaryOptions" placeholder="Type to search..." oninput="updateSalaryFromSearch(this)">
            <input type="hidden" class="salary-value" value="0">
        </div>
        <div class="col-8 col-md-4">
            <label class="form-label small fw-bold">Quantity</label>
            <div class="input-group">
                <span class="input-group-text">Qty</span>
                <input type="number" class="form-control qty-input" value="1" min="1" oninput="calculate()">
            </div>
        </div>
        <div class="col-4 col-md-1 d-grid">
            <button class="btn btn-remove" onclick="removeRow(this)">×</button>
        </div>
    `;

    container.appendChild(row);
    calculate();
}

// Logic to find the salary from the JSON based on the text input
function updateSalaryFromSearch(input) {
    const row = input.closest('.role-row');
    const hiddenSalaryInput = row.querySelector('.salary-value');
    const match = salaryData.find(item => item.title === input.value);

    if (match) {
        hiddenSalaryInput.value = match.salary;
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        hiddenSalaryInput.value = 0;
        input.classList.remove('is-valid');
    }
    calculate();
}

function removeRow(btn) {
    btn.closest('.role-row').remove();
    calculate();
}

function calculate() {
    const duration = parseFloat(document.getElementById('duration').value) || 0;
    const rows = document.querySelectorAll('.role-row');
    let totalCost = 0;

    rows.forEach(row => {
        const salary = parseFloat(row.querySelector('.salary-value').value) || 0;
        const qty = parseInt(row.querySelector('.qty-input').value) || 0;

        const hourlyRate = salary / 2080;
        totalCost += (hourlyRate / 60) * duration * qty;
    });

    document.getElementById('total-cost').textContent = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(totalCost);
}

function exportCSV() {
    const duration = parseFloat(document.getElementById('duration').value) || 0;
    const rows = document.querySelectorAll('.role-row');

    const headers = ['Job Title', 'Quantity', 'Annual Salary', 'Hourly Rate', 'Duration (min)', 'Subtotal'];
    const csvRows = [headers];
    let totalCost = 0;

    rows.forEach(row => {
        const title = row.querySelector('.title-search').value || '(Untitled)';
        const salary = parseFloat(row.querySelector('.salary-value').value) || 0;
        const qty = parseInt(row.querySelector('.qty-input').value) || 0;
        const hourlyRate = salary / 2080;
        const subtotal = (hourlyRate / 60) * duration * qty;
        totalCost += subtotal;

        csvRows.push([
            `"${title.replace(/"/g, '""')}"`,
            qty,
            salary.toFixed(2),
            hourlyRate.toFixed(4),
            duration,
            subtotal.toFixed(2)
        ]);
    });

    csvRows.push(['', '', '', '', 'Total', totalCost.toFixed(2)]);

    const csvContent = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-cost-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

loadSalaries();
