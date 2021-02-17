const Modal = {
    toggle(){
        document.querySelector(".modal-overlay").classList.toggle("active")
    },

    errortoggleof(){
        document.querySelector(".alerterror").classList.remove("active")

    },

    errortoggle(){
        document.querySelector(".alerterror").classList.toggle("active")

    }
};

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("high.finances:transactions")) || []
    },

    Autoget() {
        return JSON.parse(localStorage.getItem("high.finances:autotransactions")) || []
    },

    set(transactions) {
        localStorage.setItem("high.finances:transactions",JSON.stringify(transactions))
    },
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

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
    return Transaction.incomes() + Transaction.expenses()
    },

}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction (transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {
        //? == if : == else
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})"  src="./assets/exclud.svg" alt="Excluir Transação"></td>
        `

        return html
    },

    updateBalance() {

        

        document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total())

         if (Transaction.total() < 0) {

                document.querySelector(".card.total").classList.add("negative")
            }else {
                document.querySelector(".card.total").classList.remove("negative")
            }


    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    },

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
    },

    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }

}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField() {
        const { description, amount, date } = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "" ) {
            throw new Error("Por favor, prencha todoas os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

            amount = Utils.formatAmount(amount)

            date = Utils.formatDate(date)
        return {
            description,
            amount,
            date,
        }

    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },
    submit(event) {
        event.preventDefault()

        try {
            Form.validateField()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.toggle()
            
        } catch (error) {
            document.querySelector(".alerterror").classList.toggle("active")
        }

    }
}

const AutoTransations = {
   Confirm() {
    const d = new Date(Date.now())
    const da = Number(new Intl.DateTimeFormat('pt-br', { day: '2-digit' }).format(d));

    const Array = Storage.Autoget()
    
    const indexOfDay = Array.reduce((acc, obj, index) =>{
        if(obj.day === da){
            acc.push(index);
        }

        return acc;
    }, [])

    console.log('Resultados', indexOfDay)
   },
}

const App = {
    init() {
    
        AutoTransations.Confirm()
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)

        
        
    },
    reload() {
        document.querySelector(".alerterror").classList.remove("active")
        DOM.clearTransactions()
        App.init()
    }
}

App.init()





