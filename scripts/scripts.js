const Modal = {
    toggle(){
        document.querySelector(".modal-overlay").classList.toggle("active")
    }
};

const transactions = [
{
    id: 1,
    description: "Luz",
    amount: -50000,
    date: "25/01/2021", 
}, 
{
    id: 2,
    description: "Faculdade",
    amount: -18700,
    date: "16/01/2021", 
}, 
{
    id: 3,
    description: "Freelancer",
    amount: 135000,
    date: "15/01/2021", 
} 
]

const Transaction = {
    all: transactions,
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    incomes() {

        let income = 0;

            Transaction.all.forEach((transaction) => {
                if(transaction.amount > 0) {
                    income += transaction.amount
                }
            })

        return income
    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach((transaction) => {
            if(transaction.amount < 0) {
                expense += transaction.amount
            }
        })

    return expense
    },

    total() {
    return Transaction.all.incomes() + Transaction.all.expenses()
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction (transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction) {
        //? == if : == else
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img src="./assets/minus.svg" alt=""></td>
        `

        return html
    },

    updateBalance() {

        

        document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "- " : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency:"BRL"
        })

        return signal + value
    }

}

const App = {
    init() {
        
        Transaction.all.forEach((transaction) => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance()
        
    },
    reload() {
        App.init()
    }
}

App.init()

Transaction.add({
    id: null,
    description: "",
    amount: null,
    date: "23/01/2021"
})



