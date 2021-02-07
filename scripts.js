const Modal = {
    checkModal() {
        const modalOverlay = document.querySelector('.modal-overlay')
        if (modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active')
        } else {
            modalOverlay.classList.add('active')
        }
    }
}

const Transactions = {
    all : [
        {
            type: 'Extra',
            description: 'Luz',
            amount: -50000,
            date: '30/01/2021'
        },
        {
            type: 'Trabalho',
            description: 'Venda de site',
            amount: 500000,
            date: '30/01/2021'
        },
        {
            type: 'Alimentação',
            description: 'Internet',
            amount: -12000,
            date: '30/01/2021'
        },
    ],

    add(transaction){
        Transactions.all.push(transaction);
        App.reload();
    },
    remove(index){
        Transactions.all.splice(index, 1)
        App.reload()
    },
    incomes() {
        let income = 0;
        Transactions.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },
    expenses() {
        let expense = 0;
        Transactions.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },
    total() {
        return Transactions.incomes() + Transactions.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="type"><i class="small material-icons">${Form.getType(transaction.type)}</i></td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./assets/minus.svg" alt="Remover transação">
        </td>
        `
        return html
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transactions.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transactions.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })
        return (signal + value)
    },
    formatAmount(value){
        value = Number(value) * 100
        return value
    },
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    type: document.querySelector('select#transaction-type'),
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    getType(type){
        switch (type) {
            case 'Casa':
                return 'home'
            case 'Trabalho':
                return 'laptop'
            case 'Alimentação':
                return 'cake'
            case 'Lazer':
                return 'beach_access'
            case 'Extra':
                return 'local_offer'
            default: 
                return 'home'
        }
    },
    getValues(){
        return{
            type: Form.type.value,
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },
    validateFields() {
        const { description, amount, date } = Form.getValues()
        if(description.trim() == "" || amount.trim() == "" || date.trim() == "") {
            throw new Error("Por favor, preencha todos os campos.")
        }
    },
    formatValues() {
        let { type, description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            type,
            description,
            amount,
            date
        }
    },
    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()
        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transactions.add(transaction)
            console.log(Form.formatValues())
            Form.clearFields()
            Modal.checkModal()
            
        } catch (error) {
            alert(error.message)
        }

    }
}

const App = {
    init(){
        Transactions.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance();
    },
    reload(){
        DOM.clearTransactions();
        App.init();
    },
}

App.init()
