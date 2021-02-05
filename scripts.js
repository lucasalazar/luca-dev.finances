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
            type: 'Casa',
            description: 'Luz',
            amount: -50000,
            date: '30/01/2021'
        },
        {
            type: 'laptop',
            description: 'Venda de site',
            amount: 500000,
            date: '30/01/2021'
        },
        {
            type: 'lazer',
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

        const amount = Utils.fomratCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="type"><i class="small material-icons">${Form.getType()}</i></td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./assets/minus.svg" alt="Remover transação">
        </td>
        `
        return html
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.fomratCurrency(Transactions.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.fomratCurrency(Transactions.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.fomratCurrency(Transactions.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    fomratCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })
        return (signal + value)
    }
}

const Form = {
    type: document.querySelector('select#transaction-type'),
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    getType(){
        switch (Form.type.value) {
            case 'casa':
                return 'home'
            case 'trabalho':
                return 'laptop'
            case 'alimentacao':
                return 'local_pizza'
            case 'lazer':
                return 'beach_access'
            case 'extra':
                return 'local_offer'
            default: 
                return 'laptop'
        }
    },
    getValues(){
        return{
            type: Form.getType(),
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },
    validateFields() {
        console.log(Form.getValues())
    },
    submit(event) {
        event.preventDefault()
        Form.validateFields()
        //Form.formatData()
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
