function generateFields() {
    const numPeople = document.getElementById('numPeople').value;
    const inputFields = document.getElementById('inputFields');
    inputFields.innerHTML = '';

    for (let i = 0; i < numPeople; i++) {
        inputFields.innerHTML += `
            <div class="form-group">
                <label for="name${i}">Name ${i + 1}:</label>
                <input type="text" id="name${i}" required>
                <label for="contribution${i}">Contribution ${i + 1}:</label>
                <input type="number" id="contribution${i}" required>
            </div>
        `;
    }

    document.getElementById('calculateButton').style.display = 'block';
}

function calculateExpenses() {
    const numPeople = document.getElementById('numPeople').value;
    const names = [];
    const contributions = [];
    let totalSpent = 0.0;

    for (let i = 0; i < numPeople; i++) {
        names.push(document.getElementById(`name${i}`).value);
        const contribution = parseFloat(document.getElementById(`contribution${i}`).value);
        contributions.push(contribution);
        totalSpent += contribution;
    }

    const averageContribution = totalSpent / numPeople;
    const balances = contributions.map(contribution => contribution - averageContribution);

    displayResults(names, balances, totalSpent, averageContribution);
}

function displayResults(names, balances, totalSpent, averageContribution) {
    document.getElementById('totalSpent').innerText = `Total amount spent: ${totalSpent}`;
    document.getElementById('averageContribution').innerText = `Average contribution per person: ${averageContribution.toFixed(2)}`;

    const balancesDiv = document.getElementById('balances');
    balancesDiv.innerHTML = '<h3>Balances</h3>';
    balances.forEach((balance, i) => {
        balancesDiv.innerHTML += `<p>${names[i]}: ${balance.toFixed(2)}</p>`;
    });

    const settlements = calculateSettlements(names, balances);
    const settlementsDiv = document.getElementById('settlements');
    settlementsDiv.innerHTML = '<h3>Settlements</h3>';
    settlements.forEach(settlement => {
        settlementsDiv.innerHTML += `<p>${settlement}</p>`;
    });

    document.getElementById('resultArea').style.display = 'block';
}

function calculateSettlements(names, balances) {
    const settlements = [];
    const debtors = [];
    const creditors = [];

    balances.forEach((balance, i) => {
        if (balance < 0) {
            debtors.push({ name: names[i], balance });
        } else if (balance > 0) {
            creditors.push({ name: names[i], balance });
        }
    });

    debtors.sort((a, b) => a.balance - b.balance);
    creditors.sort((a, b) => b.balance - a.balance);

    while (debtors.length && creditors.length) {
        const debtor = debtors.shift();
        const creditor = creditors.shift();

        const settlementAmount = Math.min(-debtor.balance, creditor.balance);
        settlements.push(`${debtor.name} owes ${creditor.name} ${settlementAmount.toFixed(2)}`);

        debtor.balance += settlementAmount;
        creditor.balance -= settlementAmount;

        if (debtor.balance < 0) {
            debtors.push(debtor);
        }

        if (creditor.balance > 0) {
            creditors.push(creditor);
        }
    }

    return settlements;
}
